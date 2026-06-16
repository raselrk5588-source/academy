import { NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Book from '../../../models/Book';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    await connectDB();
    const books = await Book.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: books });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const formData = await request.formData();
    const title = formData.get('title');
    const author = formData.get('author');
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads
    const uploadDir = join(process.cwd(), 'public/uploads');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {}

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = join(uploadDir, fileName);
    
    await writeFile(filePath, buffer);

    const newBook = await Book.create({
      title,
      author,
      fileName
    });

    return NextResponse.json({ success: true, data: newBook });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
