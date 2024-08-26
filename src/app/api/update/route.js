// pages/api/update.js
import client from '../../db/elastic';
import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    const { id, title, description } = await request.json(); // Extract data from request body

    // Validate that ID is provided
    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: 'Document ID is required' }),
        { status: 400 }
      );
    }

    // Perform the update operation
    const result = await client.update({
      index: 'my-index', // Ensure this is your actual index name
      id, // Document ID to update
      body: {
        doc: { title, description }, // Update fields
      },
    });

    return new NextResponse(JSON.stringify(result.body), { status: 200 });
  } catch (error) {
    console.error('Error updating document:', error.message);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
