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
    'd d';
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
// background-image: linear-gradient(60deg, #29323c 0%, #485563 100%);

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
    socket.emit(`initial_insert`, {
      key: insertValue.slice(0, insertValue.indexOf(',')).trim(),
      value: insertValue.slice(insertValue.indexOf(',') + 1).trim(),
    })
    socket.on(`insert_response`, ({ response_message }) => {
      let result = response_message
      setResult(result)
      setShowInsert((value) => !value)
    })
  }

  const handleQuery = () => {
    let socket = socketArray[ip]
    socket.emit(`initial_query`, { key: queryValue })
    socket.on(`query_response`, ({ response_message, value }) => {
      console.log('Response_message:', response_message, 'Value is:', value)
      let result = 'Sorry :( I could not find the key you asked for'
      // eslint-disable-next-line eqeqeq
      if (value != undefined) result = response_message + ' ' + value
      setResult(result)
      setShowQuery((value) => !value)
    })
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
            let result = 'You can not remove the Bootstrap Node'
            // eslint-disable-next-line
            if (ip != 5000) {
              // eslint-disable-next-line eqeqeq
              const newPortArray = portArray.filter((item) => item.id != ip)
              // πάρε τους nodes, και διάγραψε αυτόν που πρέπει να φύγει

              // πάρε τα edges, διάγραψε αυτά που έχουν είτε src είτε dest αυτόν που πρέπει να φύγει
              // και κράτα κάπου τους παλιούς του γείτονες.
              // φτιάξε ένα καινούργιο edge με αυτούς τους γείτονες.

              setPortArray(newPortArray)
              setServerPort(5000)
              result = `The ${ip} has left the Chord `
            }

            setResult(result)
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
    </FuncGrid>
  )
}
