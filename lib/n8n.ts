export async function callN8n(
  endpoint: string,
  method: string,
  body?: unknown,
) {
  try {
    if (!process.env.N8N_BASE_URL) {
      throw new Error("N8N_BASE_URL is not configured");
    }

    const baseUrl = process.env.N8N_BASE_URL.replace(/\/+$/, "");
    const webhookBase = baseUrl.endsWith("/webhook")
      ? baseUrl
      : `${baseUrl}/webhook`;
    const normalizedEndpoint = endpoint.replace(/^\/+/, "");

    const res = await fetch(`${webhookBase}/${normalizedEndpoint}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    const responseText = await res.text();

    if (!res.ok) {
      throw new Error(
        `n8n error: ${res.status} ${responseText || res.statusText}`,
      );
    }

    if (!responseText) {
      return {};
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      return JSON.parse(responseText) as unknown;
    }

    try {
      return JSON.parse(responseText) as unknown;
    } catch {
      return responseText as unknown;
    }
  } catch (error) {
    console.error("n8n call failed:", error);
    throw error;
  }
}
