import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { GrLogout } from "react-icons/gr";
import { auth } from "../../services/firebaseConnection";
import { LoginContext } from "../../contexts/login";
import { FiMenu } from "react-icons/fi";
import { IoIosCloseCircle } from "react-icons/io";

export function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const navigate = useNavigate();
  const { userId, setIsReady } = useContext(LoginContext);

  async function handleLogout() {
    setIsReady(false);
    await signOut(auth);
    navigate("/login"), { replace: true };
  }

  return (
    <>
      <div className="flex menu items-center sm:border-0 border-b border-gray-400 py-4 sm:py-3 w-full">
        <nav>
          <section className="flex sm:hidden w-full flex-row">
            <div>   <h1 className="logo text-white pl-3 font-bold text-lg">
        Gabis
        <span className="bg-gradient-to-r from-sky-700 to-sky-700 bg-clip-text drop-shadow-lg text-transparent">
          Links
        </span>
      </h1></div>
            {!isNavOpen &&  <div
              className="absolute text-sky-900 top-0 right-0 px-6 py-4"
              onClick={() => setIsNavOpen((prev) => !prev)}
            >
              <FiMenu size={30} />  </div>}
           
          

            <div
              className={
                isNavOpen
                  ? "absolute w-full min-h-screen text-sky-700 top-0 left-0 bg-white transition-all z-10 flex flex-col justify-evenly items-start pl-8"
                  : "hidden"
              }
            >
              <div
                className="absolute top-0 right-0 px-8 py-8"
                onClick={() => setIsNavOpen(false)}
              >
               <IoIosCloseCircle size={30}/>
              </div>
              <ul className="flex flex-col justify-between min-h-[250px]">
                <li className="border-b border-gray-400 my-8 uppercase">
                  <Link to={`/profile/${userId}`}>Perfil</Link>
                </li>
                <li className="border-b border-gray-400 my-8 uppercase">
                  <Link to='/conta'>Conta</Link>
                </li>
                <li className="border-b border-gray-400 my-8 uppercase">
                  <Link to='/links'>Links</Link>
                </li>
                <li className="border-b border-gray-400 my-8 uppercase">
                  <Link to='/redes-sociais'>Redes Sociais</Link>
                </li>
                <li
                onClick={handleLogout}
                 className="border-b border-gray-400 my-8 uppercase">
                  Sair
                </li>
              </ul>
            </div>
          </section>
        </nav>
      </div>

      <header className="max-w-2xl hidden sm:inline-block w-full px-2 text-white">
        <nav className=" h-12 flex items-center justify-between bg-gradient-to-r text-lg from-cyan-700/70 to-cyan-700/80 drop-shadow-lg rounded-md px-3">
          <div className="flex gap-6 menu font-normal menu drop-shadow-lg">
            <Link
              className="hover:scale-110 transition-all ease-in-out"
              to={`/profile/${userId}`}
            >
              Perfil
            </Link>
            <Link
              className="hover:scale-110 transition-all ease-in-out"
              to="/conta"
            >
              Conta
            </Link>
            <Link
              className="hover:scale-110 transition-all ease-in-out"
              to="/links"
            >
              Links
            </Link>
            <Link
              className="hover:scale-110 transition-all ease-in-out"
              to="/redes-sociais"
            >
              Redes Sociais
            </Link>
          </div>
          <button
            className="flex gap-2 menu hover:scale-110 font-normal transition-all ease-in-out drop-shadow-lg items-center"
            onClick={handleLogout}
          >
            Sair <GrLogout size={16} />
          </button>
        </nav>
      </header>
    </>
  );
}
