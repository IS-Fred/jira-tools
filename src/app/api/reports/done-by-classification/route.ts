import Jira, { CUSTOM_FIELD_NAMES } from "../../../utils/Jira";

import { NextRequest, NextResponse } from "next/server";

const fields = [
  CUSTOM_FIELD_NAMES["StoryPoints"],
  CUSTOM_FIELD_NAMES["Classification"],
  "summary",
];

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const jql = searchParams.get("jql");

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
      (ret, cur) => {
        if (
          !cur.fields[CUSTOM_FIELD_NAMES["Classification"]] ||
          !cur.fields[CUSTOM_FIELD_NAMES["StoryPoints"]]
        ) {
          return ret;
        } else {
          return {
            ...ret,
            [cur.fields[CUSTOM_FIELD_NAMES["Classification"]].value]:
              ret[cur.fields[CUSTOM_FIELD_NAMES["Classification"]].value] +
              cur.fields[CUSTOM_FIELD_NAMES["StoryPoints"]],
          };
        }
      },
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
