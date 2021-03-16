import React from 'react'
import { Textarea } from '@chakra-ui/react'
import styled from 'styled-components'

const ResultGrid = styled.div`
  height: 48vh;
  border: 2px solid black;
`

const Header = styled.div`
  background-image: linear-gradient(60deg, #29323c 0%, #485563 100%);
  color: white;
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`

// background-image: linear-gradient(60deg, #29323c 0%, #485563 100%);

export default function Result({ result }) {
  return (
    <ResultGrid>
      <Header>Results</Header>
      <div style={{ fontFamily: 'Press Start 2P' }}>
        <Textarea
          isReadOnly
          isFullWidth
          height={'350'}
          placeholder={result}
          value={result}
        />
      </div>
    </ResultGrid>
  )
}
