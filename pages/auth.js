import { useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { app } from "../utils/firebase";
import { useRouter } from "next/router";
import { FaGoogle } from "react-icons/fa";
import { createNewUser } from "../utils/db";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [login, setLogin] = useState(false); // false for sign up, true for login
  const [errorMessage, setErrorMessage] = useState("");

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      router.push("/dashboard");
    }
  }, []);

  useEffect(() => {
    if (errorMessage !== "") {
      alert(errorMessage);
    }
  }, [errorMessage]);

  // create user with Google oauth
  const loginWithGoogle = async () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        localStorage.setItem("user", JSON.stringify(user));

        // Add user to DB
        createNewUser(user.uid, user.displayName, user.email, 1);

        router.push("/dashboard");
      })
      .catch((error) => {
        alert("There was an error. Please try again.");

        console.error(error);
      });
  };

  // Sign user in with email
  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // save the users session in localstorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: user.uid,
            displayName: name,
            email: email,
          })
        );
        createNewUser(user.uid, user.name, user.email, 1);
        router.push("/dashboard");
      })
      .catch((error) => {
        // Handle login errors
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode == "auth/wrong-password") {
          alert("Incorrect password, please try again.");
        } else if (errorCode == "auth/user-disabled") {
          alert("Your account is disabled.");
        }
      });
  };

  // create user with email and password
  // TODO: add user to db
  const onSubmit = (e) => {
    e.preventDefault();
    // create a new user with email and password (firebase)
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        // save the users session in localstorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: user.uid,
            displayName: user.name,
            email: user.email,
          })
        );
        // add the user to the database
        createNewUser(user.uid, name, email, 1);
        // push to the dashboard
        router.push("/dashboard");
      })
      .catch((error) => {
        const { code, message } = error;

        if (code == "auth/email-already-in-use") {
          alert(
            "AUTHENTICATION ERROR: Account already exists. If this is you, try logging in."
          );
        }
      });
  };

  const renderSignUp = () => {
    return (
      <>
        <h2 className="font-bold text-2xl">Start Selling Today</h2>
        <input
          onChange={(e) => setName(e.target.value)}
          className="border py-1.5 px-4 border-gray-300 w-full rounded-md"
          type="text"
          placeholder="Name"
          required
        />
        <input
          onChange={(e) => setEmail(e.target.value)}
          className="border py-1.5 px-4 border-gray-300 w-full rounded-md"
          type="email"
          placeholder="Email"
          required
        />
        <input
          min={8}
          onChange={(e) => setPassword(e.target.value)}
          className="border py-1.5 px-4 border-gray-300 w-full rounded-md"
          type="password"
          placeholder="Password"
          required
        />
        <button
          className="bg-black text-white rounded-md w-full p-2 hover:bg-gray-800"
          type="submit"
        >
          Start Selling
        </button>
        <button
          onClick={() => loginWithGoogle()}
          className="bg-[#1A73E8] text-white rounded-md w-full py-2 px-4 flex items-center justify-center"
        >
          Login with Google <FaGoogle className="ml-2" />
        </button>
        <p
          onClick={() => setLogin(true)}
          className="text-sm text-gray-400 hover:underline cursor-pointer"
        >
          Have an account? Log in
        </p>
      </>
    );
  };

  const renderLogin = () => {
    return (
      <>
        <h2 className="font-bold text-2xl text-center">
          Login to your Account
        </h2>
        <input
          onChange={(e) => setEmail(e.target.value)}
          className="border py-1.5 px-4 border-gray-300 w-full rounded-md"
          type="email"
          placeholder="Email"
          required
        />
        <input
          min={8}
          onChange={(e) => setPassword(e.target.value)}
          className="border py-1.5 px-4 border-gray-300 w-full rounded-md"
          type="password"
          placeholder="Password"
          required
        />
        <button
          className="bg-black text-white rounded-md w-full p-2 hover:bg-gray-800"
          type="submit"
          onClick={(e) => signIn(e)}
        >
          Log in
        </button>
        <button
          onClick={() => loginWithGoogle()}
          className="bg-[#1A73E8] text-white rounded-md w-full py-2 px-4 flex items-center justify-center"
        >
          Login with Google <FaGoogle className="ml-2" />
        </button>
        <p
          onClick={() => setLogin(false)}
          className="text-sm text-gray-400 hover:underline cursor-pointer"
        >
          Don't have an account? Sign up
        </p>
      </>
    );
  };

  return (
    <div>
      <div className="h-screen w-full flex items-center justify-center p-12 md:p-0">
        <form
          onSubmit={(e) => onSubmit(e)}
          className="flex flex-col items-center border-gray-300 border p-6 rounded-md space-y-4 md:w-1/3 w-full lg:w-1/4 shadow-md"
        >
          {login ? renderLogin() : renderSignUp()}
        </form>
      </div>
    </div>
  );
}
