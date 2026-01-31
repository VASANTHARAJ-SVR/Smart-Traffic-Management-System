from fastapi import FastAPI, WebSocket, HTTPException, UploadFile, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import cv2
import numpy as np
import base64
import logging
import asyncio
from .analyzer import TrafficAnalyzer
from typing import Set, Dict
from concurrent.futures import ThreadPoolExecutor

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize thread pool for image processing
thread_pool = ThreadPoolExecutor(max_workers=2)

class VisionServer:
    def __init__(self):
        self.analyzer = TrafficAnalyzer()
        self.active_connections: Set[WebSocket] = set()
        self.processing_lock = asyncio.Lock()
        self.frame_interval = 1/30  # Target 30 FPS
        self.consecutive_errors = 0
        self.max_consecutive_errors = 5

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)
        logger.info("Client connected")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info("Client disconnected")

    def decode_frame(self, frame_data: str) -> np.ndarray:
        try:
            # Validate frame data format
            if not frame_data.startswith('data:image'):
                raise ValueError("Invalid frame data format")

            # Decode base64 image
            frame_bytes = base64.b64decode(frame_data.split(',')[1])
            nparr = np.frombuffer(frame_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if frame is None or frame.size == 0:
                raise ValueError("Failed to decode image")
                
            return frame
        except Exception as e:
            logger.error(f"Error decoding frame: {str(e)}")
            return None

    async def process_frame(self, frame_data: str) -> Dict:
        try:
            if not frame_data or not isinstance(frame_data, str):
                logger.warning("Invalid frame data")
                return None

            # Decode frame in thread pool
            frame = await asyncio.get_event_loop().run_in_executor(
                thread_pool,
                self.decode_frame,
                frame_data
            )
            
            if frame is None:
                self.consecutive_errors += 1
                if self.consecutive_errors >= self.max_consecutive_errors:
                    logger.error("Too many consecutive frame decoding errors")
                return None

            # Process frame with rate limiting
            async with self.processing_lock:
                results = await self.analyzer.analyze_frame(frame)
                if results is not None:
                    self.consecutive_errors = 0
                return results

        except Exception as e:
            logger.error(f"Error processing frame: {str(e)}")
            self.consecutive_errors += 1
            return None

    async def handle_websocket(self, websocket: WebSocket):
        await self.connect(websocket)
        last_process_time = 0
        
        try:
            while True:
                try:
                    # Receive frame data with timeout
                    data = await asyncio.wait_for(
                        websocket.receive_json(),
                        timeout=5.0
                    )
                    
                    if not data or 'frame' not in data:
                        continue

                    # Rate limiting
                    current_time = asyncio.get_event_loop().time()
                    time_since_last = current_time - last_process_time
                    if time_since_last < self.frame_interval:
                        await asyncio.sleep(self.frame_interval - time_since_last)

                    # Process frame
                    results = await self.process_frame(data['frame'])
                    if results:
                        await websocket.send_json(results)
                        last_process_time = asyncio.get_event_loop().time()
                    elif self.consecutive_errors >= self.max_consecutive_errors:
                        logger.error("Too many consecutive errors, closing connection")
                        break
                    
                except asyncio.TimeoutError:
                    continue
                except WebSocketDisconnect:
                    logger.info("WebSocket disconnected normally")
                    break
                except Exception as e:
                    logger.error(f"Error in WebSocket loop: {str(e)}")
                    self.consecutive_errors += 1
                    if self.consecutive_errors >= self.max_consecutive_errors:
                        break
                    await asyncio.sleep(1)
                    continue
                
        except Exception as e:
            logger.error(f"WebSocket error: {str(e)}")
        finally:
            self.disconnect(websocket)

    async def analyze_image(self, file: UploadFile) -> Dict:
        try:
            contents = await file.read()
            nparr = np.frombuffer(contents, np.uint8)
            image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if image is None or image.size == 0:
                raise ValueError("Failed to decode image")

            async with self.processing_lock:
                results = await self.analyzer.analyze_frame(image)
                if results is None:
                    raise ValueError("Failed to analyze image")
                return results

        except Exception as e:
            logger.error(f"Error analyzing image: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Error processing image: {str(e)}"
            )