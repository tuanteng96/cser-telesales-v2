import { Outlet } from 'react-router-dom'
import { LazyMotion, domAnimation } from 'framer-motion'

function App() {
  return (
    <LazyMotion features={domAnimation}>
      <Outlet />
    </LazyMotion>
  )
}

export default App
