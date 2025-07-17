import pool from "@/lib/dp";

export default async (req, res) => {
    const { id, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM patient WHERE id = ? AND password = ?', [id, password]);
        if (rows.length === 1) {
          res.status(200).json({ message: 'Login successful' });
        } else {
          res.status(401).json({ error: 'Invalid ID or password' });
        }
      } catch (error) {
        console.error('Database query failed:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
  };