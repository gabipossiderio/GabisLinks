import { useState, FormEvent, useEffect, useContext } from "react";
import { Input } from "../../components/input";
import { Header } from "../../components/header";
import { LoginContext } from "../../contexts/login";
import { loadProfileData, setProfileData } from "../../utils/manageProfileData";
import { ConfirmationNotice } from "../../components/notices/confirmation";
import { Helmet } from "react-helmet";

export function SocialMedia() {
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [description, setDescription] = useState("");
  const { userId } = useContext(LoginContext);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
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

  const data = {
    facebook: facebook,
    instagram: instagram,
    youtube: youtube,
    user_id: userId,
    user_name: name,
    user_description: description,
    user_photo: photoURL,
  };
  function handleRegister(e: FormEvent) {
    e.preventDefault();
    setProfileData(data);
    setUpdated(true);
    setTimeout(() => {
      setUpdated(false);
    }, 2000);
  }

  return (
    <div className="flex items-center flex-col select-none min-h-screen pb-7 px-2">
       <Helmet>
        <title>Redes Sociais - GabisLinks</title>
      </Helmet>
      <Header />
      {updated && (
        <ConfirmationNotice noticeText={"Suas redes foram atualizadas"} />
      )}
      <h1 className="logo mt-11 text-white mb-7 font-bold text-6xl">
        Minhas
        <span className="bg-gradient-to-r from-sky-700 to-sky-700 bg-clip-text drop-shadow-lg text-transparent">
          Redes
        </span>
      </h1>
      <form
        className="bg-neutral-600/80  py-8 rounded-lg menu gap-2 mb-3 px-5 flex flex-col w-full max-w-xl text-base drop-shadow-lg text-gray-800"
        onSubmit={handleRegister}
      >
        <div className="flex gap-3 justify-between items-center p-1">
          <label className="text-white text-xl px-2">Instagram</label>
          <Input
            className="w-9/12 px-2 py-1 focus:outline-none focus:ring focus:ring-sky-700/50 mb-1 rounded-md "
            type="url"
            value={instagram}
            placeholder="URL do Instagram"
            onChange={(e) => setInstagram(e.target.value)}
          />
        </div>
        <div className="flex justify-between gap-3 items-center p-1">
          <label className="text-white text-xl px-2">Facebook</label>
          <Input
            className="w-9/12 px-2 py-1 focus:outline-none focus:ring focus:ring-sky-700/50 p-1 mb-1 rounded-md "
            type="url"
            value={facebook}
            placeholder="URL do Facebook"
            onChange={(e) => setFacebook(e.target.value)}
          />
        </div>
        <div className="flex justify-between gap-3 items-center p-1">
          <label className="text-white text-xl px-2">Youtube</label>
          <Input
            className="w-9/12  px-2 py-1 focus:outline-none focus:ring focus:ring-sky-700/50 p-1 mb-1 rounded-md "
            type="url"
            value={youtube}
            placeholder="URL do Youtube"
            onChange={(e) => setYoutube(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-gradient-to-r  from-sky-300 to-sky-400 w-full hover:scale-105 transition ease-in-out delay-150 duration-300 py-2 px-3 rounded-md border-0 text-xl menu mt-5 font-semibold text-white drop-shadow-2xl"
        >
          Salvar
        </button>
      </form>
    
    </div>
  );
}
