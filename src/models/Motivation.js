import mongoose from 'mongoose';

const MotivationSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  }
});

export default mongoose.models.Motivation || mongoose.model('Motivation', MotivationSchema);
