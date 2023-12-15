"use client";

import { useState, useEffect } from "react";

import { ClassificationChart } from "@/app/components/classification-chart";

import Select, { MultiValue } from "react-select";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

type SelectOptionType = {
  value: string;
  label: string;
};

export default function Mbr() {
  const [data, setData] = useState<any>();
  const [projects, setProjects] = useState<MultiValue<SelectOptionType>>([]);
  const [selectedProjects, setSelectedProjects] = useState<
    MultiValue<SelectOptionType>
  >([]);
  const [reportMonth, setReportMonth] = useState<Date>(new Date());

  const fetchProjectList = async () => {
    const response = await fetch("/api/list-projects");
    const projectList: { key: string; name: string }[] = (await response.json())
      .projects;
    setProjects(
      projectList.map((project) => ({
        value: project.key,
        label: project.name,
      }))
    );
  };

  useEffect(() => {
    fetchProjectList();
  }, []);

  const generateChart = async () => {
    const projectList: string[] = selectedProjects.map(
      (optionType) => optionType.value
    );

    const response = await fetch(
      `/api/charts/points-done-by-classification?projects=${projectList.join(
        ","
      )}&month=${reportMonth?.toISOString().split("T")[0]}`
    );
    // setData((await response.json()).storyPointsByClassification);
  };

  return (
    <main className="flex flex-col min-h-screen p-8 space-y-8">
      <div id="controls" className="flex flex-row w-100 space-x-2">
        <div className="flex flex-row space-x-2">
          <span>Projects:</span>
          <Select
            className="min-w-[300px]"
            options={projects}
            placeholder="Projects"
            isMulti={true}
            onChange={(value) => {
              setSelectedProjects(value);
            }}
          />
        </div>
        <div className="flex flex-row space-x-2">
          <span>Report month:</span>
          <DatePicker
            className="rounded p-2 border-2 space-x-2"
            showMonthYearPicker
            dateFormat="MMM yyyy"
            selected={reportMonth}
            onChange={(date: Date) => {
              console.log(setReportMonth(date));
            }}
          />
        </div>
        <button
          className="rounded bg-red-600 px-9 py-2 text-white"
          onClick={() => generateChart()}
        >
          GO
        </button>
      </div>
    </main>
  );
}
