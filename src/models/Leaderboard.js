import mongoose from 'mongoose';

const LeaderboardSchema = new mongoose.Schema({
  playerName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50
  },
  score: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  }
}, { timestamps: true });

export default mongoose.models.Leaderboard || mongoose.model('Leaderboard', LeaderboardSchema);
