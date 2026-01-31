import os
os.environ['KMP_DUPLICATE_LIB_OK']='True'  # Fix potential OpenMP issues

# Import torch and set num threads before other imports
import torch
torch.set_num_threads(1)

import cv2
import numpy as np
from ultralytics import YOLO
import easyocr
import pandas as pd
from datetime import datetime
import re
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def clean_plate_text(text):
    """Clean the license plate text by removing spaces and special characters"""
    # Remove spaces and special characters
    text = re.sub(r'[^A-Z0-9]', '', text.upper())
    return text

def validate_plate_text(text):
    """Validate Indian license plate text format"""
    # Indian license plate patterns
    patterns = [
        r'^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$',  # Format: MH02AB1234 or KA01A1234
        r'^[A-Z]{2}\d{1,2}[A-Z]{1,2}\d{4}$', # Format: DL1AB1234 or UP9A1234
        r'^[A-Z]{3}\d{4}$',                   # Format: DLX1234 (Old format)
        r'^[A-Z]{2}\d{3,4}$',                 # Format: MH1234 (Very old format)
        r'^[A-Z]{2}\d{2}[A-Z]{2}\d{1,4}$'    # Format: HR26DK1234 or HR26DK123
    ]
    
    # Additional validation rules for Indian plates
    if not text or len(text) < 4 or len(text) > 10:
        return False
    
    # Must contain at least one number
    if not re.search(r'\d', text):
        return False
    
    # Must contain at least one letter
    if not re.search(r'[A-Z]', text):
        return False
    
    # First two characters must be letters (state code)
    if not re.match(r'^[A-Z]{2}', text):
        return False
    
    text = text.upper().strip()
    return any(re.match(pattern, text) for pattern in patterns)

def preprocess_plate_image(plate_img):
    """Preprocess the license plate image for better OCR"""
    try:
        # Resize image - Indian plates typically have 1:2 to 1:3 aspect ratio
        height = 200
        aspect_ratio = plate_img.shape[1] / plate_img.shape[0]
        
        # Adjusted aspect ratio check for Indian plates
        if aspect_ratio < 2.0 or aspect_ratio > 4.0:
            return None, None, None
            
        width = int(height * aspect_ratio)
        plate_img = cv2.resize(plate_img, (width, height))
        
        # Convert to grayscale
        gray = cv2.cvtColor(plate_img, cv2.COLOR_BGR2GRAY)
        
        # Enhanced contrast for Indian plates
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
        enhanced = clahe.apply(gray)
        
        # Stronger denoising for Indian plates
        denoised = cv2.bilateralFilter(enhanced, 11, 17, 17)
        
        # Adaptive thresholding with parameters suited for Indian plates
        binary = cv2.adaptiveThreshold(denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                                     cv2.THRESH_BINARY_INV, 19, 9)
        
        # Enhanced morphological operations for Indian plates
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3,3))
        morph = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
        morph = cv2.morphologyEx(morph, cv2.MORPH_OPEN, kernel)
        
        return morph, enhanced, gray
    except Exception as e:
        logger.error(f"Error in preprocessing: {str(e)}")
        return None, None, None

class CameraProcessor:
    def __init__(self, save_dir='plates'):
        """Initialize the camera processor with proper error handling"""
        try:
            self.save_dir = Path(save_dir)
            self.save_dir.mkdir(exist_ok=True)
            
            # Initialize log file
            self.log_df = self._initialize_log_file()
            
            # Initialize YOLO model
            logger.info("Initializing YOLO model...")
            model_path = 'yolov8n.pt'
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found: {model_path}")
            
            self.model = YOLO(model_path)
            self.model.conf = 0.3
            self.model.iou = 0.45
            
            # Initialize EasyOCR
            logger.info("Initializing EasyOCR...")
            self.reader = easyocr.Reader(['en'], gpu=False)
            
            logger.info("Camera processor initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize camera processor: {str(e)}")
            raise

    def _initialize_log_file(self):
        """Initialize or load the log file"""
        log_file = 'numberplate_log.xlsx'
        try:
            if os.path.exists(log_file):
                return pd.read_excel(log_file)
            else:
                return pd.DataFrame(columns=[
                    'Timestamp', 'Number_Plate', 'Image_Path',
                    'Confidence', 'Violation_Type'
                ])
        except Exception as e:
            logger.error(f"Error initializing log file: {str(e)}")
            return pd.DataFrame(columns=[
                'Timestamp', 'Number_Plate', 'Image_Path',
                'Confidence', 'Violation_Type'
            ])

    def process_frame(self, frame):
        """Process a single frame with proper error handling"""
        try:
            if frame is None or frame.size == 0:
                logger.warning("Received empty frame")
                return None
                
            # Enhance frame quality
            frame = cv2.GaussianBlur(frame, (5, 5), 0)
            frame = cv2.convertScaleAbs(frame, alpha=1.2, beta=10)
            
            # Run YOLO detection
            results = self.model(frame, conf=0.25, iou=0.45)
            if not results:
                return None
                
            detections = []
            for result in results:
                boxes = result.boxes
                for box in boxes:
                    try:
                        conf = float(box.conf[0])
                        x1, y1, x2, y2 = map(int, box.xyxy[0])
                        
                        # Extract plate region with padding
                        plate_region = frame[y1:y2, x1:x2]
                        if plate_region.size == 0:
                            continue
                            
                        # Process plate
                        binary, enhanced, gray = preprocess_plate_image(plate_region)
                        if binary is None:
                            continue
                            
                        # Try OCR with different preprocessed images
                        best_text = None
                        max_length = 0
                        
                        for img in [binary, enhanced, gray]:
                            try:
                                results = self.reader.readtext(
                                    img,
                                    allowlist='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                                    batch_size=1,
                                    detail=0,
                                    paragraph=True
                                )
                                
                                if results:
                                    for text in results:
                                        text = clean_plate_text(text)
                                        if len(text) > max_length and validate_plate_text(text):
                                            max_length = len(text)
                                            best_text = text
                            except Exception as ocr_err:
                                logger.error(f"OCR error: {str(ocr_err)}")
                                continue
                        
                        if best_text:
                            timestamp = datetime.now()
                            img_name = f"plates/{timestamp.strftime('%Y%m%d_%H%M%S')}.jpg"
                            
                            # Save images
                            cv2.imwrite(img_name, plate_region)
                            cv2.imwrite(img_name.replace('.jpg', '_enhanced.jpg'), enhanced)
                            
                            detection = {
                                'timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                                'number_plate': best_text,
                                'confidence': float(conf),
                                'image_path': img_name,
                                'bbox': [int(x1), int(y1), int(x2), int(y2)]
                            }
                            
                            detections.append(detection)
                            
                            # Log detection
                            self._log_detection(detection)
                            
                    except Exception as box_err:
                        logger.error(f"Error processing detection box: {str(box_err)}")
                        continue
            
            return detections
            
        except Exception as e:
            logger.error(f"Error processing frame: {str(e)}")
            return None

    def _log_detection(self, detection):
        """Log a detection to the Excel file"""
        try:
            new_record = pd.DataFrame({
                'Timestamp': [detection['timestamp']],
                'Number_Plate': [detection['number_plate']],
                'Image_Path': [detection['image_path']],
                'Confidence': [detection['confidence']],
                'Violation_Type': ['None']
            })
            
            self.log_df = pd.concat([new_record, self.log_df], ignore_index=True)
            self.log_df.to_excel('numberplate_log.xlsx', index=False)
            
        except Exception as e:
            logger.error(f"Error logging detection: {str(e)}") 