import { Navigate, Route, Routes } from 'react-router-dom'
import SuspensedView from 'src/app/routing/SuspensedView'
import { RoleAccess } from 'src/app/_ezs/layout/RoleAccess'
import { useRoles } from 'src/app/_ezs/hooks/useRoles'
import { lazy } from 'react'
import { useAuth } from 'src/app/_ezs/core/Auth'

const HomePage = lazy(() => import('./pages/Home'))

function TelesalesPage() {
  const { CrStocks } = useAuth()
  const { page_tele_basic, page_tele_adv } = useRoles(['page_tele_basic', 'page_tele_adv'])

  return (
    <Routes>
      <Route element={<RoleAccess roles={page_tele_basic.hasRight || page_tele_adv.hasRight} />}>
        <Route index element={<Navigate to={`list${CrStocks?.ID && '?StockID=' + CrStocks?.ID}`} />} />
        <Route
          path='list'
          element={
            <SuspensedView>
              <HomePage />
            </SuspensedView>
          }
        />
      </Route>
    </Routes>
  )
}

export default TelesalesPage
