"use client"

import { useState } from "react";
import { supabase } from "../lib/supabase"
import { useRouter } from "next/router";

export default function LoginPage({username,password}) {

  const [data, setData]=useState({
    email:"",
    password:""
  });
  function getUserDetails(){
    const email=document.getElementById("email").value;
    const password=document.getElementById("password").value;
    return({email,password})
  }
  const login=async(e)=>{
    
    e.preventDefault();
    try{
      let {data:dataUser,error}=await supabase
    .auth
    .signInWithPassword(getUserDetails());
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
  const signUp=async(e)=>{
    
    e.preventDefault();
    try{
      let {data:dataUser,error}=await supabase
    .auth
    .signUp(getUserDetails());
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
        <form >
          <input type="email" name="email" placeholder="Email" id="email" />
          <input type="password" name="password" placeholder="Password" id="pass" />
          <button onClick={login}>Login</button>
          <button onClick={signUp}>Sign Up</button>
        </form>
      </div>
    </div>
    
  )
}