import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { store } from './store.js'
import {Provider} from 'react-redux'
import { BrowserRouter} from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme.js'

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>  
      </BrowserRouter>
    </Provider>
)
