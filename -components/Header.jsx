import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

function Header() {
  const { user, logout } = useAuth();

  const Menu = [
    {
      id: 1,
      name: 'Home',
      path: '/',
    },
    {
      id: 2,
      name: 'Doctors',
      path: '/AllDoctors',
    },
    {
      id: 3,
      name: 'Appointments',
      path: '/Appointments',
    },
    {
      id: 4,
      name: 'KARA',
      path: '/model',
    },
  ];

  return (
    <div className='flex items-center justify-between p-4 shadow-sm'>
      <div className='flex items-center gap-11'>
        <Image src='/logo.svg' alt='logo' width={100} height={60} />
        <ul className='md:flex gap-8 hidden'>
          {Menu.map((item, index) => (
            <Link key={index} href={item.path}>
              <li className='hover:text-primary cursor-pointer hover:scale-105 transition-all ease-out'>
                {item.name === 'KARA' ? (
                  <div className="flex items-center gap-2">
                    <Image 
                      src="/KARA.svg" 
                      alt="KARA Assistant" 
                      width={40}  // Adjust based on your SVG aspect ratio
                      height={20} // Should match your text line-height
                      className="h-[1em] w-auto"
                    />
                    <span>KARA</span>
                  </div>
                ) : (
                  item.name
                )}
              </li>
            </Link>
          ))}
        </ul>
      </div>
      {user ? (
        <button onClick={logout} className='text-red-600'>
          Log Out
        </button>
      ) : (
        <Link href="/LogIn"><Button>Log In</Button></Link>
      )}
    </div>
  );
}

export default Header;
