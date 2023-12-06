import Jira, { CUSTOM_FIELD_NAMES } from "../../../utils/Jira";

import { NextRequest, NextResponse } from "next/server";

const JQL =
  'project = PAYG AND resolution = Done AND type = Story AND resolutiondate >= "2023/11/01"  resolutiondate <= "2023/11/30"';

const fields = [
  CUSTOM_FIELD_NAMES["StoryPoints"],
  CUSTOM_FIELD_NAMES["Classification"],
  "summary",
];

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const jql = searchParams.get("jql");
  console.log("done_by_classification:");
  console.log(searchParams);

  if (!jql) {
    return NextResponse.json(
      {
        status: "Error",
        error: "'jql' parameter is required",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const issues = await Jira.searchJira(jql, { fields: fields });
    const storyPointsByClassification = issues.issues.reduce(
      // @ts-ignore
      (ret, cur) => ({
        ...ret,
        [cur.fields[CUSTOM_FIELD_NAMES["Classification"]].value]:
          ret[cur.fields[CUSTOM_FIELD_NAMES["Classification"]].value] +
          cur.fields[CUSTOM_FIELD_NAMES["StoryPoints"]],
      }),
      { Product: 0, "Tech debt": 0, Support: 0, Compliance: 0, Bug: 0 }
    );

    return NextResponse.json(
      {
        storyPointsByClassification,
        issues,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        status: "Error",
        jql: jql,
        // @ts-ignore
        error: JSON.parse(err.message).errorMessages,
      },
      {
        status: 500,
      }
    );
  }
}
