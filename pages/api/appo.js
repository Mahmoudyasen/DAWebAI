import pool from "@/lib/dp";
import { useRouter } from 'next/router';
export default async (req, res) => {
    if (req.method === 'POST') {
        const { userId, doctorId, date } = req.body;

        console.log('Received values:', { userId, doctorId, date });

        try {
            const query = 'INSERT INTO appointments (UId, DId, AppointmentTime) VALUES (?, ?, ?)';
            await pool.query(query, [userId, doctorId, date]);
            res.status(201).json({ message: 'Appointment has been created successfully' });
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ error: "Couldn't Create new Appointment" });
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
