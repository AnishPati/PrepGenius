import { NextRequest, NextResponse } from "next/server";

import { callN8n } from "../../../lib/n8n";
import {
  badRequest,
  getValidatedUserId,
  serverError,
} from "../../../lib/validators";
import type { QuizResponse } from "../../../types/quiz";

export async function GET(req: NextRequest) {
  const userValidation = getValidatedUserId(req);
  if (!userValidation.ok) {
    return badRequest(userValidation.error);
  }

  try {
    const data = (await callN8n(
      `get-quiz?user_id=${encodeURIComponent(userValidation.userId)}`,
      "GET",
    )) as Partial<QuizResponse>;

    const response = NextResponse.json(
      {
        quiz_id: data.quiz_id ?? "",
        questions: Array.isArray(data.questions) ? data.questions : [],
      },
      { status: 200 },
    );

    if (data.quiz_id) {
      response.cookies.set("current_quiz_id", data.quiz_id, {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return response;
  } catch (error) {
    console.error("GET /api/quiz failed:", error);
    return serverError();
  }
}
