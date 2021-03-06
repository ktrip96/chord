import React, { useState } from 'react'
import Result from './Result'
import Functionalities from './Functionalities'

// To Menu αποτελείται από 2 components
// Tα functionalities και το result
export default function Menu({
  ip,
  setPortArray,
  portArray,
  setServerPort,
  socketArray,
}) {
  const [result, setResult] = useState('')
  return (
    <div>
      <Functionalities
        setResult={setResult}
        ip={ip}
        setPortArray={setPortArray}
        setServerPort={setServerPort}
        portArray={portArray}
        socketArray={socketArray}
      />
      <Result result={result} />
    </div>
  )
}
