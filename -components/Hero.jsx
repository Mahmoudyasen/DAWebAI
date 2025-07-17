import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function Hero() {
  return (
    <section>
  <div className="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:h-screen lg:grid-cols-2">
      <div className="relative z-10 lg:py-16">
        <div className="relative h-64 sm:h-80 lg:h-full">
          <Image
            alt=""
            src="/newHero.jpg"
            width={800}
            height={800}
            className="absolute inset-0 h-full rounded-3xl w-full object-cover"
          />
        </div>
      </div>

      <div className="relative flex items-center bg-gray-100">
        <span
          className="hidden lg:absolute lg:inset-y-0 lg:-start-16 lg:block lg:w-16 lg:bg-gray-100"
        ></span>

        <div className="p-8 sm:p-16 lg:p-24">
          <h2 className="text-2xl font-bold sm:text-3xl">
          <span className='text-secondary'>Connect</span> with your <span className='text-primary'>ideal doctor</span> & <span className='text-secondary'>schedule</span> your next appointment effortlessly!
          </h2>

          <p className="mt-4 text-gray-600">
          Welcome to our seamless appointment booking platform! Connect with your preferred doctor and schedule your next visit with ease. Experience hassle-free healthcare at your fingertips.
          </p>

          <Link href="/SignUp"><Button className="mt-10">Sign Up</Button></Link>
        </div>
      </div>
    </div>
  </div>
</section>

  )
}

export default Hero