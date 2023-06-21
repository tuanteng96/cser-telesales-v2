import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import SuspensedView from './SuspensedView'
import { useRoles } from '../_ezs/hooks/useRoles'
import { RoleAccess } from '../_ezs/layout/RoleAccess'

const TelesalesPage = lazy(() => import('../pages/Telesales'))
const UnauthorizedPage = lazy(() => import('../pages/Unauthorized'))

function PrivateRoutes(props) {
  const { page_tele_basic, page_tele_adv } = useRoles(['page_tele_basic', 'page_tele_adv'])
  return (
    <Routes>
      <Route element={<RoleAccess roles={page_tele_basic.hasRight || page_tele_adv.hasRight} />}>
        <Route
          path='telesales'
          element={
            <SuspensedView>
              <TelesalesPage />
            </SuspensedView>
          }
        />
      </Route>
      <Route
        path='unauthorized'
        element={
          <SuspensedView>
            <UnauthorizedPage />
          </SuspensedView>
        }
      />
    </Routes>
  )
}

export default PrivateRoutes
