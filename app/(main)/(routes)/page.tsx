"use client"

import Image from 'next/image';
import { MainFeatures } from "@/components/main-page-components/main-features";

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="welcome-section relative flex flex-col-reverse xl:flex-row justify-around items-center xl:items-end px-4 sm:px-8 lg:px-12 xl:px-24 pb-24 md:pb-32 lg:pb-48 w-full top-0 mt-[76px] min-h-screen h-fit">
        <div className="welcome-section_left flex flex-col gap-4 sm:gap-6 lg:gap-9 xl:w-3xl z-10 mt-8 xl:mt-0">
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">SyncUp is an excellent platform for collaboration, communication, and building connections.</h1>
          <h2 className="text-base sm:text-lg lg:text-xl text-gray-700 dark:text-gray-300">
            Whether you're working with a team or engaging with a global community, SyncUp provides the tools for productive discussions, seamless meetings, and efficient project management. Customize your workspace to foster smooth communication and create meaningful connections with ease.
          </h2>
        </div>
        <div className="welcome-section_right z-10 flex items-center justify-center w-full xl:w-3xl mb-8 xl:mb-0">
          <Image 
            src="/landing-welcome.png"
            width={1600}
            height={900}
            priority={true}
            alt="welcome-image" 
            className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl" 
          />
        </div>
      </section>
      
      <section className="welcome-feature py-12 md:py-24 bg-sky-200/50 dark:bg-gray-950/50" id="features">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 md:mb-12">Our Features</h2>
          <MainFeatures />
        </div>
      </section>
      
      <section className="welcome-footer flex justify-center items-center p-6 md:p-8 w-full bg-sky-200 dark:bg-gray-950">
        <h1 className="font-bold text-lg md:text-xl">&copy; {new Date().getFullYear()} SyncUp</h1>
      </section>
    </div>
  );
}