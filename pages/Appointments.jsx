import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Modal from 'react-modal';
import RootLayout from '@/-components/layout';

Modal.setAppElement('#__next');

export default function Appointments() {
  const { user } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newTime, setNewTime] = useState('');
  const [actionType, setActionType] = useState(''); // 'cancel' or 'reschedule'
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!user) {
      router.push('/LogIn');
      return;
    }

    fetchAppointments();
  }, [user, router]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`/api/appointments?patient_id=${user.id}`);
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      setStatusMessage({ type: 'error', text: 'Failed to load appointments' });
    } finally {
      setIsLoading(false);
    }
  };

  const openActionModal = (appointment, action) => {
    setSelectedAppointment(appointment);
    setActionType(action);
    setIsModalOpen(true);
    
    if (action === 'reschedule') {
      setNewTime(appointment.time.slice(0, 5)); // Pre-fill with current time (HH:mm format)
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
    setActionType('');
    setNewTime('');
    setStatusMessage({ type: '', text: '' });
  };

  const handleCancel = async () => {
    try {
      const response = await fetch(`/api/Appointments/${selectedAppointment.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setStatusMessage({ type: 'success', text: 'Appointment cancelled successfully' });
        // Refresh appointments after successful cancellation
        setTimeout(() => {
          fetchAppointments();
          closeModal();
        }, 1500);
      } else {
        const errorData = await response.json();
        setStatusMessage({ type: 'error', text: errorData.message || 'Failed to cancel appointment' });
      }
    } catch (error) {
      console.error('Cancellation error:', error);
      setStatusMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  const handleReschedule = async () => {
    try {
      const response = await fetch(`/api/Appointments/${selectedAppointment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time: newTime })
      });

      if (response.ok) {
        setStatusMessage({ type: 'success', text: 'Appointment rescheduled successfully' });
        // Refresh appointments after successful rescheduling
        setTimeout(() => {
          fetchAppointments();
          closeModal();
        }, 1500);
      } else {
        const errorData = await response.json();
        setStatusMessage({ type: 'error', text: errorData.message || 'Failed to reschedule appointment' });
      }
    } catch (error) {
      console.error('Rescheduling error:', error);
      setStatusMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <RootLayout>
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>My Appointments</title>
        <meta name="description" content="View your scheduled appointments" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">
          My Appointments
        </h1>

        {/* Status Message */}
        {statusMessage.text && (
          <div className={`mb-6 p-4 rounded-lg text-center ${
            statusMessage.type === 'success' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {statusMessage.text}
          </div>
        )}

        {/* Action Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          className="modal"
          overlayClassName="modal-overlay"
        >
          {selectedAppointment && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {actionType === 'cancel' ? 'Cancel Appointment' : 'Reschedule Appointment'}
              </h2>
              
              <div className="mb-6">
                <p className="mb-2">
                  <span className="font-semibold">Doctor:</span> Dr. {selectedAppointment.doctor_name}
                </p>
                <p className="mb-2">
                  <span className="font-semibold">Specialty:</span> {selectedAppointment.specialty}
                </p>
                <p>
                  <span className="font-semibold">
                    {actionType === 'cancel' ? 'Scheduled Time:' : 'Current Time:'}
                  </span> {formatTime(selectedAppointment.time)}
                </p>
              </div>
              
              {actionType === 'reschedule' && (
                <div className="mb-6">
                  <label className="block mb-2 font-medium text-gray-700">
                    New Appointment Time
                  </label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Doctor available: {selectedAppointment.avfrom} - {selectedAppointment.avto}
                  </p>
                </div>
              )}
              
              {statusMessage.text && (
                <div className={`mb-4 p-3 rounded-lg ${
                  statusMessage.type === 'success' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {statusMessage.text}
                </div>
              )}
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={actionType === 'cancel' ? handleCancel : handleReschedule}
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${
                    actionType === 'cancel'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  disabled={actionType === 'reschedule' && !newTime}
                >
                  {actionType === 'cancel' ? 'Confirm Cancellation' : 'Reschedule'}
                </button>
              </div>
            </div>
          )}
        </Modal>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-lg mb-4">You have no scheduled appointments</p>
            <button
              onClick={() => router.push('/AllDoctors')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Book an Appointment
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specialty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          Dr. {appointment.doctor_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.specialty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTime(appointment.time)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openActionModal(appointment, 'reschedule')}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => openActionModal(appointment, 'cancel')}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
    </RootLayout>
  );
}