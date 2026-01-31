import torch
from ultralytics import YOLO
from datetime import datetime
import cv2
import numpy as np
from collections import deque
from typing import Dict
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define vehicle classes mapping
VEHICLE_CLASSES = {
    0: 'person',
    1: 'bicycle',
    2: 'car',
    3: 'motorcycle',
    5: 'bus',
    7: 'truck'
}

def initialize_models():
    """Initialize YOLO models with proper error handling"""
    try:
        logger.info("Initializing YOLO models...")
        
        # Check if model file exists
        model_path = 'yolov8n.pt'
        if not os.path.exists(model_path):
            logger.error(f"Model file not found: {model_path}")
            raise FileNotFoundError(f"Model file not found: {model_path}")
        
        # YOLOv8 model for vehicle detection with optimized settings
        vehicle_model = YOLO(model_path)
        vehicle_model.conf = 0.3  # Lower confidence threshold for better detection
        vehicle_model.iou = 0.45  # Lower IOU threshold
        vehicle_model.max_det = 50  # Limit maximum detections
        vehicle_model.classes = [0, 1, 2, 3, 5, 7]  # Only detect relevant classes
        
        # Configure model for GPU inference if available
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        logger.info(f"Using device: {device}")
        vehicle_model.to(device)
        
        # Test model with a dummy inference
        dummy_img = np.zeros((640, 640, 3), dtype=np.uint8)
        vehicle_model(dummy_img, verbose=False)
        
        logger.info("Models initialized successfully")
        return vehicle_model
        
    except Exception as e:
        logger.error(f"Error initializing models: {str(e)}")
        raise

# Initialize models
try:
    vehicle_model = initialize_models()
except Exception as e:
    logger.error(f"Failed to initialize models: {str(e)}")
    raise

