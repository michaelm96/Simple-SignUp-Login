import React from 'react'
import {Button} from '@mui/material'
import { useNavigate } from 'react-router-dom'

function Page404() {
  const navigate = useNavigate()
  return (
    <div>
      <h1 className='text'>Page 404 Not found</h1>
      <Button onClick={() => navigate("/")}>Back Home</Button>
    </div>
  )
}

export default Page404