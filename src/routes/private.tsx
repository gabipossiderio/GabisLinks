import { ReactNode, useContext} from 'react'

import { Navigate } from "react-router-dom";
import { LoginContext } from "../contexts/login";
import { LoadingNotice } from "../components/notices/loading";

interface PrivateProps{
  children: ReactNode;
}

export function Private({ children }: PrivateProps): any{
  const { signed } = useContext(LoginContext);
  const { loading } = useContext(LoginContext);

  if(loading){
    return <div className="flex items-center justify-center min-h-screen w-auto"><LoadingNotice noticeText="Carregando"/></div>
  }

  if(!signed){
    return <Navigate to='/login' />
  }

  return children;
}