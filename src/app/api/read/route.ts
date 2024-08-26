import client from '../../db/elastic';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await client.search({
      index: 'my-index', // Ensure this is your actual index name
      body: {
        query: {
          match_all: {} // Fetch all documents
        },
        size: 10000 // Adjust based on expected number of results
      }
    });
    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error('Error fetching documents:', error.message);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
