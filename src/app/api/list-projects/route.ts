import Jira from "../../utils/Jira";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  try {
    const projects = await Jira.listProjects()
        
    return NextResponse.json(
      {
        projects
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
