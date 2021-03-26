import { Input } from '@chakra-ui/react'
import { Button, IconButton } from '@chakra-ui/button'
import { CheckIcon } from '@chakra-ui/icons'
import React, { useState } from 'react'
import styled from 'styled-components'

const FuncGrid = styled.div`
  height: 50vh;
  display: grid;
  gap: 1%;
  grid-template-areas:
    'h h'
    'q q'
    'i i'
    'o o'
    'd d'
    'n n';
`
const Header = styled.div`
  font-family: 'Press Start 2P';
  color: white;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(60deg, #29323c 0%, #485563 100%);
  border-bottom: 2px solid gray;
  border-radius: 5px;
`
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

const edgeTemplate = (src, dst) => {
  return {
    id: `e${src + dst}`,
    source: src,
    target: dst,
    animated: true,
  }
}

// μετατρέπει μια γωνία από μοίρες σε radians
const toRadians = (angle) => {
  return angle * (Math.PI / 180)
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

export default function Functionalities({
  setResult,
  ip = 5000,
  setPortArray,
  portArray,
  setServerPort,
  socketArray,
}) {
  const [showQuery, setShowQuery] = useState(false)
  const [queryValue, setQueryValue] = useState('')
  const [showInsert, setShowInsert] = useState(false)
  const [insertValue, setInsertValue] = useState('')
  const [showDelete, setShowDelete] = useState(false)
  const [deleteValue, setDeleteValue] = useState('')
  const [color, setColor] = useState('')

  const ButtonContainer = styled.div`
    font-family: 'Press Start 2P';
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;

    :hover {
      background-color: ${color};
    }
  `

  const handleInsert = () => {
    let socket = socketArray[ip]
    let result
    if (insertValue.indexOf(',') === -1) {
      result = `You gave ${insertValue}\nPlease give a valid insert name. \nExample of correct insert is:\nKey , Value`
      setInsertValue('')
      setResult(result)
    } else {
      socket.emit(`initial_insert`, {
        key: insertValue.slice(0, insertValue.indexOf(',')).trim(),
        value: insertValue.slice(insertValue.indexOf(',') + 1).trim(),
      })
      socket.on(`insert_response`, ({ response_message }) => {
        result = response_message
        setResult(result)
        setShowInsert((value) => !value)
      })
    }
  }

  const handleQuery = () => {
    let socket = socketArray[ip]
    socket.emit(`initial_query`, { key: queryValue.trim() })
    socket.on(
      `query_response`,
      ({ response_message, value, destination_node }) => {
        console.log('Response_message:', response_message, 'Value is:', value)
        let result = 'Sorry :( I could not find the key you asked for'
        // eslint-disable-next-line eqeqeq
        if (value != undefined) {
          result = response_message + ' ' + value
          // eslint-disable-next-line eqeqeq
          if (destination_node != undefined)
            result =
              response_message +
              ' ' +
              value +
              '.\nIt came from ' +
              destination_node
        }
        setResult(result)
        setShowQuery((value) => !value)
      }
    )
  }

  const handleDelete = () => {
    let socket = socketArray[ip]
    socket.emit(`initial_delete`, { key: deleteValue })
    socket.on(`delete_response`, ({ response_message }) => {
      console.log('Response_message:', response_message)
      let result = response_message
      // eslint-disable-next-line eqeqeq
      setResult(result)
      setShowDelete((value) => !value)
    })
  }

  const handleDepart = () => {
    let socket = socketArray[ip]
    socket.emit('depart')
    // Παίρνω όλα τα json που αφορούν nodes και τα βάζω στον πίνακα nodeArray
    const nodeArray = splitArray(portArray).nodeArray
    // αντίστοιχα για τα edgeArray
    const edgeArray = splitArray(portArray).edgeArray
    let previousOfDepart
    let nextOfDepart
    let result = 'You can not remove the Bootstrap Node'
    for (let i = 0; i < edgeArray.length; i++) {
      // eslint-disable-next-line
      if (edgeArray[i].source == ip) nextOfDepart = edgeArray[i].target
      // eslint-disable-next-line
      if (edgeArray[i].target == ip) previousOfDepart = edgeArray[i].source
    }
    // eslint-disable-next-line
    if (ip != 5000) {
      const newEdgeArray = edgeArray.filter(
        (item) =>
          // eslint-disable-next-line
          (item.source != previousOfDepart && item.target != ip) ||
          // eslint-disable-next-line
          (item.source != ip && item.target != nextOfDepart)
      )

      const updatedEdgeArray = [
        ...newEdgeArray,
        edgeTemplate(previousOfDepart, nextOfDepart),
      ]

      // eslint-disable-next-line
      let updatedNodeArray = nodeArray.filter((item) => item.id != ip)

      // βρίσκω τις σωστές συντεταγμένες των nodes
      let coordinates = []
      coordinates = coordinatesCalculator(updatedNodeArray.length, 150)

      // τις κάνω update στον nodeArray
      updatedNodeArray = coordinates.map((item, i) => {
        return {
          ...updatedNodeArray[i],
          position: item,
        }
      })

      setPortArray(updatedNodeArray.concat(updatedEdgeArray))
      result = `The ${ip} has left the chord`
      setServerPort(5000)
    }
    setResult(result)
  }

  const handleData = () => {
    let socket = socketArray[ip]
    socket.emit(`show_data`)
    socket.on(`show_data_response`, (response) => {
      console.log('Data is', response)
      let result = JSON.stringify(response)
      // eslint-disable-next-line eqeqeq
      setResult(result)
    })
  }

  return (
    <FuncGrid>
      {/* Header */}
      <Header style={{ gridArea: 'h' }}>Functionalities</Header>
      {/* Query */}
      <ButtonContainer
        style={{ gridArea: 'q', justifyContent: 'space-evenly' }}
        onMouseEnter={() => setColor('#ffe082')}
      >
        <Button
          size='md'
          w={200}
          colorScheme='orange'
          onClick={() => {
            setShowQuery((value) => !value)
          }}
        >
          {showQuery ? 'Hide' : 'Query'}
        </Button>
        {showQuery && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleQuery()
            }}
          >
            <div style={{ display: 'flex' }}>
              <Input
                bg='#fff'
                onChange={(e) => setQueryValue(e.target.value)}
                type='text'
                value={queryValue}
                autoFocus={true}
                placeholder='Type a value to search'
              />
              <IconButton
                colorScheme='whatsapp'
                type='submit'
                aria-label='Submit'
                icon={<CheckIcon />}
              />
            </div>
          </form>
        )}
      </ButtonContainer>
      {/* Insert */}
      <ButtonContainer
        style={{ gridArea: 'i', justifyContent: 'space-evenly' }}
        onMouseEnter={() => setColor('#b3e5fc')}
      >
        <Button
          size='md'
          w={200}
          colorScheme='twitter'
          onClick={() => {
            setShowInsert((value) => !value)
          }}
        >
          {showInsert ? 'Hide' : 'Insert Data '}
        </Button>
        {showInsert && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleInsert()
            }}
          >
            <div style={{ display: 'flex' }}>
              <Input
                bg='#fff'
                onChange={(e) => setInsertValue(e.target.value)}
                type='text'
                value={insertValue}
                autoFocus={true}
                placeholder='Type some data to insert'
              />
              <IconButton
                colorScheme='whatsapp'
                type='submit'
                aria-label='Submit'
                icon={<CheckIcon />}
              />
            </div>
          </form>
        )}
      </ButtonContainer>

      {/* Depart */}
      <ButtonContainer
        style={{ gridArea: 'd' }}
        onMouseEnter={() => setColor('#ffcdd2')}
      >
        <Button
          w={200}
          size='md'
          colorScheme='red'
          onClick={() => {
            handleDepart()
          }}
        >
          Depart
        </Button>
      </ButtonContainer>

      {/* Delete */}
      <ButtonContainer
        style={{ gridArea: 'o', justifyContent: 'space-evenly' }}
        onMouseEnter={() => setColor('#aed581')}
        onMouseLeave={() => setColor('#fff')}
      >
        <Button
          size='md'
          w={200}
          colorScheme='green'
          onClick={() => {
            setShowDelete((value) => !value)
          }}
        >
          {showDelete ? 'Hide' : 'Delete'}
        </Button>
        {showDelete && (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleDelete()
            }}
          >
            <div style={{ display: 'flex' }}>
              <Input
                bg='#fff'
                onChange={(e) => setDeleteValue(e.target.value)}
                type='text'
                value={deleteValue}
                autoFocus={true}
                placeholder='Type a value to delete'
              />
              <IconButton
                colorScheme='whatsapp'
                type='submit'
                aria-label='Submit'
                icon={<CheckIcon />}
              />
            </div>
          </form>
        )}
      </ButtonContainer>
      {/* Depart */}
      <ButtonContainer
        style={{ gridArea: 'n' }}
        onMouseEnter={() => setColor('#ffcdd2')}
      >
        <Button
          w={200}
          h={42}
          size='sm'
          colorScheme='purple'
          onClick={() => {
            handleData()
          }}
        >
          Show Data
        </Button>
      </ButtonContainer>
    </FuncGrid>
  )
}
