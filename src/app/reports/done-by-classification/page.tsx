"use client";

import Select from 'react-select'

import { PieChart } from "@/app/components/pie-chart";
import { useState, useEffect } from "react";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

type SelectOptionType = {
  value: string,
  label: string
}

export default function DoneByClassification() {
  const [data, setData] = useState<any>();
  const [projects, setProjects] = useState<SelectOptionType[]>([])
  const [project, setProject] = useState<string|undefined>()
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const fetchProjectList = async () => {
    const response = await fetch("/api/list-projects")
    const projectList: { key: string }[] = (await response.json()).projects
    setProjects(projectList.map(project => ({ value: project.key, label: project.key })))
  }

  useEffect(() => {
    fetchProjectList();
  }, [])

  const generateChart = async () => {
    const response = await fetch(
      `/api/reports/done-by-classification?project=${project}&startDate=${startDate?.toISOString().split('T')[0]}&endDate=${endDate?.toISOString().split('T')[0]}`
    );
  
    setData((await response.json()).storyPointsByClassification)
  }

  // <main className="flex min-h-screen flex-col items-center justify-between p-24">
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 w-[600px]">
      <div className="border-2">
        <div>
        Project:
        <Select options={projects} onChange={(value) => {setProject(value?.value)}} />
        </div>
        <div>
          Start date:   
          <DatePicker selected={startDate} onChange={(date) => {setStartDate(date)}} />
        </div>
        <div>
          End date:   
          <DatePicker selected={endDate} onChange={(date) => {setEndDate(date)}} />
        </div>
              </div>
      <button className="rounded bg-red-600 px-9 py-2 text-white" onClick={() => generateChart()}>GO</button>
      <div className="border-2 w-[600px]">
        <PieChart data={data} />
      </div>
    </main>
  );
}
