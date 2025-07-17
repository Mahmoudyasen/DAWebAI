import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

const LogInDoc = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/oldAccDoc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, password }),
      });

      if (res.ok) {
        const data = await res.json();
        login({ id: id }); // Save user ID
        router.push('/doctor');
      } else {
        setMessage('Failed to login');
      }
    } catch (error) {
      setMessage('Failed to login');
      console.error('Fetch error:', error);
    }
  };

  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <a className="block text-blue-600" href="/">
              <span className="sr-only">Home</span>
              <Image src="/logo.svg" alt="logo" width={100} height={60} />
            </a>

            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Welcome Back
            </h1>

            <p className="mt-4 leading-relaxed text-gray-500">
              Welcome to our seamless appointment booking platform! Connect with your preferred doctor and schedule your next visit with ease. Experience hassle-free healthcare at your fingertips.
            </p>

            <form onSubmit={handleLogin} className="mt-8 grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="IdCard" className="block text-sm font-medium text-gray-700">
                  Id Card Number
                </label>
                <input
                  type="text"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="Enter ID Card"
                  required
                  id="id"
                  name="id"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="Password" className="block text-sm font-medium text-gray-700"> Password </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  required
                  id="password"
                  name="password"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
              </div>

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button
                  type="submit"
                  className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                >
                  Log In
                </button>
              </div>
            </form>
            {message && <p className="mt-4 text-red-500">{message}</p>}
          </div>
        </main>
      </div>
    </section>
  );
};

export default LogInDoc;
