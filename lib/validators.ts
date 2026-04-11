import { NextRequest, NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const MAX_PAYLOAD_BYTES = 20 * 1024;

export function sanitizeString(input: unknown): string {
  if (typeof input !== "string") {
    return "";
  }

  return input.trim();
}

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function getRequiredString(
  payload: Record<string, unknown>,
  field: string,
): { ok: true; value: string } | { ok: false; error: string } {
  const value = sanitizeString(payload[field]);

  if (!value) {
    return { ok: false, error: `Missing or invalid field: ${field}` };
  }

  return { ok: true, value };
}

export function validateContentLength(
  req: NextRequest,
): { ok: true } | { ok: false; error: string } {
  const contentLength = req.headers.get("content-length");
  if (!contentLength) {
    return { ok: true };
  }

  const length = Number(contentLength);
  if (Number.isNaN(length) || length < 0) {
    return { ok: false, error: "Invalid content-length header" };
  }

  if (length > MAX_PAYLOAD_BYTES) {
    return { ok: false, error: "Payload too large" };
  }

  return { ok: true };
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function serverError(message = "Internal server error") {
  return NextResponse.json({ error: message }, { status: 500 });
}

export function getValidatedUserId(
  req: NextRequest,
): { ok: true; userId: string } | { ok: false; error: string } {
  const raw = req.nextUrl.searchParams.get("user_id");
  const userId = sanitizeString(raw);

  if (!userId) {
    return { ok: false, error: "Missing query param: user_id" };
  }

  if (userId.length > 128) {
    return { ok: false, error: "Invalid user_id" };
  }

  return { ok: true, userId };
}

type QuizAnswerInput = {
  question_id: unknown;
  answer: unknown;
};

export function validateAnswersArray(
  answers: unknown,
):
  | { ok: true; value: Array<{ question_id: string; answer: string }> }
  | { ok: false; error: string } {
  if (!Array.isArray(answers)) {
    return { ok: false, error: "answers must be an array" };
  }

  if (answers.length === 0) {
    return { ok: false, error: "answers must not be empty" };
  }

  if (answers.length > 10) {
    return { ok: false, error: "answers length must be <= 10" };
  }

  const normalized: Array<{ question_id: string; answer: string }> = [];

  for (let i = 0; i < answers.length; i += 1) {
    const item = answers[i] as QuizAnswerInput;
    const questionId = sanitizeString(item?.question_id);
    const answer = sanitizeString(item?.answer);

    if (!questionId || !answer) {
      return { ok: false, error: `Invalid answers[${i}] structure` };
    }

    normalized.push({ question_id: questionId, answer });
  }

  return { ok: true, value: normalized };
}
