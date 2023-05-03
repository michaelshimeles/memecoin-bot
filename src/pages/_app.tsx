import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { AppProps } from 'next/app';
import { useState } from 'react';
import theme from "../../theme";

// Create a client
const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode="dark" />
          <Component {...pageProps} />
        </ChakraProvider>
      </SessionContextProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>

  )
}
