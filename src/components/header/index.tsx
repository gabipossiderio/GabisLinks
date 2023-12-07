import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { GrLogout } from "react-icons/gr";
import { auth } from '../../services/firebaseConnection'
import { LoginContext } from "../../contexts/login";

export function Header(){
  const navigate = useNavigate();
  const { userId, setIsReady } = useContext(LoginContext);

  async function handleLogout(){
    setIsReady(false)
    await signOut(auth);
    navigate("/login"), {replace: true}
  }

  return(
    <header className="max-w-2xl w-full mt-8 px-2 text-white">
      <nav className=" h-12 flex items-center justify-between bg-gradient-to-r text-lg from-cyan-700/70 to-cyan-700/80 drop-shadow-lg rounded-md px-3">
        <div className="flex gap-6 menu font-normal menu drop-shadow-lg">
          <Link className="hover:scale-110 transition-all ease-in-out" to={`/profile/${userId}`}>Perfil</Link>
          <Link className="hover:scale-110 transition-all ease-in-out" to="/conta">Conta</Link>
          <Link className="hover:scale-110 transition-all ease-in-out" to="/links">Links</Link>
          <Link className="hover:scale-110 transition-all ease-in-out" to="/redes-sociais">Redes Sociais</Link>
        </div>
        <button className="flex gap-2 menu hover:scale-110 font-normal transition-all ease-in-out drop-shadow-lg items-center" onClick={handleLogout}>Sair <GrLogout size={16} /></button>
      </nav>
    </header>
  )
}