import LoginProvider from "./contexts/login"
import { router } from './router'
import { RouterProvider } from 'react-router-dom'


export function App(){
  return(
    <LoginProvider>
      <RouterProvider router={router} />
    </LoginProvider>
  )
}
