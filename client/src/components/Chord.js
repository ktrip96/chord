import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'

export default function Chord() {
  // eslint-disable-next-line
  const [serverPort, setServerPort] = useState(5000)

  useEffect(() => {
    let socket = io(`http://localhost:${serverPort}`)

    socket.emit('FRONT_initialise', { message: 'hello' })
    socket.on('FRONT_send_data', ({ ME }) => {
      console.log({ ME })
    })

    socket.on('FRONT_join', ({ join_ip_port }) => {
      // TODO
      console.log(`${join_ip_port} joined the chord`)
      // κάνε update το array που κρατάει τα nodes που είναι αποθηκευμένα στο chord
    })

    // TODO
    // socket.on('FRONT_depart', ({}) => {

    //   // κάνε update το array που κρατάει τα nodes που είναι αποθηκευμένα στο chord
    // })
  }, [serverPort])

  return (
    <div>
      <p>Welcome to the Chord</p>
    </div>
  )
}
