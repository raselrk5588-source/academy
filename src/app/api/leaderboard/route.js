import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Leaderboard from '../../../models/Leaderboard';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectToDatabase();
    
    // Fetch top 50 scores, sorted by score (descending) and then date (ascending)
    const leaderboard = await Leaderboard.find({})
      .sort({ score: -1, createdAt: 1 })
      .limit(50)
      .lean();

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error("Leaderboard GET Error:", error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { playerName, score, totalQuestions, category } = body;

    if (!playerName || score === undefined || !totalQuestions || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newScore = await Leaderboard.create({
      playerName,
      score,
      totalQuestions,
      category
    });

    return NextResponse.json({ success: true, data: newScore }, { status: 201 });
  } catch (error) {
    console.error("Leaderboard POST Error:", error);
    return NextResponse.json({ error: 'Failed to submit score' }, { status: 500 });
  }
}
