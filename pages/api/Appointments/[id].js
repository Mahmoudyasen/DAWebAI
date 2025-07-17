import pool from "@/lib/dp";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    // Reschedule appointment
    const { time } = req.body;
    
    if (!time) {
      return res.status(400).json({ message: 'Missing time parameter' });
    }

    let connection;
    try {
      connection = await pool.getConnection();

      // Get doctor availability
      const [appointment] = await connection.query(
        'SELECT doctor_id FROM appointment WHERE id = ?',
        [id]
      );

      if (!appointment.length) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      const doctorId = appointment[0].doctor_id;
      
      // Get doctor availability
      const [doctor] = await connection.query(
        'SELECT avfrom, avto FROM doctor WHERE id = ?',
        [doctorId]
      );

      if (!doctor.length) {
        return res.status(404).json({ message: 'Doctor not found' });
      }

      const { avfrom, avto } = doctor[0];
      
      // Validate new time
      const [hour, minute] = time.split(':').map(Number);
      const [avfromHour, avfromMin] = avfrom.split(':').map(Number);
      const [avtoHour, avtoMin] = avto.split(':').map(Number);
      
      const appointmentMinutes = hour * 60 + minute;
      const avfromMinutes = avfromHour * 60 + avfromMin;
      const avtoMinutes = avtoHour * 60 + avtoMin;
      
      if (appointmentMinutes < avfromMinutes || appointmentMinutes > avtoMinutes) {
        return res.status(400).json({ 
          message: `Doctor only available between ${avfrom} and ${avto}`
        });
      }

      // Update appointment
      await connection.query(
        'UPDATE appointment SET time = ? WHERE id = ?',
        [`${time}:00`, id] // Convert to HH:MM:SS format
      );

      res.status(200).json({ message: 'Appointment rescheduled successfully' });
    } catch (error) {
      console.error('Rescheduling error:', error);
      res.status(500).json({ message: 'Error rescheduling appointment' });
    } finally {
      if (connection) connection.release();
    }
  } 
  else if (req.method === 'DELETE') {
    // Cancel appointment
    let connection;
    try {
      connection = await pool.getConnection();
      
      // Check if appointment exists
      const [appointment] = await connection.query(
        'SELECT * FROM appointment WHERE id = ?',
        [id]
      );

      if (!appointment.length) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      // Delete appointment
      await connection.query(
        'DELETE FROM appointment WHERE id = ?',
        [id]
      );

      res.status(200).json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
      console.error('Cancellation error:', error);
      res.status(500).json({ message: 'Error cancelling appointment' });
    } finally {
      if (connection) connection.release();
    }
  } 
  else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}