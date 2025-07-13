// models/Contact.js
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['read', 'unread'], 
    default: 'unread' 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Contact', contactSchema);