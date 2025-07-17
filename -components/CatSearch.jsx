import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserSearchIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

function CatSearch() {
  const Cat = [
    {
      id: 1,
      name: 'Dentist',
      path: '/AllDoctors',
      svgPath:'/Dentist.svg'
    },
    {
      id: 2,
      name: 'Cardiologist',
      path: '/AllDoctors',
      svgPath:'Cardio.svg'
    },
    {
      id: 3,
      name: 'Orthopedic',
      path: '/AllDoctors',
      svgPath:'Ort.svg'
    },
    {
      id: 4,
      name: 'Neurologist',
      path: '/AllDoctors',
      svgPath:'neur.svg'
    },
    {
      id: 5,
      name: 'Otology',
      path: '/AllDoctors',
      svgPath:'oto.svg'
    },
    {
      id: 6,
      name: 'General Doctor',
      path: '/AllDoctors',
      svgPath:'GD.svg'
    },
    {
      id: 7,
      name: 'Surgon',
      path: '/AllDoctors',
      svgPath:'S.svg'
    },
    {
      id: 8,
      name: 'Psychotropic',
      path: '/AllDoctors',
      svgPath:'psy.svg'
    },
    {
      id: 9,
      name: 'Eye Specilist',
      path: '/AllDoctors',
      svgPath:'eye.svg'
    },
  ]
  return (
    <div className='mb-10 items-center flex flex-col gap-2'>
      <h2 className='font-bold text-4xl text-primary'>Search Doctor</h2>
      <h2 className='text-xl'>Search for your <span className='text-secondary'>favorite</span> doctor and <span className='text-primary'>schedule your next visit with</span> <span className='text-secondary'>ease.</span></h2>
      
      <div className='grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3'>
        {Cat.map(cat => (
          <Link key={cat.id} href={cat.path}>
            <div className='flex flex-col text-center items-center p-5 m-2 rounded-lg gap-2 bg-blue-50 cursor-pointer hover:scale-105 transition-all ease-out'>
              <img src={cat.svgPath} className='w-10 h-10 cursor-pointer' />
              <p className='cursor-pointer'>{cat.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
      
  )
}

export default CatSearch