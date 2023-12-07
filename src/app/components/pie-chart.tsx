"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  DatasetChartOptions,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type PieDatasetType = {
  data: number[];
  backgroundColor: string[];
};

type PieDataType = {
  labels: string[];
  datasets: PieDatasetType[];
};

const pieConfig = [
  {
    type: "Product",
    label: "Product",
    color: "rgb(149, 227, 222)",
  },
  {
    type: "Support",
    label: "Support",
    color: "rgb(246, 219, 110)",
  },
  {
    type: "Bug",
    label: "Bug",
    color: "rgb(202, 87, 87)",
  },
  {
    type: "Compliance",
    label: "Compliance",
    color: "rgb(145, 202, 87)",
  },
  {
    type: "Tech debt",
    label: "Engineering",
    color: "rgb(62, 102, 201)",
  },
];

export const PieChart = ({
  data,
}: {
  data: {
    Bug: number;
    Compliance: number;
    Product: number;
    Support: number;
    "Tech debt": number;
  };
}) => {
  if (!data) return;

  const options: any = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "right",
      },
    },
  };

  const datasets: PieDatasetType = {
    // @ts-ignore
    data: pieConfig.map((x) => data[x.type]),
    backgroundColor: pieConfig.map((x) => x.color),
  };

  const pieData: PieDataType = {
    labels: pieConfig.map((x) => x.label),
    datasets: [datasets],
  };

  return (
    <div className="">
      <Doughnut data={pieData} options={options} height={"500px"} />
    </div>
  );
};
