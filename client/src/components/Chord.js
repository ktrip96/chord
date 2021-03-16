import React, { useEffect, useState } from 'react'
import { Button } from '@chakra-ui/button'
import io from 'socket.io-client'
import styled from 'styled-components'
import Graph from './Graph'
import Menu from './Menu'

//  ***  Styling ***

const GeneralGrid = styled.div`
  display: grid;
  width: 100%;
  height: 98vh;
  grid-template-areas:
    'h h h h h m'
    'g g g g g m'
    'g g g g g m'
    'g g g g g m'
    'g g g g g m'
    'g g g g g m'
    'g g g g g m'
    'g g g g g m'
    'g g g g g m'
    'g g g g g m'
    'g g g g g m'
    'g g g g g m'
    'g g g g g m';
`
const GraphGrid = styled.div`
  border-bottom: 2px solid lightgray;
  font-size: 24px;
  background-color: #f1faee;
  grid-area: g;
`

const HeaderGrid = styled.div`
  padding: 0;
  margin: 0;
  border: 2px solid black;
  background-color: #fff;
  font-size: 18px;
  grid-area: h;
  display: flex;
  align-items: center;
  justify-content: center;
`

const MenuGrid = styled.div`
  border: 2px solid black;
  background-color: #f7f7f8;
  grid-area: m;
`

export default function Chord() {
  // eslint-disable-next-line
  const [serverPort, setServerPort] = useState(5000)
  const [portArray, setPortArray] = useState([
    { ip: '5000' },
    { ip: '5001' },
    { ip: '5002' },
  ])

  // useEffect(() => {
  //   let socket = io(`http://localhost:${serverPort}`)

  //   socket.emit('FRONT_initialise', { message: 'hello' })
  //   socket.on('FRONT_send_data', (response) => {
  //     console.log(response)
  //   })

  //   socket.on('FRONT_join', ({ joiner }) => {
  //     // TODO
  //     // θέλει προσοχή, γιατί αν είμαι στον κόμβο 5001, το socket.on αφορά το socket
  //     // του 5002, και έχει δεν ακούω τον boostrap
  //     // Πρέπει κάπου να κρατήσω το socket που άνοιξα με το bootstrap
  //     console.log(`${joiner} joined the chord`)
  //     setPortArray([...portArray, { ip: joiner }])
  //     // κάνε update το array που κρατάει τα nodes που είναι αποθηκευμένα στο chord
  //   })

  //   // TODO
  //   // socket.on('FRONT_depart', ({}) => {

  //   //   // κάνε update το array που κρατάει τα nodes που είναι αποθηκευμένα στο chord
  //   // })
  // }, [serverPort])

  const chordRender = portArray.map(({ ip }, k) => (
    <div key={k}>
      <Button
        colorScheme='whatsapp'
        onClick={(e) => setServerPort(e.target.innerText.slice(-4))}
      >
        {ip}
      </Button>
    </div>
  ))

  return (
    <GeneralGrid>
      <HeaderGrid>Welcome to the Chord</HeaderGrid>
      <GraphGrid>
        {chordRender}
        {/* <Graph /> */}
      </GraphGrid>
      <MenuGrid>
        <Menu
          ip={serverPort}
          setPortArray={setPortArray}
          portArray={portArray}
        />
      </MenuGrid>
    </GeneralGrid>
  )
}
