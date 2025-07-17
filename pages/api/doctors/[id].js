import pool from "@/lib/dp";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const [rows] = await pool.query(
        'SELECT id, name, phone, avfrom, avto, specialty FROM doctor WHERE id = ?', 
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Doctor not found' });
      }

      return res.status(200).json(rows[0]);
    }

    if (req.method === 'PUT') {
      const { name, phone, avfrom, avto, specialty } = req.body;

      const [updateResult] = await pool.query(
        `UPDATE doctor 
         SET name = ?, phone = ?, avfrom = ?, avto = ?, specialty = ?
         WHERE id = ?`,
        [name, phone, avfrom, avto, specialty, id]
      );

      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ error: 'Doctor not found' });
      }

      const [updatedRows] = await pool.query(
        'SELECT id, name, phone, avfrom, avto, specialty FROM doctor WHERE id = ?',
        [id]
      );

      return res.status(200).json(updatedRows[0]);
    }

    res.setHeader('Allow', ['GET', 'PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
    
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}