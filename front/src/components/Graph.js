import React from 'react'
import ReactFlow, { Controls } from 'react-flow-renderer'
import 'react-flow-renderer/dist/style.css'
import node from '../images/Node.png'

// Style of every node in the chord
const nodeStyle = {
  border: '1px solid black',
  width: 150,
  borderRadius: '40%',
}

// η elementTemplate παίρνει μία μεταβλητή (ip, η οποία έρχεται με κάθε join)
// και κάνει κάνει construct το json template του κάθε element.
const elementTemplate = (ip) => {
  return {
    id: ip,
    type: 'output',
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
    position: { x: '100', y: '100' },
    style: nodeStyle,
  }
}

// η edgeTemplate κάνει το αντίστοιχο με την element, αλλά για edges.
const edgeTemplate = (src, dst) => {
  return {
    id: 'e1-2',
    source: src,
    target: dst,
    animated: true,
  }
}

// μετατρέπει μια γωνία από μοίρες σε radians
const toRadians = (angle) => {
  return angle * (Math.PI / 180)
}

export default function Graph({ ip, setPortArray, setServerPort, elements }) {
  // When you click each node, make the 'active' ip = element.id
  const onElementClick = (event, element) => setServerPort(element.id)

  // Function for better Graph view
  const onLoad = (reactFlowInstance) => {
    reactFlowInstance.fitView()
  }

  // returns an array with pairs
  const coordinatesCalculator = (length, radius) => {
    let totalDegrees = 360
    let subtractDegrees = Math.round(360 / length)
    let coordinatesArray = []
    for (let i = 0; i < length; i++) {
      totalDegrees = totalDegrees - subtractDegrees
      let x = Math.round(Math.sin(toRadians(totalDegrees)) * radius)
      let y = Math.round(Math.cos(toRadians(totalDegrees)) * radius)
      coordinatesArray.push({ x, y })
    }
    return coordinatesArray
  }

  // Αυτο το function θα καλειται καθε φορα που προστιθεται ένας
  // καινουργιος κομβος στο elements
  // θα ειναι μεσα σε μια useEffect με dependency το elements
  const handleAddNode = () => {
    //* setIsLoading true

    // Add the new element to the state
    // αυτό το βήμα θα γίνει από τα sockets.
    setPortArray([...elements, elementTemplate(5001)])

    //*Wait for state to finish and calculate the correct coordinates for our nodes
    setTimeout(() => {
      const coordinates = coordinatesCalculator(elements.length, 150)
    }, 500)
    //* For each node in the state
    for (let i = 0; i < elements.length; i++) {
      //* change their x and y to the correct value
    }
    //* update Edges
    //* setIsLoading false
  }

  return (
    <div
      style={{
        height: 720,
      }}
    >
      {/* for development reasons */}
      <p>ip: {ip}</p>
      {/* <button onClick={() => alert('add nod')}> Add Node</button> */}
      <button onClick={handleAddNode}> Add Node</button>

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
