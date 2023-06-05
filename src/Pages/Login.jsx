import { Button, Input, TextField } from '@mui/material'
import axios from 'axios'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Login = () => {
  let navigate = useNavigate()
  
    async function handleLogin(e){
        e.preventDefault()
        let {username, password} = e.target
        let res = await axios.post("/login",{username:username.value, password:password.value})
          .catch((error)=>{if(error) return toast(error?.response?.data, {type:"error"})})
        if(res.status === 200){
          toast(res?.data?.msg, {type:"success"})
          localStorage.setItem("start21-token", res?.data?.token)  
          navigate('/')
        }
    }
    
  return (
    <div className='absolute inset-0 border-4 border-sky-600 grid place-items-center'>
      <form onSubmit={(e)=>handleLogin(e)} className='flex flex-col gap-5 md:w-1/3'>
        <TextField required id='username' type="text" autoFocus={true} key="username" label="Username" name="username"/>
        <TextField required id='password' type="password" key="password" label="Password" name="password"/>
        <Button variant='contained' type="submit">Submit</Button>
      </form>
    </div>
  )
}

export default Login
