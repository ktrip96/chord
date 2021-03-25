import React, { useEffect, useState } from 'react'
import { Alert, AlertIcon } from '@chakra-ui/react'
import bootstrap from '../images/Bootstrap.png'
import io from 'socket.io-client'
import styled from 'styled-components'
import Graph from './Graph'
import Menu from './Menu'
import node from '../images/Node.png'

const bSocket = io(`http://localhost:5000`)
bSocket.emit('front_connection', { message: 'hello' })

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

//  *** Functionalities ***

// μετατρέπει μια γωνία από μοίρες σε radians
const toRadians = (angle) => {
  return angle * (Math.PI / 180)
}

// Style of every node in the chord
const nodeStyle = {
  border: '1px solid black',
  width: 150,
  borderRadius: '40%',
}

// splitArray splits an array to
// a nodeArray and an edgeArray
const splitArray = (elements) => {
  const nodeArray = []
  const edgeArray = []
  elements.map((item) => {
    // eslint-disable-next-line eqeqeq
    if (item.source == undefined) nodeArray.push(item)
    else edgeArray.push(item)
    return 0
  })
  return { nodeArray, edgeArray }
}

// η elementTemplate παίρνει μία μεταβλητή (ip, η οποία έρχεται με κάθε join)
// και κάνει κάνει construct το json template του κάθε element.
const elementTemplate = (ip) => {
  return {
    id: `${ip}`,
    data: {
      label: (
        <div>
          <img
            src={node}
            style={{ width: '60px', height: '60px', margin: 'auto' }}
            alt='Node'
          />
          <p>{ip}</p>
        </div>
      ),
    },
    position: {
      x: Math.floor(Math.random() * 200) + 1,
      y: Math.floor(Math.random() * 200) + 1,
    },
    style: nodeStyle,
  }
}

// η edgeTemplate κάνει το αντίστοιχο με την element, αλλά για edges.
const edgeTemplate = (src, dst) => {
  return {
    id: `e${src + dst}`,
    source: src,
    target: dst,
    animated: true,
  }
}

// returns an array with pairs
const coordinatesCalculator = (length, radius) => {
  if (length === 1) return [{ x: 0, y: 0 }]
  let totalDegrees = 360
  let subtractDegrees = Math.round(360 / length)
  let coordinatesArray = []
  for (let i = 0; i < length; i++) {
    totalDegrees = totalDegrees - subtractDegrees
    let x = Math.round(Math.sin(toRadians(totalDegrees)) * radius)
    let y = Math.round(Math.cos(toRadians(totalDegrees)) * radius)
    coordinatesArray.push({ x, y })
  }
  return coordinatesArray
}

export default function Chord() {
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

  useEffect(() => {
    console.log('Use Effect Call')
    bSocket.on('front_join', ({ joiner }) => {
      // get joiner's port
      let port = joiner.slice(-4)

      // Connect with Joiner
      let socket = io(`http://${joiner}`)
      socket.emit('front_connection', { message: 'hello' })
      socket.on('front_connection_response', ({ previous, next }) => {
        console.log('Front_connection_response')
        // get previous, and next node port
        let previousNeighbour = previous.slice(-4)
        let nextNeighbour = next.slice(-4)
        // Add the new node to the array
        const tempArray = [...portArray, elementTemplate(port)]

        // Παίρνω όλα τα json που αφορούν nodes και τα βάζω στον πίνακα nodeArray
        const nodeArray = splitArray(tempArray).nodeArray

        // αντίστοιχα για τα edgeArray
        const edgeArray = splitArray(tempArray).edgeArray

        // βρίσκω τις σωστές συντεταγμένες των nodes
        let coordinates = []
        coordinates = coordinatesCalculator(nodeArray.length, 150)

        // τις κάνω update στον nodeArray
        const updatedPortArray = coordinates.map((item, i) => {
          return {
            ...nodeArray[i],
            position: item,
          }
        })

        // ορίζω τη συνάρτηση που κάνει update τα nodes στο JOIN
        const Join = (ip, previous, next) => {
          // διαγράφω το edge που έχει src τον previous και target τον next
          const newArray = edgeArray.filter(
            // eslint-disable-next-line eqeqeq
            (item) => item.source != previous && item.target != next
          )

          // προσθέτω ένα edge με src τον previous και target τον ip
          // προσθέτω ένα edge με src τον ip και target τον next
          const extraEdgeArray = [
            ...newArray,
            edgeTemplate(previous, ip),
            edgeTemplate(ip, next),
          ]
          return extraEdgeArray
        }

        const updatedEdgeArray = Join(port, previousNeighbour, nextNeighbour)
        console.log({ updatedEdgeArray })

        // κάνω merge των καινούργιο node Array με τον καινούργιο edge
        const finalArray = updatedPortArray.concat(updatedEdgeArray)
        console.log({ finalArray })

        // Κάνω update το state

        setPortArray(finalArray)
      })
    })
  }, [portArray])

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
