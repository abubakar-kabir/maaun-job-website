import React from 'react';
import Card from './Card';
import { Link } from 'react-router-dom';

const HomeCards = () => {
  return (
<section className='py-4'>
<div className='container-xl lg:container m-auto'>
  <div className='grid grid-cols-1 md:grid-cols-2
  gap-4 p-4 rounded-lg'>
  <Card>
    <h2 className='text-2xl font-bold'>For Employees</h2>
      <p className='mt-2 mb-4'>
            Browse our job vacancies and 
            join the maaun community
      </p>
      <Link
      to='/jobs'
      className='inline-blok bg-black text-white
      rounded-lg px-4 py-2 hover:bg-gray-700'>
        Browse Jobs
      </Link>
  </Card>
  <Card bg='bg-indigo-100'>
    <h2 className='text-2xl font-bold'>
        For Employers
      </h2>
      <p className='mt-2 mb-4'>
        List your job to find the perfect 
        candidate for the role
      </p>
      <Link
        to='/add-job'
        className='inline-block bg-blue-500
        text-white rounded-lg px-4 py-2
        hover:bg-gray-600'
        >Add Job</Link>
  </Card>
  </div>
</div>
</section> 
  )
};

export default HomeCards;