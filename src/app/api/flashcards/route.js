import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Flashcard from '../../../models/Flashcard';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectToDatabase();
    
    // Use MongoDB aggregation pipeline with $sample to get exactly 100 random documents
    const flashcards = await Flashcard.aggregate([
      { $sample: { size: 100 } }
    ]);

    const formattedCards = flashcards.map(c => ({
      id: c._id.toString(),
      q: c.q,
      a: c.a
    }));

    return NextResponse.json({ flashcards: formattedCards });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch flashcards' }, { status: 500 });
  }
}
