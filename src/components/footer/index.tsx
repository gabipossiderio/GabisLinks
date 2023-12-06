import { Link } from "react-router-dom";
import { IoMdArrowRoundForward } from "react-icons/io";
import { LoginContext } from "../../contexts/login";
import { useContext } from "react";

export function Footer() {
  const { signed } = useContext(LoginContext);
  const date = new Date();
  const currentYear = date.getFullYear();

  return (
    <div className="relative bottom-0 select-none">
      <footer className="flex drop-shadow-lg text-center justify-end absolute left-0 bottom-0 flex-col gap-1 bg-white/20 w-full rounded-md">
        <Link to="/">
          <h1 className="logo  text-white mb-1 font-bold text-base drop-shadow-lg ">
            Gabis
            <span className="bg-gradient-to-r from-sky-700 to-sky-700 bg-clip-text drop-shadow-lg text-transparent">
              Links
            </span>
          </h1>
        </Link>
        {!signed && (
          <div className="flex justify-center py-2s">
            {" "}
            <a
              href="https://gabilinks.com"
              rel="noopener noreferrer"
              className="menu text-xs text-gray-900/90 hover:scale-105 hover:text-sky-700 transition-all text-center gap-1 flex max-w-xs justify-center items-center"
              target="_blank"
            >
              Não possui uma conta? Crie seu perfil no{" "}
              <span className="text-base logo">GabisLinks</span>
              <IoMdArrowRoundForward size={14} />
            </a>
          </div>
        )}

        <small className=" text-xs menu text-gray-700/70">
          Todos os direitos reservados &#xa9; - {currentYear} - Desenvolvido por{" "}
          <a
            href="http://localhost:5173/profile/yXsicHQKPiegVircK0EEDXSa3vi2"
            className="text-sky-700 hover:text-white"
          >
            GabisDev
          </a>
        </small>
      </footer>
    </div>
  );
}
