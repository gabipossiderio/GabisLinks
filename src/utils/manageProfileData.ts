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

export async function loadProfileData(userId: string) {
  const socialRef = collection(db, "profile");
  const querySocialRef = query(socialRef, where("user_id", "==", userId));
  const docs = await getDocs(querySocialRef)
  return docs
}

export async function updateProfileData(data: ProfileData) {
  const { user_id } = data
  const profileDocRef = doc(db, "profile", user_id);
  const updatedDoc = await setDoc(profileDocRef, data)
  return updatedDoc
}
