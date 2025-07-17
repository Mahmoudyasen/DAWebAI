import pool from "@/lib/dp";

export default async (req, res) => {
    if (req.method === 'GET') {
        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        try {
            const query = 'SELECT * FROM appointments WHERE UId = ?';
            const [rows] = await pool.query(query, [user_id]);
            res.status(200).json(rows);
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ error: "Couldn't fetch appointments" });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
process.on('SIGINT', async () => {
    console.log('Closing all database connections.');
    await closePool();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    console.log('Closing all database connections.');
    await closePool();
    process.exit(0);
  });