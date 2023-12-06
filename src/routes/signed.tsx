import { ReactNode, useContext} from 'react'
import { Navigate } from "react-router-dom";
import { LoginContext } from "../contexts/login";
import { LoadingNotice } from "../components/notices/loading";

interface PrivateProps{
  children: ReactNode;
}

export function Signed({ children }: PrivateProps): any{
  const { signed } = useContext(LoginContext);
  const { loading } = useContext(LoginContext);

  if(loading){
    return (<LoadingNotice noticeText="Carregando"/>)
  }

  if(signed){
    return <Navigate to='/conta' />
  }

  return children;
}