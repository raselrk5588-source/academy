import mongoose from 'mongoose';

const FlashcardSchema = new mongoose.Schema({
  q: {
    type: String,
    required: true
  },
  a: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.models.Flashcard || mongoose.model('Flashcard', FlashcardSchema);
