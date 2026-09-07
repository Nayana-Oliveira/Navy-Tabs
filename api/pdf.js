import { issueSignedToken, presignUrl } from "@vercel/blob";

export default async function handler(request, response) {
  if (request.method !== "GET") {
    return response.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const pathname = request.query.pathname;

    if (!pathname) {
      throw new Error("Pathname não informado.");
    }

    const validUntil = Date.now() + 10 * 60 * 1000;

    const token = await issueSignedToken({
      pathname,

      operations: ["get"],

      validUntil,
    });

    const { presignedUrl } = await presignUrl(token, {
      pathname,

      operation: "get",

      access: "public",

      validUntil,
    });

    return response.redirect(302, presignedUrl);
  } catch (error) {
    console.error("PDF ERROR:", error);

    return response.status(400).json({
      error: error.message || "Não foi possível abrir o PDF.",
    });
  }
}
