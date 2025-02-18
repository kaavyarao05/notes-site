import React from 'react';
const page = () => {
  return (
    <div className='login'>
        <div>
            <h2>Login</h2>
            <label>
                Username
                <input className='user' id='user'></input>
            </label>
            <label>
                Password
                <input className='pass' id='pass'></input>
            </label>
            <button>Submit</button>
        </div>
    </div>
  )
}

export default page