class VehicleTracker:
    def __init__(self):
        self.tracked_vehicles = {}
        self.next_id = 0
        self.speed_threshold = 50  # km/h
        self.min_distance = 20  # pixels
        self.max_tracking_age = 15  # Reduced for faster cleanup
        self.position_history = {}
        self.history_length = 3  # Reduced for smoother tracking
        self.cleanup_interval = 5  # Frames between cleanup operations
        self.frame_count = 0
        self.last_cleanup = 0

    def _match_vehicle(self, center, area):
        """Match a detected vehicle with existing tracked vehicles based on position and size."""
        min_dist = float('inf')
        matched_id = None
        
        for vid, vehicle in self.tracked_vehicles.items():
            # Calculate Euclidean distance between centers
            dx = center[0] - vehicle['center'][0]
            dy = center[1] - vehicle['center'][1]
            dist = (dx * dx + dy * dy) ** 0.5
            
            # Check if distance is within threshold
            if dist < min_dist and dist < self.min_distance * (1 + abs(vehicle.get('speed', 0)) / 50):
                min_dist = dist
                matched_id = vid
        
        if matched_id is None:
            matched_id = self.next_id
            self.next_id += 1
            
        return matched_id

    def update(self, detections, frame_size):
        self.frame_count += 1
        current_vehicles = {}
        violations = []
        current_time = datetime.now()
        
        # Process new detections
        detected_ids = set()
        for det in detections:
            for box in det.boxes:
                try:
                    # Fast tensor to numpy conversion
                    xyxy = box.xyxy[0].cpu().numpy()
                    x1, y1, x2, y2 = map(int, xyxy)
                    conf = float(box.conf[0].cpu().numpy())
                    cls_id = int(box.cls[0].cpu().numpy())
                    
                    if cls_id in VEHICLE_CLASSES and conf > 0.3:
                        center = ((x1 + x2) // 2, (y1 + y2) // 2)
                        vehicle_type = VEHICLE_CLASSES[cls_id]
                        
                        # Fast vehicle matching
                        vehicle_id = self._match_vehicle(center, (x2-x1)*(y2-y1))
                        detected_ids.add(vehicle_id)
                        
                        if vehicle_id not in self.position_history:
                            self.position_history[vehicle_id] = deque(maxlen=self.history_length)
                        
                        self.position_history[vehicle_id].append(center)
                        
                        # Efficient position smoothing
                        if len(self.position_history[vehicle_id]) > 1:
                            positions = np.array(self.position_history[vehicle_id])
                            smoothed_center = tuple(map(int, np.mean(positions, axis=0)))
                        else:
                            smoothed_center = center
                        
                        current_vehicles[vehicle_id] = {
                            'center': smoothed_center,
                            'type': vehicle_type,
                            'bbox': (x1, y1, x2, y2),
                            'timestamp': current_time,
                            'speed': 0,
                            'confidence': conf,
                            'tracking_age': 0
                        }
                        
                        # Update speed and check violations
                        if vehicle_id in self.tracked_vehicles:
                            self._update_vehicle_speed(vehicle_id, current_vehicles, violations)
                            
                except Exception as e:
                    logger.error(f"Error processing detection: {str(e)}")
                    continue
        
        # Efficient cleanup of old tracks
        if self.frame_count - self.last_cleanup >= self.cleanup_interval:
            self._cleanup_old_tracks(current_vehicles, detected_ids)
            self.last_cleanup = self.frame_count
        
        self.tracked_vehicles = current_vehicles
        return violations

    def _update_vehicle_speed(self, vehicle_id, current_vehicles, violations):
        prev = self.tracked_vehicles[vehicle_id]
        time_diff = (current_vehicles[vehicle_id]['timestamp'] - prev['timestamp']).total_seconds()
        
        if time_diff > 0:
            # Calculate speed using numpy for efficiency
            curr_pos = np.array(current_vehicles[vehicle_id]['center'])
            prev_pos = np.array(prev['center'])
            distance = np.linalg.norm(curr_pos - prev_pos)
            
            current_speed = distance / time_diff * 3.6
            prev_speed = prev.get('speed', 0)
            smoothed_speed = 0.7 * current_speed + 0.3 * prev_speed
            current_vehicles[vehicle_id]['speed'] = smoothed_speed
            
            if smoothed_speed > self.speed_threshold * 1.1:
                violations.append({
                    'type': 'speed',
                    'vehicle_id': vehicle_id,
                    'vehicle_type': current_vehicles[vehicle_id]['type'],
                    'speed': smoothed_speed,
                    'timestamp': current_vehicles[vehicle_id]['timestamp'].isoformat()
                })

    def _cleanup_old_tracks(self, current_vehicles, detected_ids):
        for vid in list(self.tracked_vehicles.keys()):
            if vid not in detected_ids:
                tracking_age = self.tracked_vehicles[vid].get('tracking_age', 0) + 1
                if tracking_age < self.max_tracking_age:
                    current_vehicles[vid] = self.tracked_vehicles[vid].copy()
                    current_vehicles[vid]['tracking_age'] = tracking_age
                else:
                    if vid in self.position_history:
                        del self.position_history[vid]

class TrafficAnalyzer:
    def __init__(self):
        self.vehicle_tracker = VehicleTracker()
        self.frame_skip = 2  # Process every nth frame
        self.frame_count = 0
        self.last_frame_time = None
        self.fps_alpha = 0.1
        self.processing = False
        self.max_congestion_vehicles = 50  # Maximum number of vehicles for 100% congestion

    def calculate_congestion(self, total_vehicles, frame_shape):
        """Calculate congestion level based on vehicle count and frame size."""
        area_factor = (frame_shape[0] * frame_shape[1]) / (1920 * 1080)  # Normalize by typical HD resolution
        normalized_max = self.max_congestion_vehicles * area_factor
        congestion = min(total_vehicles / normalized_max, 1.0) if normalized_max > 0 else 0
        return float(congestion)

    async def analyze_frame(self, frame) -> Dict:
        if self.processing:
            return None
            
        self.processing = True
        try:
            self.frame_count += 1
            if self.frame_count % self.frame_skip != 0:
                self.processing = False
                return None

            if frame is None or frame.size == 0:
                logger.error("Invalid frame received")
                return None

            # Resize frame for faster processing
            height, width = frame.shape[:2]
            if width > 1280:  # Limit max width for processing
                scale = 1280 / width
                width = 1280
                height = int(height * scale)
                frame = cv2.resize(frame, (width, height))

            # Calculate FPS
            current_time = datetime.now()
            if self.last_frame_time:
                fps = 1 / (current_time - self.last_frame_time).total_seconds()
            else:
                fps = 30
            self.last_frame_time = current_time

            # Run detection with batching and error handling
            try:
                results = vehicle_model(frame, verbose=False)
                if not results or len(results) == 0:
                    logger.warning("No detection results")
                    return self._create_empty_response(current_time, frame.shape[:2])
            except Exception as e:
                logger.error(f"Error in YOLO detection: {str(e)}")
                return self._create_empty_response(current_time, frame.shape[:2])
            
            # Process results
            vehicle_count = {vtype: 0 for vtype in ['person', 'car', 'motorcycle', 'bus', 'truck', 'bicycle']}
            total_vehicles = 0
            detections = []
            
            # Efficient detection processing
            for result in results:
                boxes = result.boxes
                if len(boxes) == 0:
                    continue
                    
                try:
                    # Batch process all detections
                    cls_ids = boxes.cls.cpu().numpy().astype(int)
                    confs = boxes.conf.cpu().numpy()
                    xyxys = boxes.xyxy.cpu().numpy()
                    
                    for cls_id, conf, xyxy in zip(cls_ids, confs, xyxys):
                        if conf > 0.3 and cls_id in VEHICLE_CLASSES:
                            x1, y1, x2, y2 = map(int, xyxy)
                            object_type = VEHICLE_CLASSES[cls_id]
                            
                            detections.append({
                                'type': object_type,
                                'confidence': float(conf),
                                'bbox': [x1, y1, x2, y2],
                                'id': None
                            })
                            
                            if object_type in vehicle_count:
                                vehicle_count[object_type] += 1
                                total_vehicles += 1
                except Exception as e:
                    logger.error(f"Error processing detection box: {str(e)}")
                    continue

            # Update tracking with error handling
            try:
                violations = self.vehicle_tracker.update(results, frame.shape[:2])
            except Exception as e:
                logger.error(f"Error updating vehicle tracking: {str(e)}")
                violations = []

            # Update detection IDs efficiently
            try:
                for det in detections:
                    bbox = det['bbox']
                    center = ((bbox[0] + bbox[2]) // 2, (bbox[1] + bbox[3]) // 2)
                    det['id'] = self.vehicle_tracker._match_vehicle(
                        center,
                        (bbox[2] - bbox[0]) * (bbox[3] - bbox[1])
                    )
            except Exception as e:
                logger.error(f"Error updating detection IDs: {str(e)}")

            return {
                'timestamp': current_time.isoformat(),
                'total_vehicles': total_vehicles,
                'vehicle_types': vehicle_count,
                'average_speed': self._calculate_average_speed(),
                'congestion_level': self.calculate_congestion(total_vehicles, frame.shape[:2]),
                'noise_level': 0,  # Skip noise analysis for performance
                'accidents_detected': False,  # Skip accident detection for performance
                'traffic_violations': violations,
                'emergency_vehicles': 0,
                'traffic_density': total_vehicles / (frame.shape[0] * frame.shape[1]) * 1000000,
                'fps': fps,
                'detections': detections
            }
        except Exception as e:
            logger.error(f"Error analyzing frame: {str(e)}")
            if self.last_frame_time:
                return self._create_empty_response(current_time, frame.shape[:2])
            return None
        finally:
            self.processing = False

    def _create_empty_response(self, current_time, frame_shape):
        """Create an empty response when detection fails."""
        return {
            'timestamp': current_time.isoformat(),
            'total_vehicles': 0,
            'vehicle_types': {vtype: 0 for vtype in ['person', 'car', 'motorcycle', 'bus', 'truck', 'bicycle']},
            'average_speed': 0,
            'congestion_level': 0,
            'noise_level': 0,
            'accidents_detected': False,
            'traffic_violations': [],
            'emergency_vehicles': 0,
            'traffic_density': 0,
            'fps': 0,
            'detections': []
        }

    def _calculate_average_speed(self):
        try:
            speeds = [v.get('speed', 0) for v in self.vehicle_tracker.tracked_vehicles.values()]
            if not speeds:
                return 0
            return float(np.mean(speeds))
        except Exception as e:
            logger.error(f"Error calculating average speed: {str(e)}")
            return 0