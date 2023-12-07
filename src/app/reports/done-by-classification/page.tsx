"use client";

import Select from "react-select";

import { DonutChart } from "@/app/components/donut-chart";
import { PieChart } from "@/app/components/pie-chart";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type SelectOptionType = {
  value: string;
  label: string;
};

export default function DoneByClassification() {
  const [data, setData] = useState<any>();
  const [projects, setProjects] = useState<SelectOptionType[]>([]);
  const [project, setProject] = useState<string | undefined>();
  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();

  const fetchProjectList = async () => {
    const response = await fetch("/api/list-projects");
    const projectList: { key: string }[] = (await response.json()).projects;
    setProjects(
      projectList.map((project) => ({ value: project.key, label: project.key }))
    );
  };

  useEffect(() => {
    fetchProjectList();
  }, []);

  const generateChart = async () => {
    const response = await fetch(
      `/api/reports/done-by-classification?project=${project}&startDate=${
        startDate?.toISOString().split("T")[0]
      }&endDate=${endDate?.toISOString().split("T")[0]}`
    );

    setData((await response.json()).storyPointsByClassification);
  };

  // <main className="flex min-h-screen flex-col items-center justify-between p-24">
  return (
    <main className="flex flex-col min-h-screen p-8 space-y-8">
      <div id="controls" className="flex flex-row w-100 space-x-2">
        <Select
          options={projects}
          placeholder="Project"
          onChange={(value) => {
            setProject(value?.value);
          }}
        />
        <DatePicker
          className="rounded p-2 border-2"
          placeholderText="Start date"
          showIcon
          selected={startDate}
          onChange={(date) => {
            setStartDate(date);
          }}
        />
        <DatePicker
          className="rounded p-2 border-2"
          placeholderText="End date"
          showIcon
          selected={endDate}
          onChange={(date) => {
            setEndDate(date);
          }}
        />
        <button
          className="rounded bg-red-600 px-9 py-2 text-white"
          onClick={() => generateChart()}
        >
          GO
        </button>
      </div>
      <div className="flex flex-row space-x-4">
        <div className="border-2 w-[500px]">
          <PieChart data={data} />
        </div>
        <div className="border-2 w-[500px] h-[300px]">
          <DonutChart data={data} />
        </div>
      </div>
    </main>
  );
}
