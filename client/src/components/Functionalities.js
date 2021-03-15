import React, { useState } from 'react'
import styled from 'styled-components'

const FuncGrid = styled.div`
  height: 50vh;
`

export default function Functionalities({ setResult, ip }) {
  const [showQuery, setShowQuery] = useState(false)
  const [queryValue, setQueryValue] = useState('')
  const [showInsert, setShowInsert] = useState(false)
  const [insertValue, setInsertValue] = useState('')

  return (
    <FuncGrid>
      {/* Show neighboors */}
      <button
        onClick={() => {
          let result = `The neighboors of ${ip} are: `
          setResult(result)
        }}
      >
        Show Neighbours
      </button>

      {/* Query */}

      <button
        onClick={() => {
          setShowQuery((value) => !value)
        }}
      >
        {showQuery ? 'Hide Query Input' : 'Query'}
      </button>
      {showQuery && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            let result = `I run query for ${ip} looking for ${queryValue}`
            setResult(result)
          }}
        >
          <input
            onChange={(e) => setQueryValue(e.target.value)}
            type='text'
            value={queryValue}
            placeholder='Type a value to search'
          />
          <button type='submit'>Submit Query</button>
        </form>
      )}

      {/* Insert */}

      <button
        onClick={() => {
          setShowInsert((value) => !value)
        }}
      >
        {showInsert ? 'Hide Insert Input' : 'Insert Data '}
      </button>
      {showInsert && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            let result = `I run insert for ${ip} inserting ${insertValue}`
            setResult(result)
          }}
        >
          <input
            onChange={(e) => setInsertValue(e.target.value)}
            type='text'
            value={insertValue}
            placeholder='Type some data to insert'
          />
          <button type='submit'>Submit Insert</button>
        </form>
      )}
    </FuncGrid>
  )
}
