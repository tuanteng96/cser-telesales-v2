import React from 'react'
import { Outlet } from 'react-router-dom'
import { LazyMotion, domAnimation } from 'framer-motion'

function App(props) {
  return (
    <LazyMotion features={domAnimation}>
      <Outlet />
    </LazyMotion>
  )
}

export default App
