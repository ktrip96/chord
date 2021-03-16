import React from 'react'
import Chord from './components/Chord'
import { ChakraProvider } from '@chakra-ui/react'
import './App.css'

export default function App() {
  return (
    <ChakraProvider>
      <Chord />
    </ChakraProvider>
  )
}
