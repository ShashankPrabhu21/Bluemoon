import { NextResponse } from 'next/server';
import pool from '@/lib/db'; // Adjust the path if needed

interface RequestContext {
    params: {
        id: string;
    };
}

export async function DELETE(
    _: Request, 
    context: RequestContext
) {
    const { id } = context.params;

    if (!id || isNaN(Number(id))) {
        return NextResponse.json({ error: 'Invalid video ID' }, { status: 400 });
    }

    try {
        const query = 'DELETE FROM gallery WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Video not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Video deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting video:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


