import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export function EmailSend() {
  return (
    <div className="flex w-full justify-center select-none items-center flex-col min-h-screen text-white">
      <Helmet>
        <title>Recuperação de Senha - GabisLinks</title>
      </Helmet>
      <h1 className="font-bold text-5xl mb-4">
        Seu e-mail foi enviado <span className="text-sky-700">:)</span>
      </h1>
      <p className="italic text-1xl mb-4 w-96 text-center drop-shadow-lg">
        Caso não tenha recebido, é possível que você tenha digitado o e-mail
        errado ou seu cadastro não esteja na nossa base de dados.
      </p>

      <Link
        className="bg-gradient-to-r from-sky-700/70 to-sky-700/70 py-1 rounded-md px-4"
        to="/conta"
      >
        Voltar para página de login
      </Link>
    </div>
  );
}
