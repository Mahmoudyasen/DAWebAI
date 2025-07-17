import pool from "@/lib/dp";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { patient_id, doctor_id, time } = req.body;
    
    // Validate required fields
    if (!patient_id || !doctor_id || !time) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let connection;
    try {
      connection = await pool.getConnection();

      // Check doctor availability
      const [doctor] = await connection.execute(
        'SELECT avfrom, avto FROM doctor WHERE id = ?',
        [doctor_id]
      );
      
      if (!doctor.length) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      
      const { avfrom, avto } = doctor[0];
      const [hour, minute] = time.split(':').map(Number);
      
      // Convert to minutes for comparison
      const appointmentMinutes = hour * 60 + minute;
      const [avfromHour, avfromMin] = avfrom.split(':').map(Number);
      const [avtoHour, avtoMin] = avto.split(':').map(Number);
      const avfromMinutes = avfromHour * 60 + avfromMin;
      const avtoMinutes = avtoHour * 60 + avtoMin;
      
      // Validate appointment time
      //if (appointmentMinutes < avfromMinutes || appointmentMinutes > avtoMinutes) {
        //return res.status(400).json({ 
          //message: `Doctor only available between ${avfrom} and ${avto}`
        //});
      //}
      
      // Create appointment
      const [result] = await connection.execute(
        `INSERT INTO appointment (patient_id, doctor_id, time) 
         VALUES (?, ?, ?)`,
        [patient_id, doctor_id, time]
      );
      
      res.status(201).json({ 
        message: 'Appointment booked!', 
        id: result.insertId 
      });
    } catch (error) {
      console.error('Booking error:', error);
      res.status(500).json({ message: 'Error booking appointment' });
    } finally {
      if (connection) connection.release();
    }
  } 
  else if (req.method === 'GET') {
    const { patient_id } = req.query;
    
    if (!patient_id) {
      return res.status(400).json({ message: 'Missing patient ID' });
    }

    let connection;
    try {
      connection = await pool.getConnection();
      
      const [appointments] = await connection.execute(
        `SELECT a.id, a.time, d.name AS doctor_name, d.specialty 
         FROM appointment a
         JOIN doctor d ON a.doctor_id = d.id
         WHERE a.patient_id = ?`,
        [patient_id]
      );
      
      res.status(200).json(appointments);
    } catch (error) {
      console.error('Appointments fetch error:', error);
      res.status(500).json({ message: 'Error fetching appointments' });
    } finally {
      if (connection) connection.release();
    }
  } 
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}