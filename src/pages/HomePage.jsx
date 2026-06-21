import React from 'react'
import Hero from '../components/Hero';
import JobListings from '../components/JobListings';
import Viewalljobs from '../components/ViewallJobs';


const HomePage = () => {
  return (
    <>
    <Hero/>
    <JobListings isHome={true}/>
    <Viewalljobs/>
    </>
  )
}

export default HomePage;