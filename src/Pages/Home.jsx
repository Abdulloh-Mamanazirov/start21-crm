import axios from "axios";
import React, { useEffect, useState } from "react";
import { Bar,Doughnut } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
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

  let doughnut = {
    data: {
      labels: ["Teachers", "Marketing", "Administrators", "Cleaners", "Others"],
      datasets: [
        {
          data: [150, 8, 10, 80, 30],
          backgroundColor: ["red", "lime", "blue", "purple", "yellow"],
        },
      ],
    },
    responsive: true,
    maintainAspectRatio: false,
  };
  
  const labels = ["January", "February", "March", "April", "May"];
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Total students",
        backgroundColor: "rgb(50, 153, 249)",
        borderColor: "rgb(255, 99, 132)",
        data: [170, 200, 185, 240, 280, 300],
      },
      {
        label: "Graduators",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: [25, 20, 12, 25, 40, 48],
      },
    ],
  };

  return (
    <>
      <Navbar title="Dashboard" />
      <div className="md:w-3/4 grid grid-cols-2 gap-5 mx-auto pt-5">
        <Card title="Total Students:" num={stats?.[0]?.total} />
        <Card title="Total Teachers:" num={stats?.[2]?.total} />
        <Card title="Total Graduators:" num={stats?.[1]?.total} />
        <Card title="Total Courses:" num={stats?.[3]?.total} />
      </div>
      <div className="my-10">
        <h2 className="text-center">Staff Statistics</h2>
        <div className="w-2/5 mx-auto">
          <Doughnut
            responsive={"true"}
            maintainaspectratio={"true"}
            data={doughnut.data}
          />
        </div>
        <div className="mt-10">
          <h2 className="text-center">Annual Statistics</h2>
          <Bar data={data} />
        </div>
      </div>
    </>
  );
};

export default Home;
