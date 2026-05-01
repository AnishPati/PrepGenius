import { NextRequest, NextResponse } from "next/server";

import { callN8n } from "../../../lib/n8n";
import {
  badRequest,
  getRequiredString,
  serverError,
  validateAnswersArray,
  validateContentLength,
} from "../../../lib/validators";
import type { SubmitRequest } from "../../../types/quiz";

export async function POST(req: NextRequest) {
  const payloadCheck = validateContentLength(req);
  if (!payloadCheck.ok) {
    return badRequest(payloadCheck.error);
  }

  try {
    const raw = (await req.json()) as Record<string, unknown>;

    const cookieUserId = req.cookies.get("user_id")?.value;
    const userId = cookieUserId
      ? { ok: true as const, value: cookieUserId }
      : getRequiredString(raw, "user_id");
    if (!userId.ok) {
      return badRequest(userId.error);
    }

    const quizId = getRequiredString(raw, "quiz_id");
    if (!quizId.ok) {
      return badRequest(quizId.error);
    }

    const answers = validateAnswersArray(raw.answers);
    if (!answers.ok) {
      return badRequest(answers.error);
    }

    const body: SubmitRequest = {
      user_id: userId.value,
      quiz_id: quizId.value,
      answers: answers.value,
    };

    await callN8n("submit", "POST", body);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("POST /api/submit failed:", error);
    return serverError();
  }
}
