// /api/editvideo/[id].js
import { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/db'; // Assuming your database connection is in '@/lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid video ID' });
  }

  if (req.method === 'PUT') {
    try {
      const { title, description, category } = req.body;

      if (!title || !description || !category) {
        return res.status(400).json({ error: 'Missing required fields in the request body' });
      }

      const query = `
        UPDATE cooking_videos
        SET title = $1, description = $2, category = $3, updated_at = NOW()
        WHERE id = $4
      `;
      const values = [title, description, category, parseInt(id)];

      const result = await db.query(query, values);

      if (result.rowCount > 0) {
        return res.status(200).json({ message: 'Video metadata updated successfully' });
      } else {
        return res.status(404).json({ error: 'Video not found' });
      }
    } catch (error) {
      console.error('Database update error:', error);
      return res.status(500).json({ error: 'Failed to update video metadata' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed. Only PUT requests are supported for this endpoint.' });
  }
}