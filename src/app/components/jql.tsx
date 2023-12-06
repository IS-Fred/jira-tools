"use client";

import { useState } from "react";

export const Jql = ({ triggerJQL }: { triggerJQL: (arg0: string) => any }) => {
  const [jql, setJql] = useState("");

  return (
    <div className="text-left text-lg py-3 px-3 m-auto flex">
      <input
        className="rounded mr-3 p-2 w-[450px] border-2"
        type="text"
        placeholder="JQL query"
        value={jql}
        onChange={(e) => setJql(e.target.value)}
      />
      <button
        className="rounded bg-red-600 px-9 py-2 text-white"
        onClick={() => {
          if (jql === "") return;
          triggerJQL(jql);
        }}
      >
        GO
      </button>
    </div>
  );
};
