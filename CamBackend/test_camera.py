import os
os.environ['KMP_DUPLICATE_LIB_OK']='True'

import torch
torch.set_num_threads(1)

import cv2
import logging
from camera import CameraProcessor
import time
from datetime import datetime
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def main():
    try:
        # Check YOLO model
        model_path = 'yolov8n.pt'
        if not os.path.exists(model_path):
            logger.error(f"YOLO model not found at {model_path}")
            logger.info("Please download it using:")
            logger.info("wget https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt")
            return

        # Initialize camera processor
        logger.info("Initializing camera processor...")
        processor = CameraProcessor()
        
        # Initialize video capture
        logger.info("Opening video capture...")
        cap = cv2.VideoCapture(0)  # Use default camera
        
        if not cap.isOpened():
            raise RuntimeError("Failed to open camera. Please check if camera is connected.")
            
        # Set camera properties for better quality
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
        cap.set(cv2.CAP_PROP_FPS, 30)
        
        # Create output directory for frames
        output_dir = "output_frames"
        os.makedirs(output_dir, exist_ok=True)
        
        frame_count = 0
        max_frames = 100  # Process 100 frames then stop
        
        logger.info("Starting main loop...")
        while frame_count < max_frames:
            try:
                ret, frame = cap.read()
                if not ret or frame is None:
                    logger.error("Failed to read frame")
                    break
                
                # Process frame
                detections = processor.process_frame(frame)
                
                # Draw detections and save frame
                if detections:
                    for detection in detections:
                        x1, y1, x2, y2 = detection['bbox']
                        # Draw green rectangle around plate
                        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                        # Draw plate number above the rectangle
                        cv2.putText(frame, detection['number_plate'],
                                  (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX,
                                  0.9, (0, 255, 0), 2)
                        
                        logger.info(f"Detected plate: {detection['number_plate']} with confidence: {detection['confidence']:.2f}")
                
                # Save frame with timestamp
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
                output_path = os.path.join(output_dir, f"frame_{timestamp}.jpg")
                cv2.imwrite(output_path, frame)
                
                frame_count += 1
                logger.info(f"Processed frame {frame_count}/{max_frames}")
                
                # Small delay to prevent high CPU usage
                time.sleep(0.1)
                
            except KeyboardInterrupt:
                logger.info("Interrupted by user")
                break
            except Exception as frame_error:
                logger.error(f"Error processing frame: {str(frame_error)}")
                continue
            
    except Exception as e:
        logger.error(f"Error in main loop: {str(e)}")
        return 1
        
    finally:
        logger.info("Cleaning up...")
        if 'cap' in locals():
            cap.release()
        
        logger.info("Processing completed successfully")
        return 0

if __name__ == "__main__":
    sys.exit(main()) 