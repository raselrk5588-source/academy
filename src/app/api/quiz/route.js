import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Question from '../../../models/Question';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    // Use MongoDB aggregation pipeline with $sample to get exactly 20 random documents
    const questions = await Question.aggregate([
      { $match: { category: category } },
      { $sample: { size: 20 } }
    ]);

    // Ensure we don't send the MongoDB internal _id if we want clean responses,
    // though it's fine. We map it nicely.
    const formattedQuestions = questions.map(q => ({
      id: q._id.toString(),
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer
    }));

    return NextResponse.json({ questions: formattedQuestions });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch questions', details: error.message }, { status: 500 });
  }
}
