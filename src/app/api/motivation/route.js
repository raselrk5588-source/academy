import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import Motivation from '../../../models/Motivation';

export async function GET() {
  try {
    await connectToDatabase();
    
    const count = await Motivation.countDocuments();
    if (count === 0) {
      return NextResponse.json({ error: 'No motivations found' }, { status: 404 });
    }

    // Get the current day of the month (1-31)
    const dayOfMonth = new Date().getDate();
    
    // Use dayOfMonth as index to pick a quote (using modulo to ensure it stays within bounds)
    // So on the 1st of the month, we show quote 1. On the 30th, quote 30.
    const skipIndex = (dayOfMonth - 1) % count;
    
    const quote = await Motivation.findOne().skip(skipIndex);

    return NextResponse.json({ quote });
  } catch (error) {
    console.error('API Error fetching motivation:', error);
    return NextResponse.json({ error: 'Failed to fetch motivation' }, { status: 500 });
  }
}
