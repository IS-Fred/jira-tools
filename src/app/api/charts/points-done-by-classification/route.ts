import Jira, { CUSTOM_FIELD_NAMES } from "../../../utils/Jira";

import { NextRequest, NextResponse } from "next/server";

const storyFields = [
  CUSTOM_FIELD_NAMES["StoryPoints"],
  CUSTOM_FIELD_NAMES["Classification"],
  "summary",
];

const bugFields = [
  CUSTOM_FIELD_NAMES["StoryPoints"],
  CUSTOM_FIELD_NAMES["Classification"],
  "summary",
];

type StoryResultType = {
  key: string;
  fields: {
    summary: string;
    [CUSTOM_FIELD_NAMES.StoryPoints]: number;
    [CUSTOM_FIELD_NAMES.Classification]: {
      value: "Product" | "Tech debt" | "Support" | "Compliance" | "Bug";
    };
  };
};

type StoriesResultType = {
  issues: StoryResultType[];
};

type BugResultType = {
  key: string;
  fields: {
    summary: string;
    [CUSTOM_FIELD_NAMES.StoryPoints]: number;
  };
};

type BugsResultType = {
  issues: BugResultType[];
};

const TMP_PROJECT = "PAYC";
const TMP_START_DATE = "2023-11-01";
const TMP_END_DATE = "2023-11-30";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const storyPointsByClassification = {
    Product: 0,
    "Tech debt": 0,
    Support: 0,
    Compliance: 0,
    Bug: 0,
  };

  const project = searchParams.get("project") || TMP_PROJECT;
  const startDate = searchParams.get("startDate") || TMP_START_DATE;
  const endDate = searchParams.get("endDate") || TMP_END_DATE;

  if (!project || !startDate || !endDate) {
    return NextResponse.json(
      {
        status: "Error",
        // @ts-ignore
        error: "Parameters 'project', 'startDate' and 'endDate' are mandatory",
      },
      {
        status: 400,
      }
    );
  }

  const storyQuery = `project = ${project} AND issuetype = 'Story' AND resolutiondate >= "${startDate}" AND resolutiondate <= "${endDate}" AND resolution = Done`;
  const bugQuery = `project = ${project} AND issuetype = 'Bug' AND resolutiondate >= "${startDate}" AND resolutiondate <= "${endDate}" AND resolution = Done`;

  try {
    // @ts-ignore
    const stories: StoriesResultType = await Jira.searchJira(storyQuery, {
      fields: storyFields,
    });

    stories.issues.forEach((story: StoryResultType) => {
      if (
        !story.fields[CUSTOM_FIELD_NAMES.Classification] ||
        !story.fields[CUSTOM_FIELD_NAMES.StoryPoints]
      ) {
        return;
      }

      storyPointsByClassification[
        story.fields[CUSTOM_FIELD_NAMES.Classification].value
      ] += story.fields[CUSTOM_FIELD_NAMES.StoryPoints];
    });

    // @ts-ignore
    const bugs: BugsResultType = await Jira.searchJira(bugQuery, {
      fields: bugFields,
    });

    bugs.issues.forEach((bug: BugResultType) => {
      if (!bug.fields[CUSTOM_FIELD_NAMES.StoryPoints]) {
        return;
      }

      storyPointsByClassification["Bug"] +=
        bug.fields[CUSTOM_FIELD_NAMES.StoryPoints];
    });

    return NextResponse.json(
      {
        storyPointsByClassification,
      },
      {
        status: 200,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        status: "Error",
        // @ts-ignore
        error: JSON.parse(err.message).errorMessages,
      },
      {
        status: 500,
      }
    );
  }
}
