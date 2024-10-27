import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {ChakraProvider,ColorModeScript , extendTheme} from "@chakra-ui/react"
import {BrowserRouter} from "react-router-dom";
import { mode } from "@chakra-ui/theme-tools";
import { RecoilRoot } from 'recoil'


// to set bacground color
const style = {
  global:(props)=> ({
    body:{
      color:mode('gray.800','whitealpha.900')(props),
      bg:mode("gray.100", "#101010")(props)
    }
    

  })
};

// to chanage background color
const config = {
	initialColorMode: "dark",
	useSystemColorMode: true,
};

const colors ={
  gray:{
    light:"#616161",
    dark : "#1e1e1e"  
  }
};

const theme = extendTheme({style,config,colors})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RecoilRoot>
    <BrowserRouter>
    <ChakraProvider theme={theme} >
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <App />
    </ChakraProvider>
    </BrowserRouter>
    </RecoilRoot>
  </StrictMode>,
)
