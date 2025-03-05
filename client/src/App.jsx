import { useState } from 'react'
import TrackerApp from './component/tracker'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='flex justify-center items-center'>
      
        <TrackerApp />
      </div>

    </>
  )
}

export default App
