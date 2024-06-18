import React, { useState } from 'react'

const Lobby2 = () => {

    const [room, setRoom] = useState('')
    const [email, setEmail] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(room, email)
        setRoom('')
        setEmail('')
    }

  return (
    <div>
      <h1>Lobby2</h1>
      <form>
        <label htmlFor='email'>Email</label>
        <input type='email' id='email' onChange={e=>setEmail(e.target.value)} />   
        <label htmlFor='room'>room</label>
        <input type='text' id='room' onChange={e=>setRoom(e.target.value)}  /> 
        <button onClick={handleSubmit} type='submit'>Join</button>
      </form>
    </div>
  )
}

export default Lobby2