import React from 'react'
import Hero from '../components/Hero';
import HomeCards from '../components/HomeCards';
import JobListings from '../components/JobListings';
import Viewalljobs from '../components/ViewallJobs';


const HomePage = () => {
  return (
    <>
    <Hero/>
    <HomeCards/>
    <JobListings isHome={true}/>
    <Viewalljobs/>
    </>
  )
}

export default HomePage;