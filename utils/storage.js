import { storage } from "./firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

// @param path - can only be type "files" or "images"
const saveFile = (path, file) => {
  const storageRef = ref(storage, `${path}/${file}`);

  uploadBytes(storageRef, file).then((snapshot) => {
    console.log("Image succesfully uploaded.");
  });
};

// @param path - can only be type "files" or "images"
const getFile = (path, file) => {
  const pathReference = ref(storage, `${path}/${file}`);

  getDownloadURL(storage, pathReference)
    .then((url) => {
      return url;
    })
    .catch((error) => console.error(error));
};

// @param path - can only be type "files" or "images"
const deleteFile = (path, file) => {
  const pathReference = ref(storage, `${path}/${file}`);

  deleteObject(pathReference)
    .then(() => {
      console.log(`${path}/${file} succesfully deleted`);
    })
    .catch((error) => console.error(error));
};

export { saveFile, getFile, deleteFile };
