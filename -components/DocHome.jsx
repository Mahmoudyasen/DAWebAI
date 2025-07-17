import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

function DocHome() {
  const [profileImage, setProfileImage] = useState('/default-avatar.jpg');
  const [daysAvailable, setDaysAvailable] = useState([
    { day: 'Monday', available: true },
    { day: 'Tuesday', available: true },
    { day: 'Wednesday', available: true },
    { day: 'Thursday', available: true },
    { day: 'Friday', available: true },
    { day: 'Saturday', available: false },
    { day: 'Sunday', available: false },
  ]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      // Add password change logic here
      alert('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      alert("New passwords don't match!");
    }
  };

  const toggleDayAvailability = (dayName) => {
    setDaysAvailable(daysAvailable.map(day => 
      day.day === dayName ? { ...day, available: !day.available } : day
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Section */}
      <div className="mb-8 text-center">
        <div className="relative w-32 h-32 mx-auto mb-4">
          <Image
            src={profileImage}
            alt="Profile"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="profileUpload"
        />
        <label htmlFor="profileUpload" className="cursor-pointer">
          <Button variant="outline">Change Photo</Button>
        </label>
      </div>

      {/* Password Change Section */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <Button type="submit">Change Password</Button>
        </form>
      </div>

      {/* Availability Section */}
      <div className="p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Working Days</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {daysAvailable.map(({ day, available }) => (
            <Button
              key={day}
              variant={available ? 'default' : 'outline'}
              onClick={() => toggleDayAvailability(day)}
            >
              {day}
            </Button>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Click days to toggle availability (Blue = Available)
        </p>
      </div>
    </div>
  );
}

export default DocHome;