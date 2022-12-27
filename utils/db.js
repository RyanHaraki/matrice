import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

const createNewUser = async (uid, name, email, type) => {
  await setDoc(doc(db, "users", uid), {
    uid: uid,
    displayName: name,
    email: email,
    type: type == 1 ? "merchant" : "buyer",
    products: [],
    owned: [],
  });
};

const updateUser = async (uid, data) => {
  await updateDoc(doc(db, "users", uid), data);
};

const getUser = async (uid) => {
  const userRef = doc(db, "users", uid);

  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.error("USER DOES NOT EXIST");
  }
};

export { createNewUser, updateUser, getUser };
