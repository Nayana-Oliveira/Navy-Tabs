import { issueSignedToken } from "@vercel/blob";

import { handleUploadPresigned } from "@vercel/blob/client";

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const result = await handleUploadPresigned({
      request,
      body: request.body,

      getSignedToken: async (pathname) => {
        const token = await issueSignedToken({
          pathname,

          operations: ["put"],

          allowedContentTypes: ["application/pdf"],

          maximumSizeInBytes: 50 * 1024 * 1024,

          validUntil: Date.now() + 15 * 60 * 1000,
        });

        return {
          token,

          urlOptions: {
            allowedContentTypes: ["application/pdf"],

            maximumSizeInBytes: 50 * 1024 * 1024,

            addRandomSuffix: false,

            validUntil: Date.now() + 15 * 60 * 1000,
          },
        };
      },
    });

    return response.status(200).json(result);
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return response.status(400).json({
      error: error.message || "Erro no upload.",
    });
  }
}
