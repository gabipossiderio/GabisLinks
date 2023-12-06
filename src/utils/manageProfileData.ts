import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../services/firebaseConnection";

interface ProfileData {
  user_photo: string,
  user_name: string,
  user_id: string,
  user_description: string,
  youtube: string,
  instagram: string,
  facebook: string
}

export function loadProfileData(userId: string) {
  const socialRef = collection(db, "profile");
  const querySocialRef = query(socialRef, where("user_id", "==", userId));
  return getDocs(querySocialRef)
}

export async function setProfileData(data: ProfileData) {
  const { user_id } = data
  const profileDocRef = doc(db, "profile", user_id);
  setDoc(profileDocRef, data)
}
