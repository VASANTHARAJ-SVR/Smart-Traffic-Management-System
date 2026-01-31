from fastapi import FastAPI, WebSocket, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
from vision_detection.server import VisionServer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
vision_server = VisionServer()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/analyze")
async def websocket_endpoint(websocket: WebSocket):
    await vision_server.handle_websocket(websocket)

@app.post("/analyze/image")
async def analyze_image(file: UploadFile):
    return await vision_server.analyze_image(file)

if __name__ == "__main__":
    print("Starting Vision Detection Server...")
    print("Available at: http://localhost:8000")
    print("WebSocket endpoint: ws://localhost:8000/ws/analyze")
    print("REST endpoint: http://localhost:8000/analyze/image")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )