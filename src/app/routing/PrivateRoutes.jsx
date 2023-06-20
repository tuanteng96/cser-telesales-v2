import React, { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import SuspensedView from './SuspensedView'

const TelesalesPage = lazy(() => import('../pages/Telesales'))

function PrivateRoutes(props) {
  return (
    <Routes>
      <Route
        path='telesales'
        element={
          <SuspensedView>
            <TelesalesPage />
          </SuspensedView>
        }
      />
    </Routes>
  )
}

export default PrivateRoutes
