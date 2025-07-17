import pool from "@/lib/dp";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { patient_id, doctor_id } = req.query;
    
    if (!patient_id && !doctor_id) {
      return res.status(400).json({ message: 'Missing patient ID or doctor ID' });
    }

    let connection;
    try {
      connection = await pool.getConnection();
      
      let queryStr;
      let queryParams;
      
      if (patient_id) {
        queryStr = `
          SELECT a.id, a.time, d.name AS doctor_name, d.specialty 
          FROM appointment a
          JOIN doctor d ON a.doctor_id = d.id
          WHERE a.patient_id = ?
        `;
        queryParams = [patient_id];
      } else if (doctor_id) {
        queryStr = `
          SELECT a.id, a.time, p.name AS patient_name, p.phone AS patient_phone
          FROM appointment a
          JOIN patient p ON a.patient_id = p.id
          WHERE a.doctor_id = ?
        `;
        queryParams = [doctor_id];
      }
      
      const [appointments] = await connection.execute(queryStr, queryParams);
      
      res.status(200).json(appointments);
    } catch (error) {
      console.error('Appointments fetch error:', error);
      res.status(500).json({ message: 'Error fetching appointments' });
    } finally {
      if (connection) connection.release();
    }
  } 
  else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}