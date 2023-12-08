import { useEffect, useState, useContext } from "react";
import { Social } from "../../components/social-icons";
import { LoginContext } from "../../contexts/login";
import { db } from "../../services/firebaseConnection";
import { FaFacebook, FaInstagram, FaYoutube, FaRegCopy } from "react-icons/fa";
import { getDocs, collection, orderBy, query, where } from "firebase/firestore";
import { Header } from "../../components/header";
import { useNavigate, useParams } from "react-router-dom";
import { loadProfileData } from "../../utils/manageProfileData";
import PlaceholderImage from "../../assets/sem-foto.png";
import { ConfirmationNotice } from "../../components/notices/confirmation";
import { IoIosCloseCircle } from "react-icons/io";
import { FiShare2 } from "react-icons/fi";
import { Helmet } from "react-helmet";

interface LinkProps {
  id: string;
  name: string;
  url: string;
  bg: string;
  color: string;
}

export function Profile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [links, setLinks] = useState<LinkProps[]>([]);
  const { signed, userId } = useContext(LoginContext);
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [loading, setLoading] = useState(false);
  const [youtube, setYoutube] = useState("");
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [description, setDescription] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [msgCopiedText, setMsgCopiedText] = useState("");
  const [showCopyModal, setShowCopyModal] = useState(false);

  useEffect(() => {
    function CheckId() {
      setLoading(true);
      const q = query(collection(db, "profile"), where("user_id", "==", id));
      getDocs(q).then((result) => {
        if (result.size === 0) {
          navigate("/not-found"), { replace: true };
        }
        setLoading(false);
      });
    }
    CheckId();
  }, [id, navigate]);

  useEffect(() => {
    const current_url = window.location.href;
    setCurrentUrl(current_url);
  }, []);

  useEffect(() => {
    function loadLinks() {
      const linksRef = collection(db, "links");
      const queryRef = query(
        linksRef,
        where("user_id", "==", id),
        orderBy("created", "asc")
      );

      getDocs(queryRef).then((snapshot) => {
        const list = [] as LinkProps[];
        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            name: doc.data().name,
            url: doc.data().url,
            bg: doc.data().bg,
            color: doc.data().color,
          });
        });
        setLinks(list);
      });
    }
    loadLinks();
  }, [id]);

  useEffect(() => {
    loadProfileData(id!).then((snapshot) => {
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
  }, [id]);

  async function Copy() {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setMsgCopiedText("Texto copiado");
      setTimeout(() => {
        setMsgCopiedText("");
      }, 2000);
    } catch (err) {
      console.log("Falha ao copiar o texto", err);
    }
  }

  const placeholderDescription =
    "Que tal inserir uma descrição na sua conta? Assim, ela aparecerá aqui :)";

  return (
    <div className="min-h-screen drop-shadow-lg menu">
       <Helmet>
        <title>{name}</title>
      </Helmet>
      {!loading && (
        <div className="flex flex-col mb-10 w-full logo items-center justify-center">
          {signed && <Header />}
          <div className="flex items-end">
            {signed && msgCopiedText && (
              <ConfirmationNotice noticeText={msgCopiedText} />
            )}
            {(photoURL || signed) && (
              <div>
                <img
                  className="mb-2 rounded-full mt-7 outline-3 w-44 h-44 object-cover drop-shadow-lg outline-sky-700 outline"
                  src={!photoURL ? PlaceholderImage : photoURL}
                  alt="Profile photo"
                />
              </div>
            )}

            {signed && userId == id &&
              <button
                className="hover:text-white/70 hover:scale-110 text-sky-700 transition-all"
                onClick={() => {
                  setShowCopyModal(true);
                }}
              >
                <FiShare2 size={24} />
              </button>
            }
          </div>
          <div className="flex flex-col items-center w-full max-w-xl">
            {!photoURL && !signed && <div className="mt-16"></div>}
            <h1 className="md:text-6xl text-4xl mt-6 font-bold drop-shadow-2xl text-sky-700/90">
              {name}
            </h1>
            {!description && !signed && <div className="mt-8"></div>}
            {description && (
              <h2 className="menu mt-5 mb-2 w-3/4 text-center text-base menu font-medium text-white drop-shadow-lg max-w-xl">
                {description}
              </h2>
            )}
            {!description && signed && (
              <h2 className="menu mt-5 mb-2 w-3/4 text-center text-base menu font-medium text-white drop-shadow-lg max-w-xl">
                {placeholderDescription}
              </h2>
            )}
          </div>
          {showCopyModal && (
            <div className="justify-center menu mt-36 px-8 flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 max-w-4xl">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-sky-100 outline-none focus:outline-none">
                  <button
                    className="p-1 ml-auto bg-transparent hover:text-sky-800 border-0 text-sky-300  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowCopyModal(false)}
                  >
                    <IoIosCloseCircle size={26} />
                  </button>
                  <div className="flex items-start justify-between px-4 py-10 gap-8 border-b border-solid border-blueGray-200 flex-col rounded-t">
                    <h3 className="text-2xl px-10 text-gray-700 font-semibold">
                      Copie o link do seu perfil e compartilhe! :)
                    </h3>
                    <div className="flex text-xl gap-4 justify-center h-auto w-full p-3">
                      <input
                        className="w-3/4"
                        type="url"
                        disabled
                        value={currentUrl}
                      />{" "}
                      <button
                        type="button"
                        className="hover:text-sky-800 hover:scale-110 transition-all"
                        onClick={Copy}
                      >
                        <FaRegCopy size={22} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <main className="flex flex-col w-10/12 items-center menu mb-4 mt-6 max-w-xl text-center">
            {links.length === 0 && signed && (
              <h2 className="menu select-none bg-white/20 rounded-sm p-3 mt-5 mb-2 w-3/4 text-center text-base menu font-medium text-white drop-shadow-lg max-w-xl">
                Você ainda não possui links cadastrados.
              </h2>
            )}
            {links.length === 0 && !signed && (
              <h2 className="menu select-none bg-white/20 rounded-sm p-3 mt-5 mb-2 w-3/4 text-center text-base menu font-medium text-white drop-shadow-lg max-w-xl">
                Este usuário ainda não possui links cadastrados.
              </h2>
            )}
            {links.map((link) => (
              <section
                style={{ backgroundColor: link.bg, color: link.color }}
                key={link.id}
                className="bg-white mb-4 w-3/4 text-center py-2 rounded-md select-none transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 hover:bg-sky-700 duration-300 hover:text-white"
              >
                <a target="_blank" href={link.url}>
                  <p className="text-base md:text-lg">{link.name}</p>
                </a>
              </section>
            ))}

            <div className="flex justify-center gap-4 my-4 mb-2 text-sky-700 ">
              {facebook != "" && (
                <div className="mb-14">
                  {" "}
                  <Social url={facebook}>
                    <FaFacebook size={35} />
                  </Social>
                </div>
              )}
              {youtube != "" && (
                <div className="mb-14">
                  <Social url={youtube}>
                    <FaYoutube size={35} />
                  </Social>
                </div>
              )}
              {instagram != "" && (
                <div className="mb-14">
                  <Social url={instagram}>
                    <FaInstagram size={35} />
                  </Social>
                </div>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
