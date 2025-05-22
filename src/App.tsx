
import { Provider as ChakraProvider } from "@/components/ui/provider"
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routes'
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { toaster, Toaster } from "./components/ui/toaster"




const router = createRouter({routeTree, basepath: import.meta.env.PROD ? "/star-wars-wiki/" : "/"})
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
  queryCache: new QueryCache({
    onError: (err, query)=>{
      if(query.meta?.errorMessage){
        toaster.error({description: query.meta.errorMessage})
      }
    }
  })
})
function App() {

  return (

    <QueryClientProvider client={queryClient}>
    <ChakraProvider>
      <RouterProvider router={router} />
    <ReactQueryDevtools initialIsOpen={true} />
    <Toaster />
    </ChakraProvider>
    </QueryClientProvider>
  )
}

export default App
