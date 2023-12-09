"use client"

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from './theme-provider'
import { TooltipProvider } from '@radix-ui/react-tooltip'

interface Props {
  children: React.ReactNode,
}

const queryClient = new QueryClient()

export default function Provider({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <TooltipProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </TooltipProvider>
      </SessionProvider>
      {/* <ReactQueryDevtools initialIsOpen={true} /> */}
    </QueryClientProvider>
  )
}