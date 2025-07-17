import pool from "@/lib/dp";

export default async function handler(req, res) {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM doctor');
    connection.release();
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
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