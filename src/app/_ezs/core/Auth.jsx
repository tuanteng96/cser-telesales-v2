import { useState, useEffect, createContext, useContext } from 'react'
import { LayoutSplashScreen } from './EzsSplashScreen'

const AuthContext = createContext()

const useAuth = () => {
  return useContext(AuthContext)
}

window.top.Info = {
  User: {
    ID: 1,
    FullName: 'Admin System'
  },
  Stocks: [
    {
      Title: 'Quản lý cơ sở',
      ID: 778,
      ParentID: 0
    },
    {
      Title: 'Cser Hà Nội',
      ID: 8975,
      ParentID: 778
    },
    {
      Title: 'Cser Hồ Chí Minh',
      ID: 10053,
      ParentID: 778
    },
    {
      Title: 'Cser Tuyên Quang',
      ID: 11210,
      ParentID: 778
    },
    {
      Title: 'CSER NAM HỘI AN',
      ID: 11226,
      ParentID: 778
    }
  ],
  CrStockID: 8975,
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBdXRoMlR5cGUiOiJVc2VyRW50IiwiSUQiOiIxIiwiVG9rZW5JZCI6IjEwMzExNDEwMzUyMSIsIm5iZiI6MTY4NzIyOTgyMCwiZXhwIjoxNjg3ODM0NjIwLCJpYXQiOjE2ODcyMjk4MjB9.WOQX6eJQ3dhLLplZlBSZni5u9rT2olQuS38Z8Rpd730'
}

const getInfoLocalStorage = () => {
  return new Promise(function (resolve, reject) {
    function getInfo() {
      if (window.top.Info) {
        resolve({
          Auth: window.top.Info
        })
      } else {
        setTimeout(() => {
          checkInfo(fn)
        }, 50)
      }
    }
    getInfo()
  })
}

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [CrStocks, setCrStocks] = useState(null)
  const [Stocks, setStocks] = useState(null)

  const saveAuth = ({ CrStockID, token, User, ...values }) => {
    let newStocks = values.Stocks
      ? values.Stocks.filter((x) => x.ParentID !== 0).map((x) => ({
          ...x,
          label: x.Title,
          value: x.ID
        }))
      : []
    let index = newStocks.findIndex((x) => x.ID === CrStockID)
    setAuth(User)
    setAccessToken(token)
    setStocks(newStocks)

    if (index > -1) {
      setCrStocks(newStocks[index])
    }
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        accessToken,
        CrStocks,
        Stocks,
        saveAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const AuthInit = ({ children }) => {
  const { saveAuth } = useAuth()
  const [showSplashScreen, setShowSplashScreen] = useState(true)

  useEffect(() => {
    getInfoLocalStorage().then(({ Auth }) => {
      setShowSplashScreen(false)
      saveAuth(Auth)
    })
    // eslint-disable-next-line
  }, [])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
}

export { AuthProvider, AuthInit, useAuth }
