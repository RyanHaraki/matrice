import { browserPopupRedirectResolver } from "firebase/auth";
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  query,
  where,
  collection,
  getDocs,
  arrayRemove,
} from "firebase/firestore";
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

const getUserByDisplayName = async (name) => {
  const userRef = collection(db, "users");

  const q = query(userRef, where("displayName", "==", name));

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) return null;

  const returnData = {
    ...querySnapshot.docs[0].data(),
    id: querySnapshot.docs[0].id,
  };

  return returnData;
};

const deleteProduct = (uid, product) => {
  console.log("DELETING PRODUCT: ", uid, product);
  updateUser(uid, {
    products: arrayRemove(product),
  });
};

export {
  createNewUser,
  updateUser,
  getUser,
  getUserByDisplayName,
  deleteProduct,
};
