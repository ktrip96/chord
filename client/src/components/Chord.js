import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'

export default function Chord() {
  // eslint-disable-next-line
  const [serverPort, setServerPort] = useState(5000)
  const [portArray, setPortArray] = useState([{ ip: 'localhost:5000' }])

  useEffect(() => {
    let socket = io(`http://localhost:${serverPort}`)

    socket.emit('FRONT_initialise', { message: 'hello' })
    socket.on('FRONT_send_data', ({ ME }) => {
      console.log({ ME })
    })

    socket.on('FRONT_join', ({ join_ip_port }) => {
      // TODO
      // θέλει προσοχή, γιατί αν είμαι στον κόμβο 5001, το socket.on αφορά το socket
      // του 5002, και έχει δεν ακούω τον boostrap
      // Πρέπει κάπου να κρατήσω
      console.log(`${join_ip_port} joined the chord`)
      setPortArray([...portArray, { ip: join_ip_port }])
      // κάνε update το array που κρατάει τα nodes που είναι αποθηκευμένα στο chord
    })

    // TODO
    // socket.on('FRONT_depart', ({}) => {

    //   // κάνε update το array που κρατάει τα nodes που είναι αποθηκευμένα στο chord
    // })
  }, [serverPort])

  const chordRender = portArray.map(({ ip }) => <h1>{ip}</h1>)
  console.log('State is:', portArray)
  return (
    <div>
      <p>Welcome to the Chord</p>
      {chordRender}
    </div>
  )
}

/**
 * console.log('JOIN')
 *  //* Κώδικας Front
    socket.on('FRONT_initialise', () => {
      socket.emit('FRONT_send_data', { ME })
      front_socket = socket
    })

     // Kάθε φορά που κάνει κάποιος join στον Bootstrap
      // στείλε στο Front το αντίστοιχο event.
      front_socket && front_socket.emit('FRONT_join', { join_ip_port })


    //* Κώδικας Front
    socket.on('FRONT_initialise', () => {
      socket.emit('FRONT_send_data', { ME })
    })

 */
