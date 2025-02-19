"use client"

export default function LoginPage() {
 
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
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Login</button>
          <button>Register</button>
        </form>
      </div>
    </div>
    
  )
}