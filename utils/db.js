import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const createNewUser = async (uid, name, email, type) => {
  await setDoc(doc(db, "users", name), {
    uid: uid,
    displayName: name,
    email: email,
    type: type == 1 ? "merchant" : "buyer",
    products: [],
    owned: [],
  });
};

export { createNewUser };
