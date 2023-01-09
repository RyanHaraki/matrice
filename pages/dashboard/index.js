import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getUser } from "../../utils/db";
import DashboardNavbar from "../../components/Dashboard/DashboardNavbar";
import DashboardPage from "../../components/Dashboard/DashboardPage";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      user = getUser(user.uid)
        .then((user) => {
          setUser(user);
        })
        .catch((err) => console.error("ERROR FETCHING USER: ", err));
    } else {
      router.push("/");
    }
  }, []);

  return (
    <div className="grid grid-cols-5 gap-4 h-full">
      {/* Left sidebar */}
      <DashboardNavbar />

      {/* Product Overview section */}
      <DashboardPage userData={user} />
    </div>
  );
};

export default Dashboard;
