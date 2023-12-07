"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
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
    color: "hsl(288, 50%, 50%)",
  },
  {
    type: "Tech debt",
    label: "Engineering",
    color: "hsl(216, 50%, 50%)",
  },
  {
    type: "Support",
    label: "Support",
    color: "hsl(72, 50%, 50%)",
  },
  {
    type: "Bug",
    label: "Bug",
    color: "hsl(0, 50%, 50%)",
  },
  {
    type: "Compliance",
    label: "Compliance",
    color: "hsl(144, 50%, 50%)",
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

  const pointTotal =
    data.Bug +
    data.Compliance +
    data.Product +
    data.Support +
    data["Tech debt"];

  const options: any = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "right",
        labels: {
          font: {
            size: 18,
          },
        },
      },
    },
  };

  const datasets: PieDatasetType = {
    // @ts-ignore
    data: pieConfig.map((x) => data[x.type]),
    backgroundColor: pieConfig.map((x) => x.color),
  };

  const pieData: PieDataType = {
    labels: pieConfig.map(
      // @ts-ignore
      (x) => `${x.label} (${Math.round((data[x.type] / pointTotal) * 100)} %)`
    ),
    datasets: [datasets],
  };

  return (
    <div className="my-[10%]">
      <Doughnut data={pieData} options={options} />
    </div>
  );
};
