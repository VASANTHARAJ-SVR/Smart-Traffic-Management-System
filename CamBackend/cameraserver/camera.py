import cv2
import numpy as np
from ultralytics import YOLO
import easyocr
import pandas as pd
from datetime import datetime
import re

def clean_plate_text(text):
    # Remove spaces and special characters
    text = re.sub(r'[^A-Z0-9]', '', text.upper())
    return text

def validate_plate_text(text):
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
        
        # Enhanced contrast for Indian plates which often have varying backgrounds
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
        print(f"Error in preprocessing: {str(e)}")
        return None, None, None

def initialize_models():
    try:
        print("Loading YOLO model...")
        # Use a custom-trained model if available, otherwise use standard model
        model = YOLO('yolov8n.pt')
        # Configure model for Indian license plate detection
        model.conf = 0.3    # Slightly higher confidence for Indian plates
        model.iou = 0.4     # Adjusted IOU threshold
        model.max_det = 5   # Limit maximum detections per frame
        model.classes = [2] # Focus on car detection (class 2 in COCO)
        
        print("Model configured for Indian license plate detection")
        
        # Initialize EasyOCR with settings optimized for Indian plates
        print("Initializing EasyOCR...")
        reader = easyocr.Reader(['en'], gpu=False,
                              model_storage_directory='./models',
                              download_enabled=True,
                              verbose=False,
                              recog_network='english_g2')  # Better for Indian plates
        
        return model, reader
    except Exception as e:
        print(f"Error initializing models: {str(e)}")
        return None, None

def process_frame(frame, model, reader):
    try:
        # Enhance frame quality
        frame = cv2.GaussianBlur(frame, (5, 5), 0)
        frame = cv2.convertScaleAbs(frame, alpha=1.2, beta=10)  # Increase contrast slightly

        # Run YOLO detection with optimized settings
        results = model(frame, conf=0.25, iou=0.45)  # Lower thresholds for better detection
        
        best_plate = None
        max_confidence = 0
        
        for result in results:
            boxes = result.boxes
            for box in boxes:
                try:
                    conf = float(box.conf[0])
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    
                    # Extract potential plate region with padding
                    width = x2 - x1
                    height = y2 - y1
                    
                    # Add padding around the detection
                    padding_x = int(width * 0.2)
                    padding_y = int(height * 0.2)
                    x1 = max(0, x1 - padding_x)
                    y1 = max(0, y1 - padding_y)
                    x2 = min(frame.shape[1], x2 + padding_x)
                    y2 = min(frame.shape[0], y2 + padding_y)
                    
                    plate_region = frame[y1:y2, x1:x2]
                    if plate_region.size == 0:
                        continue

                    # Try multiple preprocessing methods
                    binary, enhanced, gray = preprocess_plate_image(plate_region)
                    if binary is None:
                        continue
                    
                    # Try OCR with different preprocessed images
                    best_text = None
                    max_length = 0
                    
                    for img in [binary, enhanced, gray]:
                        try:
                            results = reader.readtext(
                                img,
                                allowlist='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                                batch_size=1,
                                detail=0,
                                paragraph=True,
                                contrast_ths=0.2,
                                adjust_contrast=0.5,
                                text_threshold=0.4  # Lower text threshold for better detection
                            )
                            
                            if results:
                                for text in results:
                                    text = clean_plate_text(text)
                                    if len(text) > max_length and validate_plate_text(text):
                                        max_length = len(text)
                                        best_text = text
                        except Exception as ocr_err:
                            continue
                    
                    if best_text:
                        if conf > max_confidence:
                            max_confidence = conf
                            timestamp = datetime.now()
                            img_name = f"plates/{timestamp.strftime('%Y%m%d_%H%M%S')}.jpg"
                            
                            # Save both original and enhanced regions
                            cv2.imwrite(img_name, plate_region)
                            cv2.imwrite(img_name.replace('.jpg', '_enhanced.jpg'), enhanced)
                            
                            best_plate = {
                                'timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                                'number_plate': best_text,
                                'confidence': float(conf),
                                'image_path': img_name,
                                'bbox': [int(x1), int(y1), int(x2), int(y2)]
                            }
                            
                            # Log detection
                            new_record = pd.DataFrame({
                                'Timestamp': [timestamp],
                                'Number_Plate': [best_text],
                                'Image_Path': [img_name],
                                'Confidence': [float(conf)],
                                'Violation_Type': ['None']
                            })
                            
                            global log_df
                            log_df = pd.concat([new_record, log_df], ignore_index=True)
                            log_df.to_excel('numberplate_log.xlsx', index=False)
                            
                            print(f"Detected plate: {best_text} with confidence: {conf}")
                except Exception as box_err:
                    print(f"Error processing box: {str(box_err)}")
                    continue
        
        return best_plate
    except Exception as e:
        print(f"Error in process_frame: {str(e)}")
        return None