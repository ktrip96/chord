import React, { useEffect, useState } from 'react'
import { Button } from '@chakra-ui/button'
import { Alert, AlertIcon } from '@chakra-ui/react'
import bootstrap from '../images/Bootstrap.png'
import io from 'socket.io-client'
import styled from 'styled-components'
import Graph from './Graph'
import Menu from './Menu'

//  ***  Styling ***

const GeneralGrid = styled.div`
  display: grid;
  width: 100%;
  height: 99vh;
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
    'g g g g g m';
`
const GraphGrid = styled.div`
  border-bottom: 2px solid lightgray;
  font-size: 24px;
  background-color: #fff;
  grid-area: g;
`

const HeaderGrid = styled.div`
  background-color: #fff;
  font-family: 'Luckiest Guy', cursive;
  font-size: 48px;
  grid-area: h;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Description = styled.div`
  font-size: 16px;
  font-family: 'Press Start 2P';
`

const MenuGrid = styled.div`
  background-color: #eeebdd;
  grid-area: m;
`

export default function Chord() {
  // eslint-disable-next-line
  const [serverPort, setServerPort] = useState(5000)
  const [portArray, setPortArray] = useState([
    {
      id: '5000',
      data: {
        label: (
          <div>
            <img
              src={bootstrap}
              style={{
                width: '60px',
                height: '60px',
                margin: 'auto',
              }}
              alt='bootstrap'
            />
            <p>Bootstrap</p>
          </div>
        ),
      },
      position: { x: 0, y: 0 },
      style: {
        border: '1px solid black',
        width: 150,
        borderRadius: '40%',
      },
    },
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
  //     setPortArray(portArray => [...portArray, { ip: joiner }])
  //     // κάνε update το array που κρατάει τα nodes που είναι αποθηκευμένα στο chord
  //   })

  //   // TODO
  //   // socket.on('FRONT_depart', ({}) => {

  //   //   // κάνε update το array που κρατάει τα nodes που είναι αποθηκευμένα στο chord
  //   // })
  // }, [serverPort])

  // const chordRender = portArray.map(({ ip }, k) => (
  //   <div key={k}>
  //     <Button
  //       colorScheme='whatsapp'
  //       onClick={(e) => setServerPort(e.target.innerText.slice(-4))}
  //     >
  //       {ip}
  //     </Button>
  //   </div>
  // ))

  return (
    <GeneralGrid>
      <HeaderGrid>
        <nobr class='Lucky'>
          Welcome to the
          <a href='https://en.wikipedia.org/wiki/Chord_(peer-to-peer)'>
            <span class='Lucky blue'> C</span>
            <span class='Lucky red'>h</span>
            <span class='Lucky yellow'>o</span>
            <span class='Lucky blue'>r</span>
            <span class='Lucky green'>d</span>
          </a>
        </nobr>
        <Description>
          An implementation of a Distributed Hashing Table
        </Description>
        <Alert status='info' style={{ fontSize: '10px', paddingLeft: '500px' }}>
          <AlertIcon />
          {`You are handling requests for ${serverPort}`}
        </Alert>
      </HeaderGrid>

      <GraphGrid>
        {/* {chordRender} */}

        <Graph
          ip={serverPort}
          setServerPort={setServerPort}
          setPortArray={setPortArray}
          elements={portArray}
        />
      </GraphGrid>
      <MenuGrid>
        <Menu
          ip={serverPort}
          setPortArray={setPortArray}
          setServerPort={setServerPort}
          portArray={portArray}
        />
      </MenuGrid>
    </GeneralGrid>
  )
}
