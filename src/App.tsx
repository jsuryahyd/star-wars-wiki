import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'

import { Provider } from "@/components/ui/provider"
import { useColorMode } from './components/ui/color-mode'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routes'

const router = createRouter({routeTree})
function App() {
  const [count, setCount] = useState(0)
  const {toggleColorMode} = useColorMode()
  return (
    <Provider>
      <RouterProvider router={router} />
    </Provider>
  )
}

export default App
