import React from 'react'
import { useLoaderData, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaMapMarker } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';


const JobPage = ({deleteJob}) => {
  const navigate = useNavigate();
  const job = useLoaderData();
  const { isEmployer, isEmployee } = useAuth();
  

  const onDeleteClick= (jobId)=>{
    const confirm=window.confirm('Are you sure you want to delete this job?')

    if(!confirm) return;

    deleteJob(jobId);

    toast.success('Job deleted succesfully')

    navigate('/jobs')
  }
 

  return  (
    <>
<section>
<div className='container m-auto py-6 px-6'>
<Link
to='/jobs'
className='text-blue-500 hover:text-blue-600 flex
items-center'>
<FaArrowLeft className='mr-2'/>Back to Job Listings
</Link>
</div>
</section>

<section className='bg-blue-50'>
<div className='container m-auto py-10 px-6'>
<div className='grid grid-cols-1 md:grid-cols-70/30 w-full gap-6'>
<main>
<div className='bg-white p-6 rounded-lg shadow-md text-center
md:text-left'>
  <div className='text-gray-500 mb-4'>{job.type}</div>
  <h1 className='text-3xl font-bold mb-4'>
    {job.title}
  </h1>
  <div className='text-gray-500 mb-4 flex align-middle
  justify-center md:justify-start'>
     <FaMapMarker className='text-blue-700 mr-1'/>
    <p className='text-blue-700'>{job.location}</p>
  </div>
</div>

<div className='bg-white p-6 rounded-lg shadow-md mt-6'>
  <h3 className='text-blue-800 text-lg font-bold mb-6'>
    Job Description
  </h3>

  <p className='mb-4'>
   {job.description} 
  </p>
    
    <h3 className='text-blue-800 text-lg font-bold mb-2'>
    Salary
    </h3>
    <p className='mb-4'>{job.salary}/ Year</p>
</div>

{isEmployee && (
<div className='bg-white p-6 rounded-lg shadow-md mt-6 border-2 border-blue-100'>
  <h3 className='text-blue-800 text-lg font-bold mb-2'>Interested in this role?</h3>
  <p className='text-gray-600 text-sm mb-4'>
    Submit your CV, links, and a short note on how you meet the requirements. Employers review applications here.
  </p>
  <Link
    to={`/jobs/${job.id}/apply`}
    className='inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-center'>
    Apply for this job
  </Link>
</div>
)}
</main>

<aside>
<div className='bg-white p-6 rounded-lg shadow-md'>
  <h3 className='text-xl font-bold mb-6'>Company Info</h3>
  <h2 className='text-2xl'>{job.company.name}</h2>
  <p className='my-2'>
  {job.company.description} 
  </p>
  <hr className='my-4'/>

  <h3 className='text-xl'>Contact Email:</h3>
  <p className='my-2 bg-blue-100 p-2 font-bold'>
    {job.company.contactEmail}
  </p>

  <h3 className='text-xl'>Contact Phone:</h3>
  <p className='my-2 bg-blue-100 p-2
  font-bold'>{job.company.contactPhone}</p>
</div>

{isEmployer && (
<div className='bg-white p-6 rounded-lg shadow-md mt-6'>
  <h3 className='text-xl font-bold mb-6'>Manage Job</h3>
  <Link
  to={`/edit-job/${job.id}`}
  className='bg-blue-500 hover:bg-blue-600 text-white 
  text-center font-bold py-2 px-4 rounded-full w-full
  focus:outline-none focus:shadow-outline mt-4 block'>
    Edit Job
  </Link>
  <button onClick={()=> onDeleteClick(job.id)} className='bg-red-500 hover:bg-red-600 text-white
  font-bold py-2 px-4 rounded-full w-full focus:outline-none
  focus:shadow-outline mt-4 block'>
    Delete Job
  </button>
</div>
)}
</aside>
</div>
</div>
</section>
    </>
  )
};

const jobLoader = async ({params})=>{
  const res = await api.get(`/api/jobs/${params.id}`);
  const data = await res.json();
  return data;
};


// eslint-disable-next-line react-refresh/only-export-components -- route loader co-located with page
export { JobPage as default, jobLoader };