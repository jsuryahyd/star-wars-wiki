import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'

import { Provider as ChakraProvider } from "@/components/ui/provider"
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'




const router = createRouter({routeTree})
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
    mutations: {
      retry: false,
    },
  },
})
function App() {

  return (

    <QueryClientProvider client={queryClient}>
    <ChakraProvider>
      <RouterProvider router={router} />
    <ReactQueryDevtools initialIsOpen={true} />
    </ChakraProvider>
    </QueryClientProvider>
  )
}

export default App
