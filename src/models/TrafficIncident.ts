import mongoose, { Schema, Document } from 'mongoose';

export interface ITrafficIncident extends Document {
  incidentType: string;
  location: string;
  timeStamp: Date;
  description: string;
  status: 'active' | 'resolved' | 'pending';
  reportedBy: string;
  severityLevel: number;
  affectedLanes: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

const TrafficIncidentSchema: Schema = new Schema({
  incidentType: { 
    type: String, 
    required: true,
    enum: ['accident', 'roadblock', 'traffic jam', 'construction', 'event', 'other']
  },
  location: { 
    type: String, 
    required: true 
  },
  timeStamp: { 
    type: Date, 
    default: Date.now 
  },
  description: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    required: true, 
    enum: ['active', 'resolved', 'pending'],
    default: 'active'
  },
  reportedBy: { 
    type: String, 
    required: true 
  },
  severityLevel: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5 
  },
  affectedLanes: { 
    type: Number, 
    required: true 
  },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  }
}, {
  timestamps: true
});

export default mongoose.model<ITrafficIncident>('TrafficIncident', TrafficIncidentSchema); 