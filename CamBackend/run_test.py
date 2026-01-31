import os
import sys
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def main():
    try:
        # Get the current directory
        current_dir = os.path.dirname(os.path.abspath(__file__))
        logger.info(f"Current directory: {current_dir}")
        
        # Change to the Backend directory if not already there
        if os.path.basename(current_dir) != 'Backend':
            backend_dir = os.path.join(current_dir, 'Backend')
            if os.path.exists(backend_dir):
                os.chdir(backend_dir)
                logger.info(f"Changed directory to: {backend_dir}")
            else:
                logger.info("Already in Backend directory")
        
        # Check if YOLO model exists
        if not os.path.exists('yolov8n.pt'):
            logger.error("YOLO model not found. Please download it first.")
            logger.info("You can download it using: wget https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt")
            return
        
        # Create plates directory if it doesn't exist
        os.makedirs('plates', exist_ok=True)
        
        # Run the test script
        logger.info("Running test_camera.py...")
        from test_camera import main as test_main
        test_main()
        
    except Exception as e:
        logger.error(f"Error running test: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main() 