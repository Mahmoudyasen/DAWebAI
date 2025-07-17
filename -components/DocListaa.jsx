import Image from 'next/image'
import Link from 'next/link'

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DocListaa() {

  const [selectedId, setSelectedId] = useState(null);

  const handleItemClick = (id) => {
    setSelectedId(id);
  };

  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/doc');
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchData();
  }, []);

    return (
        
    <div>
        <div className="flex h-screen w-16 flex-col justify-between border-e bg-white">
  <div>
    <Link href="/">
    <div className="inline-flex cursor-pointer size-16 items-center justify-center">
      <span className="grid size-10 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
      <Image src='/logo.svg' alt='logo'
                  width={100} height={60} />
      </span>
    </div>
    </Link>
    

    <div className="border-t border-gray-100">
      <div className="px-2">
        <div className="py-4">
         <div id='A' className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-gray-150 hover:text-gray-700 ">
         <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5 opacity-75"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>

            <span
              className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
            >
              All Doctors
            </span>
           
          
        </div>
         </div>
            

        <ul className="space-y-1 border-t border-gray-100 pt-4">
          <li id='D' className={selectedId === 'D' ? 'bg-secondary rounded-md' : ''} onClick={() => handleItemClick('D')}>
          <div className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-secondary">
              <img src="Dentist.svg"></img>

              <span
                className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
              >
                Dentist
              </span>
            </div>
          </li>

          <li id='C' className={selectedId === 'C' ? 'bg-primary rounded-md' : ''} onClick={() => handleItemClick('C')}>
          <div className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-primary">
              <img src="Cardio.svg"></img>

              <span
                className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
              >
                Cardiologist
              </span>
            </div>
          </li>

          <li id='O' className={selectedId === 'O' ? 'bg-secondary rounded-md' : ''} onClick={() => handleItemClick('O')}>
          <div className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-secondary">
              <img src="Ort.svg"></img>

              <span
                className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
              >
                Orthopedic
              </span>
            </div>
          </li>

          <li id='N' className={selectedId === 'N' ? 'bg-primary rounded-md' : ''} onClick={() => handleItemClick('N')}>
          <div className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-primary">
              <img src="neur.svg"></img>

              <span
                className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
              >
                Neurologist
              </span>
            </div>
          </li>

          <li id='OT' className={selectedId === 'OT' ? 'bg-secondary rounded-md' : ''} onClick={() => handleItemClick('OT')}>
          <div className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-secondary">
              <img src="oto.svg"></img>

              <span
                className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
              >
                Otology
              </span>
           </div>
          </li>

          <li id='G' className={selectedId === 'G' ? 'bg-primary rounded-md' : ''} onClick={() => handleItemClick('G')}>
          <div className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-primary">
              <img src="GD.svg"></img>

              <span
                className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
              >
                General Doctor
              </span>
            </div>
          </li>
          <li id='S' className={selectedId === 'S' ? 'bg-secondary rounded-md' : ''} onClick={() => handleItemClick('S')}>
          <div className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-secondary">
              <img src="S.svg"></img>

              <span
                className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
              >
                Surgon
              </span>
            </div>
          </li>
          <li id='P' className={selectedId === 'P' ? 'bg-primary rounded-md' : ''} onClick={() => handleItemClick('P')}>
          <div className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-primary">
              <img src="psy.svg"></img>

              <span
                className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
              >
                Psychotropic
              </span>
            </div>
          </li>
          <li id='Ey' className={selectedId === 'Ey' ? 'bg-secondary rounded-md' : ''} onClick={() => handleItemClick('Ey')}>
          <div className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-secondary">
              <img src="eye.svg"></img>

              <span
                className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
              >
                Eye Specialist
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2">
    <form action="#">
      <button
        type="submit"
        className="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-5 opacity-75"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>

        <span
          className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-gray-900 px-2 py-1.5 text-xs font-medium text-white group-hover:visible"
        >
          Logout
        </span>
      </button>
    </form>
  </div>
  
</div>

    </div>
    );
  }