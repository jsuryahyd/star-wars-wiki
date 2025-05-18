import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {worker} from '../mocks/browser'
worker.start().then(()=>{
  console.log('Mock Service Worker: started')
}).finally(() => {
  console.log('Mock Service Worker: ready')
createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
})