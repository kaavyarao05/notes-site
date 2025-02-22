"use client"

import { useState } from "react";
import { supabase } from "../lib/supabase"
import { useRouter } from "next/router";

export default function LoginPage() {

  const [data, setData]=useState({
    email:"",
    password:""
  });
  const login=async(e)=>{
    e.preventDefault();
    try{
      let {data:dataUser,error}=await supabase
    .auth
    .signInWithPassword({
      email:"kaavyarao05@gmail.com",
      password:"password123"
    });
    if(dataUser){
      console.log(data);
      const router=useRouter();
      router.refresh();
    }
    } 
    catch(e){
      console.log(e);
    } 
  }
  return (
    <div>
      <div>
        <form onSubmit={login}>
          <input type="email" name="email" placeholder="Email" />
          <input type="password" name="password" placeholder="Password" />
          <button type="submit">Login</button>
          <button>Register</button>
        </form>
      </div>
    </div>
    
  )
}