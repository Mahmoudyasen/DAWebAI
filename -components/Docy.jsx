import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import Modal from 'react-modal';

const Cat = [
    {
        id: 0,
        name: 'All',
        path: '/AllDoctors',
        svgPath: '/all.svg'
    },
    {
        id: 1,
        name: 'Dentist',
        path: '/AllDoctors',
        svgPath: '/Dentist.svg'
    },
    {
        id: 2,
        name: 'Cardiologist',
        path: '/AllDoctors',
        svgPath: '/Cardio.svg'
    },
    {
        id: 3,
        name: 'Orthopedic',
        path: '/AllDoctors',
        svgPath: '/Ort.svg'
    },
    {
        id: 4,
        name: 'Neurologist',
        path: '/AllDoctors',
        svgPath: '/neur.svg'
    },
    {
        id: 5,
        name: 'Otology',
        path: '/AllDoctors',
        svgPath: '/oto.svg'
    },
    {
        id: 6,
        name: 'General Doctor',
        path: '/AllDoctors',
        svgPath: '/GD.svg'
    },
    {
        id: 7,
        name: 'Surgon',
        path: '/AllDoctors',
        svgPath: '/S.svg'
    },
    {
        id: 8,
        name: 'Psychotropic',
        path: '/AllDoctors',
        svgPath: '/psy.svg'
    },
    {
        id: 9,
        name: 'Eye Specilist',
        path: '/AllDoctors',
        svgPath: '/eye.svg'
    },
];

Modal.setAppElement('#__next');



export default function AllDoctors() {
    const router = useRouter();
    const { query } = router;
    const [doctors, setDoctors] = useState([]);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState('All');
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [appointmentTime, setAppointmentTime] = useState('');
    const [bookingStatus, setBookingStatus] = useState(null);


    const handleBookAppointment = (doctor) => {
        if (!user) {
            router.push('/LogIn');
        } else {
            setSelectedDoctor(doctor);
            setIsModalOpen(true);
        }
    };

    const confirmAppointment = async () => {
        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patient_id: user.id,
                    doctor_id: selectedDoctor.id,
                    time: appointmentTime
                })
            });

            if (response.ok) {
                setBookingStatus('success');
                setTimeout(() => {
                    setIsModalOpen(false);
                    setBookingStatus(null);
                }, 2000);
            } else {
                setBookingStatus('error');
            }
        } catch (error) {
            console.error('Booking error:', error);
            setBookingStatus('error');
        }
    };

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch('/api/doc');
                const data = await response.json();
                setDoctors(data);
                setIsLoading(false);
                setIsInitialLoad(false);
            } catch (error) {
                console.error('Error fetching doctors:', error);
                setIsLoading(false);
                setIsInitialLoad(false);
            }
        };

        fetchDoctors();
    }, []);

    // Set initial specialty from query parameter
    useEffect(() => {
        if (query.specialty) {
            const validSpecialty = Cat.find(c => c.name === query.specialty)?.name;
            if (validSpecialty) {
                setSelectedSpecialty(validSpecialty);
            }
        }
    }, [query.specialty]);

    // Filter doctors based on selected specialty
    useEffect(() => {
        if (selectedSpecialty === 'All') {
            setFilteredDoctors(doctors);
        } else {
            const filtered = doctors.filter(doctor => doctor.specialty === selectedSpecialty);
            setFilteredDoctors(filtered);
        }
    }, [selectedSpecialty, doctors]);

    if (isInitialLoad) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Head>
                <title>Our Doctors</title>
                <meta name="description" content="Browse our team of professional doctors" />
            </Head>

            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">Our Medical Team</h1>

                {/* Specialty Filter Menu */}
                <div className="mb-10">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Filter by Specialty:</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {Cat.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedSpecialty(category.name)}
                                className={`flex flex-col items-center p-3 rounded-lg transition-all ${selectedSpecialty === category.name ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white hover:bg-gray-100 border border-gray-200'}`}
                            >
                                <div className="w-12 h-12 relative mb-2">
                                    <Image
                                        src={category.svgPath}
                                        alt={category.name}
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                </div>
                                <span className="text-sm font-medium text-gray-700 text-center">{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    className="modal"
                    overlayClassName="modal-overlay"
                >
                    {bookingStatus === 'success' ? (
                        <div className="text-center p-8">
                            <h3 className="text-2xl font-bold text-green-600 mb-4">Appointment Booked!</h3>
                            <p>Your appointment with Dr. {selectedDoctor?.name} is confirmed</p>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-2xl font-bold mb-4">
                                Book with Dr. {selectedDoctor?.name}
                            </h3>

                            <div className="mb-4">
                                <label className="block mb-2 font-medium">Appointment Time</label>
                                <input
                                    type="time"
                                    value={appointmentTime}
                                    onChange={(e) => setAppointmentTime(e.target.value)}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            {bookingStatus === 'error' && (
                                <p className="text-red-500 mb-4">Error booking appointment. Please try again.</p>
                            )}

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmAppointment}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    disabled={!appointmentTime}
                                >
                                    Confirm
                                </button>
                            </div>
                        </>
                    )}
                </Modal>


                {/* Doctors List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map((doctor) => (
                            <div key={doctor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                            <span className="text-xl font-bold text-blue-800">{doctor.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800">{doctor.name}</h3>
                                            <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="flex items-center text-gray-600">
                                            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            {doctor.phone}
                                        </p>
                                        <p className="flex items-center text-gray-600">
                                            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Available: {doctor.avfrom} - {doctor.avto}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleBookAppointment(doctor)}
                                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                                    >
                                        Book Appointment
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10">
                            <p className="text-gray-500 text-lg">No doctors found in this specialty.</p>
                            <button
                                onClick={() => setSelectedSpecialty('All')}
                                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                            >
                                View all doctors
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}