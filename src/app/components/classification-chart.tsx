"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type PieSliceDataType = {
  name: string;
  value: number;
};

type PieDataType = PieSliceDataType[];

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

export const ClassificationChart = ({
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

  const pieData: PieDataType = pieConfig
    .map((x) => ({
      name: x.label,
      // @ts-ignore
      value: data[x.type],
    }))
    .filter((x) => x.value > 0);

  const COLORS = pieData.map(
    (slice) => pieConfig.find((config) => config.label === slice.name)?.color
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={800} height={800}>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ percent, index }) =>
            `${pieData[index].name} (${(percent * 100).toFixed(0)}%)`
          }
          innerRadius={40}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};
