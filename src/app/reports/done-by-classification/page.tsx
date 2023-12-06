"use client";

import { Jql } from "@/app/components/jql";
import { PieChart } from "@/app/components/pie-chart";
import { useState } from "react";

const fetchResults = async (jql: string) => {
  const response = await fetch(
    `/api/reports/done-by-classification?jql=${encodeURIComponent(jql)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return (await response.json()).storyPointsByClassification;
};

export default function DoneByClassification() {
  const [data, setData] = useState<any>();

  const triggerJql = async (jql: string) => {
    console.log(jql);
    setData(await fetchResults(jql));
  };

  // <main className="flex min-h-screen flex-col items-center justify-between p-24">
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-[600px]">
        <Jql triggerJQL={triggerJql} />
        <PieChart data={data} />
      </div>
    </main>
  );
}
