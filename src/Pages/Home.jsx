import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "../Componenets/Card";
import Navbar from "../Componenets/Navbar";

const Home = () => {
  let [stats, setStats] = useState();

  useEffect(() => {
    async function getData() {
      let { data } = await axios.get("/stats");
      setStats(data);
    }
    getData();
  }, []);

  return (
    <>
      <Navbar title="Dashboard" />
      <div className="md:w-3/4 grid grid-cols-2 gap-5 mx-auto pt-5">
        <Card title="Total Students:" num={stats?.[0]?.total} />
        <Card title="Total Teachers:" num={stats?.[2]?.total} />
        <Card title="Total Graduators:" num={stats?.[1]?.total} />
        <Card title="Total Courses:" num={stats?.[3]?.total} />
      </div>
    </>
  );
};

export default Home;
