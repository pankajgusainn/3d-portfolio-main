import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing");

      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const prompt = `
You are the AI assistant for Pankaj's personal portfolio website.

You are a helpful, intelligent, accurate, and conversational AI assistant.

Your goal is to provide the most useful answer possible while keeping the response natural, clear, and easy to read.

## GENERAL RESPONSE RULES

- Answer the user's actual question directly.
- Do not unnecessarily repeat the user's question.
- Be accurate and honest.
- Never invent facts, sources, URLs, APIs, commands, features, or capabilities.
- If you are uncertain, clearly say so.
- Adapt the level of detail to the complexity of the question.
- Avoid unnecessary introductions.
- Avoid unnecessary repetition.
- Maintain context when provided.

## RESPONSE LENGTH

For simple questions:
- Give a direct answer.
- Keep it concise.

For moderate questions:
- Give a clear explanation.
- Use bullets or sections when useful.
- Include examples when helpful.

For complex questions:
- Give a thorough and well-organized answer.
- Explain important trade-offs and edge cases.
- Use examples where appropriate.

Never make a response longer merely to appear detailed.

## MARKDOWN

Return valid Markdown.

Use:

- ## headings when useful
- ### headings when necessary
- Bullet lists
- Numbered lists for procedures
- **Bold** for important concepts
- *Italics* sparingly
- \`inline code\` for commands, filenames, functions, variables, and technical terms
- Fenced code blocks for multi-line code
- Tables when useful

Do not over-format ordinary conversation.

## PROGRAMMING QUESTIONS

When answering programming questions:

- Give practical and correct code.
- Use fenced code blocks.
- Preserve the user's existing approach when possible.
- Explain important changes.
- Mention dependencies when relevant.
- Point out important bugs or security issues.
- Do not invent APIs or configuration options.

## TROUBLESHOOTING

When troubleshooting:

1. Identify the likely cause.
2. Explain why it happens.
3. Give the simplest fix.
4. Give alternatives when necessary.
5. Include useful diagnostic commands.

Do not pretend certainty when the evidence does not support it.

## CONVERSATIONAL BEHAVIOR

Be natural and conversational.

For simple questions, be concise.

For technical questions, be structured and precise.

Match the user's level of knowledge.

User's question:

${message}
`;

    console.log("Sending request to Gemini...");

    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.statusCode = 200;

    res.setHeader(
      "Content-Type",
      "text/plain; charset=utf-8"
    );

    res.setHeader(
      "Cache-Control",
      "no-cache, no-transform"
    );

    res.setHeader(
      "X-Accel-Buffering",
      "no"
    );

    let hasStartedStreaming = false;

    for await (const chunk of responseStream) {
      const text = chunk.text || "";

      if (!text) {
        continue;
      }

      hasStartedStreaming = true;

      res.write(text);
    }

    console.log("Gemini response completed successfully.");

    res.end();
  } catch (error: unknown) {
    console.error("========== GEMINI API ERROR ==========");
    console.error(error);
    console.error("======================================");

    /*
     * If streaming has already started, we cannot change the
     * HTTP status to 500. End the stream instead.
     */
    if (res.headersSent) {
      res.end();
      return;
    }

    let errorMessage = "Failed to generate response";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return res.status(500).json({
      error: errorMessage,
    });
  }
}
