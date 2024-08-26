// pages/api/create.js
import client from '../../db/elastic';

export async function POST(request) {
    const { title, description } = await request.json();

    try {
        const result = await client.index({
            index: 'my-index',
            body: { title, description }
        });
        return new Response(JSON.stringify(result.body), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}