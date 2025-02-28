import { useState } from 'react'
import TrackerApp from './component/tracker'
import SubscribeToPush from "./component/SubscribeToPush";
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='flex justify-center'>
      <SubscribeToPush />
        <TrackerApp />
      </div>

    </>
  )
}

export default App
