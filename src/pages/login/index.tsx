import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/input";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../../services/firebaseConnection";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { loadProfileData, updateProfileData } from "../../utils/manageProfileData";
import { FailureNotice } from "../../components/notices/failure";
import { Helmet } from "react-helmet";

export function Login() {
  const [email, setEmail] = useState("");
  const [msgEmailEmpty, setMsgEmailEmpty] = useState("")
  const [msgFieldEmpty, setMsgFieldEmpty] = useState("")
  const [password, setPassword] = useState("");
  const [msgErrorLogin, setMsgErrorLogin] = useState("")
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (email === "" || password === "") {
      setMsgFieldEmpty("Por favor, preencha todos os dados para continuar")
      setTimeout(() => {
        setMsgFieldEmpty("");
      }, 2000)
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/conta"), { replace: true };
        console.log("LOGADO");
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode == "auth/invalid-credential"){
          setMsgErrorLogin("E-mail ou senha incorretos")
          setTimeout(() => {
            setMsgErrorLogin("");
          }, 2000)
        }
      });
  }

  function handleGoogleLogin(e: FormEvent) {
    e.preventDefault();

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        loadProfileData(user.uid).then((result) => {
          if (result.size === 0) {
            const data = {
              user_photo: "",
              user_name: user.displayName!,
              user_id: user.uid,
              user_description: "",
              youtube: "",
              instagram: "",
              facebook: "",
            };
            updateProfileData(data).then(() => {console.log('finished')})
          }
        })
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function EmailPassword(e: FormEvent) {
    e.preventDefault();
    const auth = getAuth();
    if (email === "") {
      setMsgEmailEmpty("Por favor, preencha o e-mail para continuar")
      setTimeout(() => {
        setMsgEmailEmpty("");
      }, 2000)
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("EMAIL ENVIADO");
        navigate('/email-enviado'), {history: true}
      })
      .catch((error) => {
        console.log(error)
      });
  }

  return (
    <div className="flex w-full h-screen items-center select-none justify-center flex-col">
       <Helmet>
        <title>Login - GabisLinks</title>
      </Helmet>
       {msgFieldEmpty && <FailureNotice noticeText={msgFieldEmpty}/>}
       {msgEmailEmpty && <FailureNotice noticeText={msgEmailEmpty}/>}
       {msgErrorLogin && <FailureNotice noticeText={msgErrorLogin}/>}
      <h1 className="logo mt-11 text-white mb-7 font-bold text-7xl">
        Gabis
        <span className="bg-gradient-to-r from-sky-700 to-sky-700 bg-clip-text drop-shadow-lg text-transparent">
          Links
        </span>
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full menu max-w-md drop-shadow-lg flex flex-col gap-1 px-3 text-gray-800"
      >
        <Input
          className="py-2 rounded-md mb-2 px-2 focus:outline-none focus:ring focus:ring-sky-700/50"
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail"
        />
        <Input
          className="py-2 rounded-md mb-2 px-2 focus:outline-none focus:ring focus:ring-sky-700/50"
          type="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          placeholder="*******"
        />
        <div className="flex justify-between px-1 text-gray-800/80 text-xs mb-5">
          <button type="button" onClick={EmailPassword} className="hover:text-sky-800">
            Esqueceu a senha?
          </button>
          <Link to="/cadastro" className="hover:text-sky-800">
            Cadastre-se
          </Link>
        </div>

        <button
          type="submit"
          className="py-2 focus:outline-none focus:ring focus:ring-sky-700/50 bg-sky-700/90 drop-shadow-lg rounded-md border-0 text-base mb-4 text-white font-medium hover:scale-105 transition ease-in-out delay-150 duration-300"
        >
          Entrar
        </button>
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="flex drop-shadow-lg focus:outline-none focus:ring focus:ring-sky-700/50  bg-sky-300/90 rounded-md py-2 border-0  text-base text-white items-center gap-2 justify-center font-medium hover:scale-105 transition ease-in-out delay-150 duration-300"
        >
          <FcGoogle size={20} />
          Entrar com o Google
        </button>
      </form>
    </div>
  );
}
