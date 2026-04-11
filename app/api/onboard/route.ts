import { NextRequest, NextResponse } from "next/server";

import { callN8n } from "../../../lib/n8n";
import {
  badRequest,
  getRequiredString,
  isValidEmail,
  serverError,
  validateContentLength,
} from "../../../lib/validators";
import type { OnboardRequest } from "../../../types/user";

export async function POST(req: NextRequest) {
  const payloadCheck = validateContentLength(req);
  if (!payloadCheck.ok) {
    return badRequest(payloadCheck.error);
  }

  try {
    const raw = (await req.json()) as Record<string, unknown>;

    const requiredFields = [
      "name",
      "email",
      "branch",
      "cgpa",
      "company",
      "role",
      "difficulty",
    ];
    const collected: Record<string, string> = {};

    for (const field of requiredFields) {
      const parsed = getRequiredString(raw, field);
      if (!parsed.ok) {
        return badRequest(parsed.error);
      }
      collected[field] = parsed.value;
    }

    if (!isValidEmail(collected.email)) {
      return badRequest("Invalid email format");
    }

    const questionCount = Number(raw.question_count ?? 10);
    if (
      !Number.isInteger(questionCount) ||
      questionCount <= 0 ||
      questionCount > 10
    ) {
      return badRequest("question_count must be an integer between 1 and 10");
    }

    const body: OnboardRequest = {
      name: collected.name,
      email: collected.email,
      branch: collected.branch,
      cgpa: collected.cgpa,
      company: collected.company,
      role: collected.role,
      difficulty: collected.difficulty,
      question_count: questionCount,
    };

    await callN8n("onboard", "POST", body);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("POST /api/onboard failed:", error);
    return serverError();
  }
}
