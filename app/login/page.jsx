"use client"

import { useState,useEffect } from "react";
import { supabase } from "../lib/supabase"
import { useRouter } from "next/router";


const page = () => {
  const [data, setData]=useState({
    email:"",
    password:""
  });
  function getUserDetails(action){
    const email=document.getElementById(action+"Email").value;
    const password=document.getElementById(action+"Password").value;
    return({email,password})
  }
  const login=async(e)=>{
    e.preventDefault();
    try{
      let {data:dataUser,error}=await supabase
    .auth
    .signInWithPassword(getUserDetails("signIn"));
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
    .signUp(getUserDetails("signUp"));
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
  useEffect(()=>{
    const container = document.getElementById("container");
    const registerBtn = document.getElementById("register");
    const loginBtn = document.getElementById("login");

    registerBtn.addEventListener("click", () => {
    container.classList.add("active");
    });

    loginBtn.addEventListener("click", () => {
    container.classList.remove("active");
    });
  })
  return (
    <>
        <div className="container active" id="container">
        <div className="form-container sign-up">
            <form>
            <h1 className='text-xl font-extrabold my-5'>Create Account</h1>
            <input fontFamily= "cursive" type="email" placeholder="Email" id="signUpEmail"/>
            <input type="password" placeholder="Password" id="signUpPassword"/>
            <button onClick={signUp}>Sign Up</button>
            </form>
        </div>
        <div className="form-container sign-in">
            <form>
            <h1 className='text-xl font-extrabold my-5'>Log In</h1>
            <input fontFamily= "cursive" type="email" placeholder="Email"  id="signInEmail"/>
            <input type="password" placeholder="Password" id="signInPassword"/>
            <button onClick={login}>Sign In</button>
            </form>
        </div>
        <div className="toggle-container">
            <div className="toggle">
              <div className="toggle-panel toggle-left">
              <h1>About</h1>
              <p className="px-7">Sign in and unlock the full potential of our online note-taking platform!<br/><br/>Experience a smooth and secure way to manage your ideas, thoughts, and projects.<br/><br/>Dive in now to discover how easy and efficient note-taking can be!</p>
              <button id="login">Log In</button>
              </div>
              <div className="toggle-panel toggle-right">
              <h1>Welcome Back!</h1>
              <p>"Capture Ideas, Stay Organized, Get things Done!"</p>
              <button id="register">Register Now</button>
              </div>
            </div>
            </div>
        </div>
    </>
  )
}

export default page