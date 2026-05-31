import React from 'react'
import ClipLoader from 'react-spinners/Cliploader';

const override  = {
    display: 'block',
    margin: '100px auto'
}


const Spinner = ({loading}) => {
  return (
    <ClipLoader
    color='#26119fff'
    loading={loading}
    cssOverride={override}
    size={150}/>
  )
}

export default Spinner;