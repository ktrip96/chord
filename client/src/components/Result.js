import React from 'react'
import styled from 'styled-components'

const ResultGrid = styled.div`
  height: 48vh;
  border: 2px solid black;
`

export default function Result({ result }) {
  return <ResultGrid>{result}</ResultGrid>
}
