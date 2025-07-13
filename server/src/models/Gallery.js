import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  public_id: { 
    type: String, 
    required: true 
  },
  url: { 
    type: String, 
    required: true 
  },
  filename: { 
    type: String, 
    required: true 
  },
  format: { 
    type: String, 
    required: true 
  },
  bytes: { 
    type: Number, 
    required: true 
  },
  width: Number,
  height: Number,
  tags: { 
    type: [String], 
    default: [] 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { versionKey: false });

export default mongoose.model('Gallery', gallerySchema);