import React from 'react'
import ReactFlow, { Controls } from 'react-flow-renderer'
import 'react-flow-renderer/dist/style.css'

export default function Graph({ setPortArray, setServerPort, elements }) {
  // When you click each node, make the 'active' ip = element.id
  const onElementClick = (event, element) => setServerPort(element.id)

  // Function for better Graph view
  const onLoad = (reactFlowInstance) => {
    reactFlowInstance.fitView()
  }

  return (
    <div
      style={{
        height: 730,
      }}
    >
      <ReactFlow
        onElementClick={onElementClick}
        elements={elements}
        onLoad={onLoad}
      >
        <Controls />
      </ReactFlow>
    </div>
  )
}
