import React, { useState } from 'react'
import Result from './Result'
import Functionalities from './Functionalities'

// To Menu αποτελείται από 2 components
// Tα functionalities και το result
export default function Menu({ ip }) {
  const [result, setResult] = useState('')
  return (
    <div style={{ display: 'block' }}>
      <Functionalities setResult={setResult} ip={ip} />
      <Result result={result} />
    </div>
  )
}
