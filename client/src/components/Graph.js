import React from 'react'
import ReactFlow, { Controls } from 'react-flow-renderer'

const elements = [
  {
    id: '1',
    type: 'input', // input node
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
  },
  // default node
  {
    id: '2',
    // you can also pass a React component as a label
    data: { label: <div>Default Node</div> },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    type: 'output', // output node
    data: { label: 'Output Node' },
    position: { x: 250, y: 250 },
  },
  // animated edge
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-1', source: '1', target: '3', animated: true },
]

export default function Graph() {
  return (
    <div
      style={{
        height: 600,
        border: '2px solid black',
      }}
    >
      <ReactFlow elements={elements}>
        <Controls />
      </ReactFlow>
    </div>
  )
}
