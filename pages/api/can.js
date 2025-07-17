import pool from "@/lib/dp";

export default async (req, res) => {
    if (req.method === 'DELETE') {
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.status(400).json({ error: 'Appointment ID is required' });
        }

        console.log('Received value for deletion:', appointmentId);

        try {
            const query = 'DELETE FROM appointments WHERE AId = ?';
            await pool.query(query, [appointmentId]);
            res.status(200).json({ message: 'Appointment has been deleted successfully' });
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ error: "Couldn't delete the appointment" });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};

process.on('SIGINT', async () => {
    console.log('Closing all database connections.');
    await pool.end();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Closing all database connections.');
    await pool.end();
    process.exit(0);
});
