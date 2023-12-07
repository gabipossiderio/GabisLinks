import { ReactNode, useContext, useCallback } from 'react'
import { Navigate } from "react-router-dom";
import { LoginContext } from "../contexts/login";
import { LoadingNotice } from "../components/notices/loading";

interface PrivateProps{
  children: ReactNode;
}

export function Signed({ children }: PrivateProps): any{
  const { signed, loading, isReady } = useContext(LoginContext);

  const isFullAuth = useCallback(() => {
    return signed && isReady
  }, [signed, isReady])
 
  if(loading){
    return (<LoadingNotice noticeText="Carregando"/>)
  }

  if(isFullAuth()){
    return <Navigate to='/conta' />
  }

  return children;
}