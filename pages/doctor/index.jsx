import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

export default function DoctorDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    avfrom: '',
    avto: '',
    specialty: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'appointments'
  const [appointments, setAppointments] = useState([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);

  // Fetch doctor data on component mount
  useEffect(() => {
    if (!user) {
      router.push('/LogInDoc');
      return;
    }

    const fetchDoctorData = async () => {
      try {
        const response = await fetch(`/api/doctors/${user.id}`);
        const data = await response.json();
        if (response.ok) {
          setDoctor(data);
          setFormData({
            name: data.name,
            phone: data.phone,
            avfrom: data.avfrom,
            avto: data.avto,
            specialty: data.specialty
          });
        } else {
          throw new Error(data.error || 'Failed to fetch doctor data');
        }
      } catch (error) {
        setMessage({ text: error.message, type: 'error' });
      }
    };

    fetchDoctorData();
  }, [user, router]);

  // Fetch appointments when appointments tab is active
  useEffect(() => {
    if (activeTab === 'appointments' && user) {
      fetchAppointments();
    }
  }, [activeTab, user]);

  const fetchAppointments = async () => {
    setIsLoadingAppointments(true);
    try {
      const response = await fetch(`/api/app?doctor_id=${user.id}`);
      const data = await response.json();
      if (response.ok) {
        setAppointments(data);
      } else {
        throw new Error(data.message || 'Failed to fetch appointments');
      }
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/doctors/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setDoctor(data);
        setIsEditing(false);
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    // Extract just the time part if it includes a date
    const timeOnly = timeString.includes('T') 
      ? timeString.split('T')[1].substring(0, 5)
      : timeString.substring(0, 5);
      
    const [hours, minutes] = timeOnly.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  if (!doctor) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with logo and tabs */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/">
                <div className="flex items-center cursor-pointer">
                  <Image 
                    src="/logo.svg" 
                    alt="Logo" 
                    width={50} 
                    height={50} 
                  />
                  <span className="ml-3 text-xl font-bold text-blue-800">MediCare</span>
                </div>
              </Link>
              
              <nav className="ml-10 flex space-x-4">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'profile'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  My Profile
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'appointments'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Appointments
                </button>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'schedule'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  My Schedule
                </button>
                <Link 
                  href="/doctor/BTD"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  ScanPath AI
                </Link>
                <Link 
                  href="/doctor/try"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Blood test for heart diseases
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Status Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-md ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message.text}
          </div>
        )}

        {activeTab === 'profile' ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Doctor Information</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and availability</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-md ${isEditing ? 'bg-gray-200 text-gray-800' : 'bg-blue-600 text-white'} hover:bg-blue-700 transition-colors`}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <div className="sm:divide-y sm:divide-gray-200">
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <label htmlFor="name" className="text-sm font-medium text-gray-500">Full name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 sm:mt-0 sm:col-span-2 border rounded-md px-3 py-2 w-full"
                      required
                    />
                  </div>

                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-500">Phone number</label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 sm:mt-0 sm:col-span-2 border rounded-md px-3 py-2 w-full"
                      required
                    />
                  </div>

                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <label htmlFor="specialty" className="text-sm font-medium text-gray-500">Specialty</label>
                    <select
                      name="specialty"
                      id="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      className="mt-1 sm:mt-0 sm:col-span-2 border rounded-md px-3 py-2 w-full"
                      required
                    >
                      <option value="Dentist">Dentist</option>
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Orthopedic">Orthopedic</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Otology">Otology</option>
                      <option value="General Doctor">General Doctor</option>
                      <option value="Surgeon">Surgeon</option>
                      <option value="Psychotropic">Psychotropic</option>
                      <option value="Eye Specilist">Eye Specilist</option>
                    </select>
                  </div>

                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <label className="text-sm font-medium text-gray-500">Availability</label>
                    <div className="mt-1 sm:mt-0 sm:col-span-2 flex space-x-4">
                      <div className="flex-1">
                        <label htmlFor="avfrom" className="block text-sm text-gray-500 mb-1">From</label>
                        <input
                          type="time"
                          name="avfrom"
                          id="avfrom"
                          value={formData.avfrom}
                          onChange={handleInputChange}
                          className="border rounded-md px-3 py-2 w-full"
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <label htmlFor="avto" className="block text-sm text-gray-500 mb-1">To</label>
                        <input
                          type="time"
                          name="avto"
                          id="avto"
                          value={formData.avto}
                          onChange={handleInputChange}
                          className="border rounded-md px-3 py-2 w-full"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="py-4 px-4 sm:px-6 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Full name</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{doctor.name}</dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{doctor.phone}</dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Specialty</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{doctor.specialty}</dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Availability</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {doctor.avfrom} - {doctor.avto}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        ) : activeTab === 'appointments' ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Appointments</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Your upcoming appointments</p>
            </div>
            
            <div className="border-t border-gray-200">
              {isLoadingAppointments ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : appointments.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-gray-500">No appointments scheduled</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointments.map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.patient_name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatTime(appointment.time)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {appointment.patient_phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Confirmed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">My Schedule</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Your weekly availability</p>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <div className="py-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-800">Your Weekly Schedule</h4>
                </div>
                
                <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                  You're available from <span className="font-bold">{doctor.avfrom}</span> to <span className="font-bold">{doctor.avto}</span> on weekdays.
                </p>
                
                <div className="grid grid-cols-7 gap-2 max-w-2xl mx-auto">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="border rounded-lg p-3 text-center">
                      <div className="font-medium text-gray-700">{day}</div>
                      <div className="text-sm text-green-600 mt-1">
                        {['Sat', 'Sun'].includes(day) ? 'Closed' : `${doctor.avfrom} - ${doctor.avto}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}