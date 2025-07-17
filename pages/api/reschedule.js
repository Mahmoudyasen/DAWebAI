import pool from "@/lib/dp";
import { useRouter } from 'next/router';

export default async (req, res) => {
    if (req.method === 'PUT') {
        const { appointmentId, newAppointmentTime } = req.body;

        console.log('Received values:', { appointmentId, newAppointmentTime });

        try {
            if (newAppointmentTime !== undefined && newAppointmentTime !== null) {
                const query = 'UPDATE appointments SET AppointmentTime = ? WHERE AId = ?';
                await pool.query(query, [newAppointmentTime, appointmentId]);
                res.status(200).json({ message: 'Appointment time has been updated successfully' });
            } else {
                res.status(400).json({ error: 'New appointment time is required' });
            }
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ error: "Couldn't update appointment time" });
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