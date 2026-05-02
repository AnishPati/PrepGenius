import { NextRequest, NextResponse } from "next/server";

import { callN8n } from "../../../lib/n8n";
import {
  badRequest,
  getValidatedUserId,
  serverError,
} from "../../../lib/validators";
import type { UserProfileResponse } from "../../../types/user";

export async function GET(req: NextRequest) {
  const userValidation = getValidatedUserId(req);
  if (!userValidation.ok) {
    return badRequest((userValidation as { ok: false; error: string }).error);
  }

  try {
    const data = (await callN8n(
      `get-profile?user_id=${encodeURIComponent(userValidation.userId)}`,
      "GET",
    )) as Partial<UserProfileResponse>;

    return NextResponse.json(
      {
        ...data,
        weak_topics: Array.isArray(data.weak_topics) ? data.weak_topics : [],
        strong_topics: Array.isArray(data.strong_topics)
          ? data.strong_topics
          : [],
        progress_score:
          typeof data.progress_score === "number" ? data.progress_score : 0,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/profile failed:", error);
    return serverError();
  }
}
