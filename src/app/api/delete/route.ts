// pages/api/delete.js
import client from '../../db/elastic';
import { NextResponse } from 'next/server';

export async function DELETE(request) {
    try {
        const { id } = await request.json(); // Extract document ID from request body

        // Validate that ID is provided
        if (!id) {
            return new NextResponse(
                JSON.stringify({ error: 'Document ID is required' }),
                { status: 400 }
            );
        }

        // Perform the delete operation
        const result = await client.delete({
            index: 'my-index', // Ensure this is your actual index name
            id, // Document ID to delete
        });

        return new NextResponse(JSON.stringify(result.body), { status: 200 });
    } catch (error) {
        console.error('Error deleting document:', error.message);
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
