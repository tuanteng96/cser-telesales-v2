import React from 'react'
import ReactDOM from 'react-dom/client'

import 'react-texty/styles.css'
import './index.css'

import { QueryClient, QueryClientProvider } from 'react-query'
import AppRoutes from './app/routing/AppRoutes'
import { EzsSplashScreenProvider } from './app/_ezs/core/EzsSplashScreen'
import { AuthInit, AuthProvider } from './app/_ezs/core/Auth'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <EzsSplashScreenProvider>
        <AuthProvider>
          <AuthInit>
            <AppRoutes />
          </AuthInit>
        </AuthProvider>
      </EzsSplashScreenProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
