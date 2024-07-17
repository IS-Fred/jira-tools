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

const MonthArray = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

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

  const fetchChartData = async () => {
    const projectList: string[] = selectedProjects.map(
      (optionType) => optionType.value
    );

    const [y, m] = reportMonth.toISOString().split("T")[0].split("-");
    const currentMonthStart = new Date(+y, +m - 1, 1);
    const currentMonthStartStr = currentMonthStart.toISOString().split("T")[0];
    const currentMonthEnd = new Date(+y, +m, 0).toISOString().split("T")[0];
    const previousMonthStart = new Date(+y, +m - 2, 1);
    const previousMonthStartStr = previousMonthStart
      .toISOString()
      .split("T")[0];
    const previousMonthEnd = new Date(+y, +m - 1, 0)
      .toISOString()
      .split("T")[0];

    let responsePromises: any[] = [];

    projectList.forEach((project) => {
      responsePromises = responsePromises.concat(
        fetch(
          `/api/charts/points-done-by-classification?project=${project}&startDate=${currentMonthStartStr}&endDate=${currentMonthEnd}`
        ),
        fetch(
          `/api/charts/points-done-by-classification?project=${project}&startDate=${previousMonthStartStr}&endDate=${previousMonthEnd}`
        )
      );
    });

    const responses = await Promise.all(responsePromises);
    const responsesJsonPromises = responses.map((response) => response.json());
    const responsesJson = await Promise.all(responsesJsonPromises);

    const results = {};

    projectList.forEach((project, index) => {
      // @ts-ignore
      results[project] = {
        current: {
          month: MonthArray[currentMonthStart.getMonth()],
          storyPointsByClassification:
            responsesJson[index * 2].storyPointsByClassification,
        },
        previous: {
          month: MonthArray[previousMonthStart.getMonth()],
          storyPointsByClassification:
            responsesJson[index * 2 + 1].storyPointsByClassification,
        },
      };
    });

    console.log("******* RESPONSES ********");
    console.log(results);
    setData(results);
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
          onClick={() => fetchChartData()}
        >
          GO
        </button>
      </div>
      {data &&
        selectedProjects.map((project) => (
          <div className="flex flex-col" key={project.value}>
            <div className="w-[1000px] text-center font-bold text-2xl pt-4 border-t-2">
              {project.label}
            </div>
            <div className="flex flex-row">
              <div className="flex flex-col">
                <div className="font-bold text-center">
                  {data[project.value]["previous"].month}
                </div>
                <div className="w-[500px] h-[300px] border-r-2">
                  <ClassificationChart
                    data={
                      data[project.value]["previous"]
                        .storyPointsByClassification
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="font-bold text-center">
                  {data[project.value]["current"].month}
                </div>
                <div className="w-[500px] h-[300px]">
                  <ClassificationChart
                    data={
                      data[project.value]["current"].storyPointsByClassification
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
    </main>
  );
}
