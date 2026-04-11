import { NextRequest, NextResponse } from "next/server";

import { callN8n } from "../../../lib/n8n";
import {
  badRequest,
  getValidatedUserId,
  serverError,
} from "../../../lib/validators";
import type { EvaluationResponse } from "../../../types/evaluation";

export async function GET(req: NextRequest) {
  const userValidation = getValidatedUserId(req);
  if (!userValidation.ok) {
    return badRequest(userValidation.error);
  }

  try {
    const data = (await callN8n(
      `get-evaluation?user_id=${encodeURIComponent(userValidation.userId)}`,
      "GET",
    )) as Partial<EvaluationResponse>;

    return NextResponse.json(
      {
        overall_score:
          typeof data.overall_score === "number" ? data.overall_score : 0,
        weak_topics: Array.isArray(data.weak_topics) ? data.weak_topics : [],
        skill_gaps: Array.isArray(data.skill_gaps) ? data.skill_gaps : [],
        feedback: typeof data.feedback === "string" ? data.feedback : "",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/evaluation failed:", error);
    return serverError();
  }
}
