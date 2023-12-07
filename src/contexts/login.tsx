import { ReactNode, useEffect, useState, createContext } from "react";
import { auth } from "../services/firebaseConnection";
import { onAuthStateChanged } from "firebase/auth";

interface LoginProviderProps {
  children: ReactNode;
}

type LoginContextData = {
  signed: boolean;
  loading: boolean;
  userName: string;
  email: string;
  photo: string;
  userId: string;
  isReady: boolean;
  setIsReady: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LoginContext = createContext({} as LoginContextData);

function LoginProvider({ children }: LoginProviderProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [signed, setSigned] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [photo, setPhoto] = useState<string>("");
  const [isReady, setIsReady] = useState<boolean>(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          name: user?.displayName,
          email: user?.email,
          photo: user?.photoURL,
          id: user?.uid,
        };
        
        localStorage.setItem("@reactlinks", JSON.stringify(userData));
        setLoading(false);
        setSigned(true);
        setUserName(userData.name!);
        setEmail(userData.email!);
        setUserId(userData.id!)
        setPhoto(userData.photo!);
        console.log(userData.id)
      } else {
        setLoading(false);
        setSigned(false);
      }
    });

    return () => {
      unsub();
    };

  }, [userName, email]);

  return (
    <LoginContext.Provider value={{ signed, loading, userName, email, photo, userId, isReady, setIsReady }}>
      {children}
    </LoginContext.Provider>
  );
}

export default LoginProvider;