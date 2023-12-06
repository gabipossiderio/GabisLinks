import { Link } from "react-router-dom"
import { Helmet } from "react-helmet";

export function NotFound(){
  return(
    <div className="flex w-full justify-center select-none items-center flex-col min-h-screen text-white">
       <Helmet>
        <title>Not Found</title>
      </Helmet>
      <h1 className="font-bold text-5xl mb-4">Página não encontrada <span className="text-sky-700">:(</span></h1>
      <p className="italic text-1xl mb-4">Ops! Parece que a página que você está tentando visitar não existe...</p>

      <Link className="bg-gradient-to-r from-sky-700/70 to-sky-700/70 py-1 rounded-md px-4" to="/conta">
        Voltar para home
      </Link>
    </div>
    )
}