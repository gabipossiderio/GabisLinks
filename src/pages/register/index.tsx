import { FormEvent, useState } from "react";
import { Input } from "../../components/input";
import { auth } from "../../services/firebaseConnection";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { updateProfileData } from "../../utils/manageProfileData";
import { RiLockPasswordFill } from "react-icons/ri";
import { FailureNotice } from "../../components/notices/failure";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msgEmpty, setMsgEmpty] = useState("")
  const [msgPassword, setMsgPassword] = useState("")
  const [msgErrorRegister, setMsgErrorRegister] = useState("")
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (email == "" || password == "" || name == "") {
      setMsgEmpty("Por favor, preencha todos os dados para continuar.")
      setTimeout(() => {
        setMsgEmpty("");
      }, 2000)
      return
    } else {
      if (password.length < 6) {
        setMsgPassword("Sua senha precisa ter, no mínimo, 6 caracteres.")
        setTimeout(() => {
          setMsgPassword("");
        }, 2000)
        return
      }
    }
    
    createUserWithEmailAndPassword(auth, email, password)
    .then((response) => {
      const data = {
        user_id: response.user.uid,
        user_name: name,
        user_photo: "",
        user_description: "",
        youtube: "",
        instagram: "",
        facebook: "",
      };
      updateProfileData(data)
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode == "auth/email-already-in-use"){
        setMsgErrorRegister("Endereço de e-mail em uso")
        setTimeout(() => {
          setMsgErrorRegister("");
          navigate('/login')
        }, 3000)
      }
    });
  }

  return (
    <div className="flex w-full select-none h-screen items-center justify-center flex-col">
       <Helmet>
        <title>Cadastro - GabisLinks</title>
      </Helmet>
      {msgEmpty && <FailureNotice noticeText={msgEmpty}/>}
      {msgPassword && <FailureNotice noticeText={msgPassword}/>}
      {msgErrorRegister && <FailureNotice noticeText={msgErrorRegister}/>}
    
      <h1 className="logo mt-5 text-white mb-7 font-bold text-6xl">
        Criar
        <span className="bg-gradient-to-r from-sky-700 to-sky-700 bg-clip-text drop-shadow-lg text-transparent">
          Cadastro
        </span>
      </h1>
      
      <form
        onSubmit={handleSubmit}
        className="w-4xl max-w-lg gap-4 drop-shadow-lg menu flex flex-col text-gray-800"
      >
        <div className="flex gap-1 flex-col">
          <label className="text-sky-700 w-fit font-medium text-lg rounded-md">
            Nome
          </label>
          <Input
            type="text"
            className=" w-full py-1 px-2 focus:outline-none focus:ring focus:ring-sky-700/50 mb-1 rounded-md"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
           
          />
        </div>
        <div className="flex gap-1 flex-col">
          <label className="text-sky-700 w-fit font-medium text-lg rounded-md">
            E-mail
          </label>
          <Input
            className="w-full py-1 px-2 focus:outline-none focus:ring focus:ring-sky-700/50 mb-1 rounded-md"
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="flex gap-1 flex-col">
          <div className="flex items-end justify-between mr-2">
          <label className="text-sky-700 w-fit font-medium text-lg rounded-md">
            Senha 
          </label>
          <small className="text-xs text-left flex items-center gap-1 ml-28 text-gray-800/70">
          Mínimo: 6 Caracteres <RiLockPasswordFill size={15} />
        </small>
        </div>
          <Input
            className=" py-1 px-2 placeholder-gray-700 placeholder-opacity-50 focus:outline-none focus:ring focus:ring-sky-700/50  rounded-md"
            required
            type="password"
            value={password}
            placeholder="******"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
       

        <button
          type="submit"
          className="bg-gradient-to-r from-sky-700 to-sky-700 hover:scale-105 transition w-full ease-in-out delay-150 duration-300 py-2 px-16 rounded-md border-0 text-xl menu mt-5 font-semibold text-white drop-shadow-2xl"
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
