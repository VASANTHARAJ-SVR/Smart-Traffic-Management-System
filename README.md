# Smart Traffic Management System

**AI-powered traffic monitoring and enforcement platform with real-time vehicle detection, number plate recognition, and intelligent traffic management for law enforcement agencies.**

---

## 📋 Overview

Smart Traffic is a comprehensive intelligent traffic management solution that combines mobile applications, AI/ML vision systems, and cloud backend services. It enables traffic police to monitor violations, issue e-challans, track vehicle recovery, and manage traffic incidents in real-time using advanced computer vision and geolocation technologies.

### 🎯 Key Features

- **📱 Cross-Platform Mobile App** (iOS, Android, Web)
  - Real-time traffic incident dashboard
  - E-challan generation and management
  - Vehicle recovery and tracking
  - Number plate scanning and detection
  - Traffic heat map visualization
  - AI-powered chatbot assistance
  - Profile and settings management

- **🚗 AI/ML Vision System**
  - Real-time vehicle detection using YOLOv8
  - Automatic number plate recognition (ANPR)
  - Vehicle speed detection
  - Traffic flow analysis
  - Incident classification and reporting

- **🔧 Backend Infrastructure**
  - RESTful API with Express.js
  - MongoDB database for persistence
  - Real-time traffic simulation
  - Vehicle owner database management
  - Authentication and authorization
  - Camera server integration

- **🗺️ Advanced Features**
  - Interactive traffic heat maps
  - Real-time map-based traffic visualization
  - Geolocation-based incident tracking
  - Vehicle recovery case management
  - Document verification
  - Multi-factor authentication

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React Native with Expo
- TypeScript
- React Navigation
- React Native Paper (UI)
- React Native Maps
- Context API for state management

**Backend:**
- Node.js + Express.js
- TypeScript
- MongoDB
- REST API

**AI/ML & Vision:**
- Python 3
- YOLOv8 (Object Detection)
- EasyOCR (Optical Character Recognition)
- OpenCV (Image Processing)
- FastAPI (Vision Server)

### Project Structure

```
├── App.tsx                    # Root application component
├── package.json              # Frontend dependencies
├── src/
│   ├── components/           # Reusable React components
│   ├── screens/              # Application screens
│   ├── navigation/           # Navigation configuration
│   ├── services/             # API services
│   ├── context/              # Context providers
│   ├── config/               # Configuration files
│   ├── models/               # TypeScript models
│   ├── theme/                # Theme configuration
│   └── utils/                # Utility functions
├── backend/
│   └── src/
│       ├── routes/           # API endpoints
│       ├── controllers/      # Business logic
│       ├── models/           # Database models
│       ├── middleware/       # Custom middleware
│       └── config/           # Server configuration
├── CamBackend/               # Python Vision Server
│   ├── vision_detection/     # YOLOv8 detection modules
│   ├── cameraserver/         # Camera integration
│   ├── requirements.txt      # Python dependencies
│   └── yolov8n.pt           # Pre-trained YOLOv8 model
└── assets/
    └── models/               # ML models and weights
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- MongoDB 8.0.5+
- Expo CLI
- npm or yarn

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the root directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/traffic_police_db
   MONGODB_DB_NAME=traffic_police_db
   NODE_ENV=development
   ```

3. **Start the development server:**
   ```bash
   npm start          # Web
   npm run android    # Android
   npm run ios        # iOS
   ```

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   npm install
   ```

2. **Start backend server:**
   ```bash
   npm start
   ```

### Python Vision Server Setup

1. **Install dependencies:**
   ```bash
   cd CamBackend
   pip install -r requirements.txt
   ```

2. **Start vision server:**
   ```bash
   python run_vision_server.py
   ```

### Database Setup

1. **Seed initial data:**
   ```bash
   npm run seed-vehicle-owners
   npm run export-vehicle-data
   ```

2. **Test MongoDB connection:**
   ```bash
   npm run test-db
   ```

---

## 📖 Usage

### Mobile Application

- **Dashboard:** View real-time traffic incidents and statistics
- **Traffic Management:** Monitor and manage traffic conditions
- **E-Challan:** Issue digital violation tickets with automatic detection
- **Number Plate Scanning:** Scan and identify vehicles
- **Vehicle Recovery:** Track and manage vehicle recovery cases
- **Simulation:** Test traffic scenarios and patterns

### Vision Detection API

The Python backend provides real-time vision detection capabilities:
- Vehicle detection and classification
- Number plate detection and OCR
- Real-time video stream processing
- Incident detection and classification

---

## 🔧 Key NPM Scripts

```bash
npm start                    # Start development server (web)
npm run android             # Start on Android emulator
npm run ios                 # Start on iOS simulator
npm run web                 # Start web version
npm run test-db             # Test MongoDB connection
npm run seed-vehicle-owners # Seed vehicle owner data
npm run export-vehicle-data # Export vehicle data
```

---

## 📦 Dependencies

### Critical Frontend Dependencies
- `react-native` - Mobile UI framework
- `expo` - Development platform
- `react-navigation` - Navigation library
- `react-native-maps` - Map integration
- `react-native-paper` - Material Design UI

### Critical Backend Dependencies
- `express` - Web framework
- `mongoose` - MongoDB ORM
- `typescript` - Type safety

### Critical ML/Vision Dependencies
- `ultralytics` - YOLOv8 implementation
- `easyocr` - OCR engine
- `opencv-python` - Image processing
- `fastapi` - API framework

---

## 🎓 Key Screens & Features

### Authentication
- Login and registration
- Role-based access control

### Dashboard
- Traffic overview
- Incident statistics
- Real-time alerts

### Traffic Management
- Heat map visualization
- Live traffic monitoring
- Incident reporting

### E-Challan
- Automatic violation detection
- Digital ticket generation
- Payment tracking

### Number Plate Detection
- Real-time scanning
- Vehicle identification
- Owner lookup

### Vehicle Recovery
- Case management
- Status tracking
- Documentation

---

## 🔐 Security Features

- JWT-based authentication
- Role-based authorization
- Environment variable configuration
- Secure database connections
- Input validation and sanitization

---

## 📊 Database Models

- **VehicleOwner** - Vehicle owner information
- **TrafficIncident** - Incident reports and data
- **EChallan** - Digital violation tickets
- **VehicleRecovery** - Vehicle recovery cases
- **User** - Application users with roles

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Support

For support, issues, or feature requests, please open an issue on GitHub or contact the development team.

---

## 🙏 Acknowledgments

- YOLOv8 for advanced object detection
- React Native and Expo communities
- MongoDB for database solutions
- All contributors and team members

---

**Last Updated:** January 31, 2026
