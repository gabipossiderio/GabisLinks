import { FormEvent, useState, useEffect, useContext } from "react";
import { LoginContext } from "../../contexts/login"
import { Input } from "../input";
import { IoIosCloseCircle } from "react-icons/io";
import { FaTrashCan, FaLink } from "react-icons/fa6";
import { db } from "../../services/firebaseConnection";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
  where
} from "firebase/firestore";
import { ConfirmationNotice } from "../notices/confirmation";
import { FailureNotice } from "../notices/failure";

interface LinkProps {
  id: string;
  name: string;
  url: string;
  bg: string;
  color: string;
  user_id: string;
}

export function LinksManagement() {
  const [nameInput, setNameInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [bgColorInput, setBgColorInput] = useState("#f1f1f1");
  const [textColorInput, setTextColorInput] = useState("#121212");
  const [links, setLinks] = useState<LinkProps[]>([]);
  const [showRegister, setShowRegister] = useState(false);
  const { userId } = useContext(LoginContext);
  const [created, setCreated] = useState(false);
  const [msgEmpty, setMsgEmpty] = useState("")

  useEffect(() => {
    const linksRef = collection(db, "links");
    const queryRef = query(linksRef, where("user_id", "==", userId), orderBy("created", "asc"));

    const unsub = onSnapshot(queryRef, (snapshot) => {
      const list = [] as LinkProps[];
      snapshot.forEach((doc) => {
        list.push({
          id: doc.id,
          name: doc.data().name,
          url: doc.data().url,
          bg: doc.data().bg,
          color: doc.data().color,
          user_id: userId
        });
      });

      setLinks(list);
    });

    return () => {
      unsub();
    };
  }, [userId]);

  function handleLinkRegister(e: FormEvent) {
    e.preventDefault();

    if (nameInput === "" || urlInput === "") {
      setMsgEmpty("Por favor, preencha todos os dados para continuar.")
      setTimeout(() => {
        setMsgEmpty("");
      }, 2000)
      return;
    }

    addDoc(collection(db, "links"), {
      name: nameInput,
      user_id: userId,
      url: urlInput,
      bg: bgColorInput,
      color: textColorInput,
      created: new Date(),
    })
      .then(() => {
        setNameInput("");
        setUrlInput("");
        setCreated(true);
        setTimeout(() => {
          setCreated(false);
        }, 2000);
      })
      .catch((error) => {
        console.log("Erro ao cadastrar no banco de dados" + error);
      });

    setShowRegister(false);
  }

  async function handleDeleteLink(id: string) {
    const docRef = doc(db, "links", id);
    await deleteDoc(docRef);
  }

  function handleShowRegister() {
    setShowRegister(true);
  }

  function handleHideRegister(){
    setShowRegister(false);
  }

  return (
    <div className="flex items-center select-none flex-col pb-7 px-2 max-w-2xl w-full">
      {created && <ConfirmationNotice noticeText={"Link cadastrado"}/>}
      {msgEmpty && <FailureNotice noticeText={msgEmpty}/>}
      <h1 className="logo mt-11 text-white mb-7 font-bold text-6xl">
        Meus
        <span className="bg-gradient-to-r from-sky-700 to-sky-700 bg-clip-text drop-shadow-lg text-transparent">
          Links
        </span>
      </h1>

      {links.map((link) => (
        <article
          key={link.id}
          className="flex items-center menu justify-between max-w-xl w-full rounded py-3 px-2 mb-6 select-none"
          style={{ backgroundColor: link.bg, color: link.color }}
        >
          <p>{link.name}</p>
          <button
            onClick={() => handleDeleteLink(link.id)}
            className="p-1 bg-white/20 text-sky-800/60 rounded"
          >
            <FaTrashCan size={18} />
          </button>
        </article>
      ))}

      <div className="flex flex-col justify-center items-center">
        {links.length === 0 && (
          <p className="menu text-white text-xl mb-7 drop-shadow-lg">
            Você não possui nenhum link. Que tal cadastrar um?
          </p>
        )}
        {!showRegister &&
           <button
           onClick={handleShowRegister}
           type="button"
           className=" bg-gradient-to-r from-sky-700 to-sky-700 drop-shadow-lg w-fit hover:scale-105 transition ease-in-out delay-150 duration-300 py-2 px-3 rounded-md border-0 text-lg menu text-white"
         >
           Cadastrar
         </button>}
     
      </div>
      {showRegister && (
        <form
          className="bg-neutral-600/80 py-5 drop-shadow-lg rounded-lg flex flex-col text-base menu gap-2 text-gray-800 mb-3 max-w-xl w-full px-5"
          onSubmit={handleLinkRegister}
        >
          <div className="flex justify-between items-center">
            <label className="font-medium mb-1 text-white">Nome</label>
            <button
              type="button"
              className="hover:scale-125 transition ease-in-out duration-300 text-white hover:text-sky-100"
              onClick={handleHideRegister}
            >
              <IoIosCloseCircle size={26} />
            </button>
          </div>

          <Input
            value={nameInput}
            required
            placeholder="Minha Página no Linkedin"
            onChange={(e) => setNameInput(e.target.value)}
          />

          <label className="font-medium text-white">URL</label>
          <Input
            placeholder="https://linkedin.com/"
            value={urlInput}
            type="url"
            required
            onChange={(e) => setUrlInput(e.target.value)}
          />

          <section className="flex my-1 text-white text-sm gap-5 justify-center">
            <div className="flex gap-2">
              <label className="font-medium mt-2">Cor de Fundo</label>
              <input
                className="rounded-sm cursor-pointer"
                type="color"
                value={bgColorInput}
                onChange={(e) => setBgColorInput(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <label className="font-medium mt-2 mb-2">Cor de Texto</label>
              <input
                className="rounded-sm cursor-pointer"
                type="color"
                value={textColorInput}
                onChange={(e) => setTextColorInput(e.target.value)}
              />
            </div>
          </section>

          {nameInput !== "" && (
            <div className="flex items-center flex-col mb-7 p-1 rounded-md">
              <h1 className="logo mt-1 text-white mb-4 font-bold text-4xl">
                Pré-
                <span className="bg-gradient-to-r from-sky-200 to-sky-300 bg-clip-text drop-shadow-lg text-transparent">
                  Visualização
                </span>
              </h1>
              <article
                className="w-11/12 max-w-lg flex flex-col items-center justify-between rounded-md px-1 py-3"
                style={{
                  backgroundColor: bgColorInput,
                  color: textColorInput,
                }}
              >
                <p className="font-medium">{nameInput}</p>
              </article>
            </div>
          )}

          <div className="flex flex-col items-center">
            <button
              type="submit"
              className=" bg-gradient-to-r from-sky-500 to-sky-700 drop-shadow-lg w-full hover:scale-105 transition ease-in-out delay-150 duration-300 py-2 px-3 rounded-md border-0 text-lg menu text-white"
            >
              <div className="flex menu items-center text-white drop-shadow-2xl text-xl font-semibold justify-center gap-2">Cadastrar
              <FaLink/></div>
              
            </button>
            
          </div>
        </form>
      )}
    </div>
  );
}
