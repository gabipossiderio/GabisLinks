import { ReactNode, useContext} from 'react'
import { Navigate } from "react-router-dom";
import { LoginContext } from "../contexts/login";

interface PrivateProps{
  children: ReactNode;
}

export function Signed({ children }: PrivateProps): any{
  const { signed } = useContext(LoginContext);
  const { loading } = useContext(LoginContext);

  if(loading){
    return <div>Carregando...</div>
  }

  if(signed){
    return <Navigate to='/conta' />
  }

  return children;
}