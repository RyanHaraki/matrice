import React from "react";
import { useState, useEffect, useRef } from "react";
import { FaChevronDown } from "react-icons/all";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { auth } from "../utils/auth";
import Image from "next/image";
import Logo from "../public/logo.svg";

function useOutsideAlerter() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleHideDropdown = (event) => {
      if (event.key === "Escape") {
        setVisible(false);
      }
    };

    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setVisible(false);
      }
    };

    document.addEventListener("keydown", handleHideDropdown, true);
    document.addEventListener("mousedown", handleClickOutside, true);

    return () => {
      document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, []);

  return { visible, ref, setVisible };
}

const Header = ({ userData }) => {
  const [user, setUser] = useState(null);

  const router = useRouter();
  const { ref, visible, setVisible } = useOutsideAlerter();

  useEffect(() => {
    setUser(userData);
  }, []);

  const logUserOut = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("user");
        router.push("/");
      })
      .catch((error) => {
        console.error(error);
        alert("There was a problem signing out.");
      });
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-300">
      <Image
        src={Logo}
        alt="Logo"
        className="w-10 h-10 cursor-pointer"
        onClick={() => router.push("/dashboard")}
      />

      <div ref={ref}>
        <button
          onClick={() => setVisible(!visible)}
          className="hover:bg-gray-100 rounded-md p-2 flex items-center justify-center text-gray-400"
        >
          {user?.displayName || "Login"} <FaChevronDown className={"ml-2"} />
        </button>
        {visible && (
          <div
            className={
              "absolute top-14 right-4 rounded-md border border-gray-300 bg-white overflow-hidden"
            }
            onClick={() => visible && setVisible(false)}
          >
            <button
              onClick={() => router.push("/dashboard")}
              className={
                "text-left text-sm hover:bg-blue-700 hover:text-white w-full px-4 py-2"
              }
            >
              Dashboard
            </button>
            <button
              onClick={() => router.replace("https://tally.so/r/mZ9W6V")}
              className={
                "text-left text-sm hover:bg-blue-700 hover:text-white w-full px-4 py-2"
              }
            >
              Request Feature
            </button>
            {user && (
              <button
                onClick={logUserOut}
                className={
                  "text-left text-sm hover:bg-blue-700 hover:text-white w-full px-4 py-2"
                }
              >
                Log Out
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
