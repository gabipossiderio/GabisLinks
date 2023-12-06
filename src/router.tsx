import { createBrowserRouter } from 'react-router-dom'

import { Profile } from './pages/profile'
import { Links } from './pages/links'
import { Login } from './pages/login'
import { SocialMedia } from './pages/social-media'
import { Register } from './pages/register'
import { Private } from './routes/private'
import { NotFound } from "./pages/not-found"
import { Signed } from "./routes/signed"
import { Account } from "./pages/account"
import { EmailSend } from "./pages/email"
import { Layout } from "./components/layout"


const router = createBrowserRouter([
 {element: <Layout/>,
  children: [
    {
      path: '/profile/:id/',
      element: <Profile/>
    },
    {
      path: '/login',
      element: <Signed><Login/></Signed>
    },
    {
      path: '/links',
      element: <Private><Links/></Private>
    },
    {
      path: '/conta',
      element: <Private><Account/></Private>
    },
    {
      path: '/redes-sociais',
      element: <Private><SocialMedia/></Private>
    },
    {
      path: '/cadastro',
      element: <Signed><Register/></Signed>
    },
    {
      path: '/email-enviado',
      element: <EmailSend/>
    },
    {
      path: '/',
      element: <Signed><Login/></Signed>
    },
    {
      path: '*',
      element: <NotFound/>
    },
  
  ]}
])

export { router }
