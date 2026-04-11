export async function callN8n(
  endpoint: string,
  method: string,
  body?: unknown,
) {
  try {
    if (!process.env.N8N_BASE_URL) {
      throw new Error("N8N_BASE_URL is not configured");
    }

    const res = await fetch(`${process.env.N8N_BASE_URL}/webhook/${endpoint}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`n8n error: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("n8n call failed:", error);
    throw error;
  }
}
