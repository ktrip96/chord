import React from 'react'
import { Textarea } from '@chakra-ui/react'
import styled from 'styled-components'

const ResultGrid = styled.div`
  height: 48vh;
`

const Header = styled.div`
  background-image: linear-gradient(60deg, #29323c 0%, #485563 100%);
  border-radius: 5px;
  color: white;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  font-family: 'Press Start 2P';
`

// background-image: linear-gradient(60deg, #29323c 0%, #485563 100%);

export default function Result({ result }) {
  return (
    <ResultGrid>
      <Header>Results</Header>

      <Textarea
        isReadOnly
        isFullWidth
        height={'350'}
        placeholder={result}
        value={result}
      />
    </ResultGrid>
  )
}
