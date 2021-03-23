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
    'd d'
    'o o';
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
}) {
  const [showQuery, setShowQuery] = useState(false)
  const [queryValue, setQueryValue] = useState('')
  const [showInsert, setShowInsert] = useState(false)
  const [insertValue, setInsertValue] = useState('')
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
              let result = `I run query for ${ip} looking for ${queryValue}`
              setResult(result)
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
              let result = `I run insert for ${ip} inserting ${insertValue}`
              setResult(result)
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

      {/* Overlay */}
      <ButtonContainer
        style={{ gridArea: 'o' }}
        onMouseEnter={() => setColor('#aed581')}
        onMouseLeave={() => setColor('#fff')}
      >
        <Button
          w={200}
          size='md'
          colorScheme='green'
          onClick={() => {
            let result = `Overlay is not implemented yet `
            setResult(result)
          }}
        >
          Overlay
        </Button>
      </ButtonContainer>
    </FuncGrid>
  )
}
