import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

function DocHeader() {
  const { user, logout } = useAuth();

  const Menu = [
    {
      id: 1,
      name: 'Home',
      path: '/doctor/',
    },
    {
      id: 2,
      name: 'ScanPath AI',
      path: '/doctor/BTD',
    },
    {
      id: 3,
      name: 'Blood test for heart diseases',
      path: '/doctor/try',
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
                {item.name}
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

export default DocHeader;
