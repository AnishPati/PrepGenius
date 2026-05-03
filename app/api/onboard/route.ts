import { NextRequest, NextResponse } from "next/server";

import { callN8n } from "../../../lib/n8n";
import {
  badRequest,
  getRequiredString,
  isValidEmail,
  normalizeSpreadsheetId,
  serverError,
  validateContentLength,
} from "../../../lib/validators";
import type { OnboardRequest } from "../../../types/user";

export async function POST(req: NextRequest) {
  const payloadCheck = validateContentLength(req);
  if ("error" in payloadCheck) {
    return badRequest((payloadCheck as { ok: false; error: string }).error);
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
      if ("error" in parsed) {
        return badRequest((parsed as { ok: false; error: string }).error);
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

    const data = (await callN8n("onboard", "POST", body)) as Partial<{
      success: boolean;
      user_id: string;
      userId: string;
      id: string;
    }>;

    const userId = normalizeSpreadsheetId(
      data.user_id ?? data.userId ?? data.id,
    );
    if (!userId) {
      return serverError("Missing user_id from onboard response");
    }

    const response = NextResponse.json(
      { success: data.success !== false, user_id: userId },
      { status: 200 },
    );

    response.cookies.set("user_id", userId, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    response.cookies.set("user_name", collected.name, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    response.cookies.set(
      "user_profile",
      encodeURIComponent(
        JSON.stringify({
          company: collected.company,
          role: collected.role,
        }),
      ),
      {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      },
    );

    return response;
  } catch (error) {
    console.error("POST /api/onboard failed:", error);
    return serverError();
  }
}
