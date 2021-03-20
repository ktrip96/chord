import React from 'react'
import ReactFlow, { Controls } from 'react-flow-renderer'
import 'react-flow-renderer/dist/style.css'
import bootstrap from '../images/Bootstrap.png'
import node from '../images/Node.png'

const onLoad = (reactFlowInstance) => {
  reactFlowInstance.fitView()
}

const nodeStyle = {
  border: '1px solid black',
  width: 150,
}

const elements = [
  {
    id: '1',
    type: 'input', // input node
    data: {
      label: (
        <div onClick={() => alert('yo')}>
          <img
            src={bootstrap}
            style={{
              width: '60px',
              height: '60px',
              margin: 'auto',
            }}
            alt='bootstrap'
          />
          <p>Bootstrap</p>
        </div>
      ),
    },
    position: { x: 250, y: 25 },
    style: nodeStyle,
  },
  // default node
  {
    id: '2',
    // you can also pass a React component as a label
    data: {
      label: (
        <div onClick={() => alert('YO')}>
          <img
            src={node}
            style={{ width: '60px', height: '60px', margin: 'auto' }}
            alt='Node'
          />
          <p>Node</p>
        </div>
      ),
    },
    position: { x: 100, y: 125 },
    style: nodeStyle,
  },
  {
    id: '3',
    type: 'output', // output node
    data: {
      label: (
        <div>
          <img
            src={node}
            style={{ width: '60px', height: '60px', margin: 'auto' }}
            alt='Node'
          />
          <p>Node</p>
        </div>
      ),
    },
    position: { x: 250, y: 250 },
    style: nodeStyle,
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
        height: 720,
      }}
    >
      <ReactFlow elements={elements} onLoad={onLoad}>
        <Controls />
      </ReactFlow>
    </div>
  )
}
