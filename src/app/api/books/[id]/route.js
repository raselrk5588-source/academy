import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Book from '../../../../models/Book';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params; // Next.js 15 params is async
    
    const book = await Book.findById(id);
    if (!book) {
      return NextResponse.json({ success: false, error: 'Book not found' }, { status: 404 });
    }

    // Delete file
    try {
      const filePath = join(process.cwd(), 'public/uploads', book.fileName);
      await unlink(filePath);
    } catch (e) {
      console.log('File already deleted or error', e);
    }

    await Book.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
