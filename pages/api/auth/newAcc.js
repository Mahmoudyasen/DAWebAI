import pool from "@/lib/dp";

export default async (req, res) => {
    if (req.method === 'POST') {
      const { id, name, sname, password, dob, phone} = req.body;
      try {
        await pool.query('INSERT INTO patient (id, name, sname, password, dob, phone) VALUES (?, ?, ?, ?, ?, ?)', [id, name, sname, password, dob, phone]);
        res.status(201).json({ message: 'User has been created' });
      } catch (error) {
        res.status(500).json({ error: "Coudln't Create new User" });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  };