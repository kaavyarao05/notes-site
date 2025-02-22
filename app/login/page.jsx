"use client"

import { useState } from "react";
import { supabase } from "../lib/supabase"

export default function LoginPage() {

  const [data, setData]=useState({
    email:"",
    password:""
  });
  const login=async()=>{
    try{
      let {data,error}=await supabase
    .auth
    .signUp({
      email:"kaavyarao05@gmail.com",
      password:"password123"
    })
    }
    catch(e){
      console.log(e);
    }
    
  }
 
  async function handleSubmit(event) {
    event.preventDefault()
 
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')
    console.log(email+password)
 
  }
 
  return (
    <div>
      <div>
        <form onSubmit={login}>
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Login</button>
          <button>Register</button>
        </form>
      </div>
    </div>
    
  )
}