"use client"
import React, { useEffect } from 'react';


const page = () => {
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
        <div className="container" id="container">
        <div className="form-container sign-up">
            <form>
            <h1>Create Account</h1>
            <div className="social-icons">
            <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
            </div>
            <span>or use your email for registeration</span>
            <input fontFamily= "cursive" type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button>Sign Up</button>
            </form>
        </div>
        <div className="form-container sign-in">
            <form>
            <h1 className='text-xl font-extrabold my-5'>Log In</h1>
            <input fontFamily= "cursive" type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button>Sign In</button>
            </form>
        </div>
        <div className="toggle-container">
            <div className="toggle">
              <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>"Capture Ideas, Stay Organized, Get things Done!"</p>
              <button id="login">Log In</button>
              </div>
              <div className="toggle-panel toggle-right">
              <h1>About</h1>
              <p>Sign in with your GitHub account and unlock the full potential of our online note-taking platform! Organize, sync, and access your notes anytime, anywhere, all with just one set of credentials. Experience a smooth and secure way to manage your ideas, thoughts, and projects. Dive in now to discover how easy and efficient note-taking can be!
              </p>
              <button id="register">Register Now</button>
              </div>
            </div>
            </div>
        </div>
    </>
  )
}

export default page