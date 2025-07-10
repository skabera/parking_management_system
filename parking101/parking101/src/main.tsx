import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { Routes } from './routes/index.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './api/config/queryClient.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Routes/>
    </QueryClientProvider>
  </StrictMode>,
)
