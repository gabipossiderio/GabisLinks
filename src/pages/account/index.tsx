import { useState, FormEvent, useContext, useEffect } from "react";
import { storage } from "../../services/firebaseConnection";
import { LoginContext } from "../../contexts/login";
import { Input } from "../../components/input";
import { Header } from "../../components/header";
import { IoIosCloseCircle } from "react-icons/io";
import { MdSmsFailed } from "react-icons/md";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { loadProfileData, updateProfileData } from "../../utils/manageProfileData";
import PlaceholderImage from "../../assets/sem-foto.png";
import { FaTrash } from "react-icons/fa6";
import { ConfirmationNotice } from "../../components/notices/confirmation";
import { LoadingNotice } from "../../components/notices/loading";
import { deleteUser, getAuth, updatePassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { RiLockPasswordFill } from "react-icons/ri";
import { FailureNotice } from "../../components/notices/failure";
import { MdDeleteForever } from "react-icons/md";
import { Helmet } from "react-helmet";

export function Account() {
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<File>();
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userId } = useContext(LoginContext);
  const [photoURL, setPhotoURL] = useState("");
  const [deleteImg, setDeleteImg] = useState(false);
  const [typedCharacters, setTypedCharacters] = useState(150);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [msgPassword, setMsgPassword] = useState("");
  const [msgNameEmpty, setMsgNameEmpty] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log(userId);
    loadProfileData(userId).then((snapshot) => {
      snapshot.forEach((doc) => {
        if (doc) {
          setFacebook(doc.data()?.facebook);
          setInstagram(doc.data()?.instagram);
          setYoutube(doc.data()?.youtube);
          setPhotoURL(doc.data()?.user_photo);
          setName(doc.data()?.user_name);
          setDescription(doc.data()?.user_description);
        }
      });
    });
  }, [userId]);

  useEffect(() => {
    const total = 100;
    const digited = description.length;
    const characters = total - digited;
    setTypedCharacters(characters);
  }, [description]);

  function handleDeleteImg() {
    setPhotoURL("");
    setDeleteImg(true);
  }

  function handleProfileRegister(e: FormEvent) {
    e.preventDefault();
    if (name === "") {
      setMsgNameEmpty("Por favor, preencha seu nome");
      setTimeout(() => {
        setMsgNameEmpty("");
      }, 2000);
      return;
    }
    handleUploadImage().catch((error) => {
      console.log(error);
    });

    if (deleteImg) {
      deleteObject(ref(storage, `images/${userId}`));
    }

    const data = {
      user_photo: photoURL,
      user_name: name,
      user_id: userId,
      user_description: description,
      youtube: youtube,
      instagram: instagram,
      facebook: facebook,
    };

    updateProfileData(data)
      .then(() => {
        setUpdated(true);
        setTimeout(() => {
          setUpdated(false);
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function handleUploadImage() {
    if (photo == null) return;
    setLoading(true);
    const imageRef = ref(storage, `images/${userId}`);
    uploadBytes(imageRef, photo)
      .then(() => {
        getDownloadURL(imageRef).then((url) => {
          console.log(url);
          setPhotoURL(url);
          setLoading(false);
          setPhoto(undefined);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleDeleteAccount() {
    const auth = getAuth();
    const user = auth.currentUser;

    deleteUser(user!)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setMsgPassword("Sua senha precisa ter, no mínimo, 6 caracteres.");
      setTimeout(() => {
        setMsgPassword("");
      }, 2000);
      return;
    }
    const auth = getAuth();
    const user = auth.currentUser;
    const newPassword = password;

    updatePassword(user!, newPassword)
      .then(() => {
        setShowPasswordModal(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="mb-auto flex items-center flex-col select-none min-h-screen pb-7 px-2">
      <Helmet>
        <title>Minha Conta - GabisLinks</title>
      </Helmet>
      <Header />
      {updated && <ConfirmationNotice noticeText={"Conta atualizada"} />}
      {msgNameEmpty && <FailureNotice noticeText={msgNameEmpty} />}
      {loading && <LoadingNotice noticeText={"Carregando"} />}
      <h1 className="logo mt-11 text-white mb-7 font-bold text-6xl">
        Minha
        <span className="bg-gradient-to-r from-sky-700 to-sky-700 bg-clip-text drop-shadow-lg text-transparent">
          Conta
        </span>
      </h1>

      <div className="flex items-end flex-col justify-center mt-0">
        <div className="flex flex-col items-center sm:gap-10 max-w-2xl px-2 sm:flex-row sm:items-start">
          <div className=" flex items-center flex-col w-80 justify-center">
            <img
              className="mb-2 rounded-full outline-3 w-44 h-44 object-cover drop-shadow-lg outline-sky-700 outline"
              src={photoURL ? photoURL : PlaceholderImage}
            />
            <button
              className="text-xs flex text-gray-700/70 items-center hover:scale-105 transition ease-in-out delay-150 duration-300  gap-1"
              type="button"
              onClick={handleDeleteImg}
              style={photoURL ? {} : { visibility: "hidden" }}
            >
              Excluir <FaTrash size={11} />
            </button>
            <div className="flex flex-col mb-3 py-3 drop-shadow-lg menu mt-1 bg-neutral-500 rounded-lg justify-center items-center">
              <label className="text-white text-base block">
                {photoURL ? "Alterar foto" : "Adicionar foto"}
              </label>
              <Input
                className="w-10/12 px-4 py-2 text-white rounded-md text-xs focus:outline-none cursor-pointer"
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => setPhoto(e.target.files![0])}
              />
              {photo && (
                <button
                  type="button"
                  className="bg-gradient-to-r  from-sky-700 to-sky-800 w-fit hover:scale-110 transition-all delay-150 duration-300 py-2 px-3 rounded-md border-0 text-xs menu font-semibold text-white drop-shadow-2xl"
                  onClick={handleUploadImage}
                >
                  Carregar foto
                </button>
              )}
              {!photo && (
                <small className=" text-xs py-2 text-white">
                  Formatos aceitos: PNG, JPG
                </small>
              )}
            </div>
          </div>

          <form className="bg-neutral-500 py-4 rounded-lg menu gap-1 px-7  flex flex-col sm:w-full max-w-lg text-base drop-shadow-lg text-gray-800">
            <h1 className="logo text-center text-white mb-1 font-bold text-4xl">
              Informações
              <span className="bg-gradient-to-r  from-sky-300 to-sky-400 bg-clip-text drop-shadow-lg text-transparent">
                Pessoais
              </span>
            </h1>
            <div className="flex justify-start items-start flex-col">
              <label className="text-white text-base mb-1">Nome</label>
              <Input
                className="w-full p-1 focus:outline-none focus:ring focus:ring-sky-700/50 mb-1 rounded-md "
                type="text"
                required
                value={name}
                maxLength={20}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex gap-1 justify-between flex-col items-start">
              <label className="text-white text-base mb-1 mt-1">
                Descrição
              </label>
              <textarea
                className=" w-full p-1 h-28 focus:outline-none focus:ring focus:ring-sky-700/50 rounded-md "
                value={description}
                placeholder="Descrição do seu perfil"
                onChange={(e) => setDescription(e.target.value)}
                maxLength={100}
                style={{ resize: "none" }}
              />
              <small className="text-gray-800/80">
                Restam {typedCharacters} caracteres
              </small>
            </div>
          </form>
        </div>
        <div className="flex sm:gap-10 gap-3 items-center pt-3 sm:pt-0 menu sm:flex-row flex-col sm:p-1 m-auto text-sm sm:items-end sm:mr-3 sm:mb-1">
          {" "}
          <button
            type="button"
            className=" text-gray-800/80 flex gap-1 hover:text-sky-800"
            onClick={() => setShowAccountModal(true)}
          >
            Excluir minha conta <MdDeleteForever size={18} />
          </button>
          {showAccountModal && (
            <div className="justify-center menu items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                {/*content*/}
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-sky-100 outline-none focus:outline-none">
                  {/*header*/}
                  <button
                    className="p-1 ml-auto bg-transparent hover:text-sky-800 border-0 text-sky-300  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowAccountModal(false)}
                  >
                    <IoIosCloseCircle size={26} />
                  </button>
                  <div className="flex items-start justify-between px-8 py-4 border-b border-solid border-blueGray-200 flex-col rounded-t">
                    <svg
                      className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-sky-700"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    <h3 className="text-2xl text-gray-700 font-semibold">
                      Tem certeza que deseja excluir sua conta?
                    </h3>
                    <div className="flex items-center justify-center gap-1 h-auto w-full mt-5 mb-5">
                      <button
                        data-modal-hide="popup-modal"
                        onClick={handleDeleteAccount}
                        type="button"
                        className="text-white w-1/3 text-center justify-center bg-sky-800 hover:bg-sky-800 focus:ring-4 focus:outline-none focus:ring-sky-300 dark:focus:ring-sky-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 me-2"
                      >
                        Sim, quero
                      </button>
                      <button
                        data-modal-hide="popup-modal"
                        onClick={() => setShowAccountModal(false)}
                        type="button"
                        className="text-gray-700 w-1/3 bg-white justify-center hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-700 dark:hover:text-white dark:hover:bg-gray-800 dark:focus:ring-gray-800"
                      >
                        Não, cancelar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <button
            type="button"
            className="hover:text-sky-800 flex gap-1 text-gray-800/80"
            onClick={() => setShowPasswordModal(true)}
          >
            Alterar minha senha <RiLockPasswordFill size={16} />
          </button>
          {showPasswordModal && (
            <div className="justify-center menu items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-3xl bg-sky-100 p-6 outline-none focus:outline-none">
                  <button
                    className="p-1 ml-auto bg-transparent hover:text-sky-800 border-0 text-sky-300  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPassword("");
                    }}
                  >
                    <IoIosCloseCircle size={26} />
                  </button>
                  <div className="flex items-center gap-4 justify-between px-10 py-4 border-b border-solid border-blueGray-200 flex-col rounded-t">
                    <h3 className="text-2xl text-gray-700 font-semibold mb-4">
                      Alterar senha de acesso
                    </h3>
                    <div className="text-sm max-w-sm w-fit">
                      {msgPassword && (
                        <div className="max-w-xl mt-1 px-3 py-2 gap-1 select-none text-center menu text-white flex items-center justify-between bg-gradient-to-r text-md from-sky-700 to-sky-700/90 drop-shadow-lg rounded-md">
                          <MdSmsFailed size={22} />
                          {msgPassword}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4 flex-col">
                      <form
                        onSubmit={handleChangePassword}
                        className="flex gap-5 flex-col"
                      >
                        <div className="flex items-end justify-between mr-2">
                          <label className="text-sky-700 w-fit  pt-2 font-medium text-lg rounded-md">
                            Senha
                          </label>
                          <small className="text-xs text-left flex pb-2 gap-1 ml-28 text-gray-800/70">
                            Mínimo: 6 Caracteres{" "}
                            <RiLockPasswordFill size={15} />
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
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-sky-700 to-sky-700 hover:scale-105 transition w-full ease-in-out delay-150 duration-300 py-2 px-16 rounded-md border-0 text-xl menu mt-5 font-semibold text-white drop-shadow-2xl"
                        >
                          Alterar
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <button
        type="submit"
        onClick={handleProfileRegister}
        className="bg-gradient-to-r mb-10 sm:mb-0 from-sky-700 to-sky-700 w-fit hover:scale-105 transition ease-in-out delay-150 duration-300 py-2 px-16 rounded-md border-0 text-xl menu mt-5 font-semibold text-white drop-shadow-2xl"
      >
        Salvar
      </button>
    </div>
  );
}
