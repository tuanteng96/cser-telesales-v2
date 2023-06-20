import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import App from '../App'
import PrivateRoutes from './PrivateRoutes'

const { PUBLIC_URL } = import.meta.env

export default function AppRoutes() {
  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path='/*' element={<PrivateRoutes />} />
          <Route index element={<Navigate to='/telesales' />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
