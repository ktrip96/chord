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

// splitArray splits an array to
// a nodeArray and an edgeArray
const splitArray = (elements) => {
  const nodeArray = []
  const edgeArray = []
  elements.map((item) => {
    if (item.src == undefined) nodeArray.push(item)
    else edgeArray.push(item)
    return 0
  })
  return { nodeArray, edgeArray }
}

// η elementTemplate παίρνει μία μεταβλητή (ip, η οποία έρχεται με κάθε join)
// και κάνει κάνει construct το json template του κάθε element.
const elementTemplate = (ip) => {
  return {
    id: `${ip}`,
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
    position: {
      x: Math.floor(Math.random() * 200) + 1,
      y: Math.floor(Math.random() * 200) + 1,
    },
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
    if (length === 1) return [{ x: 0, y: 0 }]
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
    // οι επόμενες 2 γραμμές θα γίνουν από τα sockets.
    let random = Math.floor(Math.random() * 6) + 1
    const testArray = [...elements, elementTemplate(random + 5000)]

    // Παίρνω όλα τα json που αφορούν nodes και τα βάζω στον πίνακα nodeArray
    const nodeArray = splitArray(testArray).nodeArray
    // αντίστοιχα για τα edgeArray
    const edgeArray = splitArray(testArray).edgeArray

    // βρίσκω τις σωστές συντεταγμένες των nodes
    let coordinates = []
    coordinates = coordinatesCalculator(testArray.length, 150)

    // τις κάνω update στον nodeArray
    const updatedPortArray = coordinates.map((item, i) => {
      return {
        ...nodeArray[i],
        position: item,
      }
    })

    // κάνω merge των καινούργιο node Array με τον edge
    const finalArray = updatedPortArray.concat(edgeArray)

    // Κάνω update το state
    setPortArray(finalArray)
    // TODO
    // - wait bootstrap to give join IP
    // - get IP's neighbours
    // - update Edges
  }

  return (
    <div
      style={{
        height: 730,
      }}
    >
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
