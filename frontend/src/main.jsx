// eslint-disable-next-line no-unused-vars
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// eslint-disable-next-line no-unused-vars
import { BrowserRouter } from 'react-router-dom'
import StoreContextProvider from './context/StoreContext.jsx'

import { UserProvider } from './context/UserContext.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
   <StoreContextProvider>
     <UserProvider>
   <App />
       </UserProvider>
   </StoreContextProvider>
  </BrowserRouter>
   
  
)
