import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
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
        error: "Server API key is not configured",
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const responseStream = await ai.models.generateContentStream({
      model: "gemini-3.5-flash",
      contents: `You are a helpful, intelligent AI assistant.

Answer the user's question accurately, clearly, and in sufficient detail.

IMPORTANT RESPONSE STYLE:

- Give a complete answer rather than an unnecessarily short answer.
- For simple questions, be concise but still explain the important details.
- For complex questions, provide a thorough and well-organized explanation.
- Break long answers into clear sections.
- Use Markdown formatting.
- Use headings when they improve readability.
- Use short paragraphs instead of large blocks of text.
- Use bullet points for lists.
- Use numbered lists for procedures and step-by-step instructions.
- Use **bold** for important terms and concepts.
- Use inline code for commands, filenames, variables, functions, and technical terms when appropriate.
- Use fenced code blocks for programming code.
- Leave a blank line between paragraphs and sections.
- Use tables when comparing multiple items.
- Explain technical concepts with examples when useful.
- When giving instructions, show the exact command or action and explain what it does.
- Do not unnecessarily repeat the user's question.
- Do not add artificial sections such as "Key Points" or "Summary" unless they are genuinely useful.
- Do not turn every response into a rigid template.
- Make the response natural and conversational while maintaining excellent structure.
- Prioritize useful, detailed answers over extremely short answers.

The response must be valid Markdown that can be rendered directly in the chat interface.

User's question:
${message}`,
    });

    // Tell the browser that we're sending a stream.
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");

    // Send each Gemini chunk immediately.
    for await (const chunk of responseStream) {
      const text = chunk.text || "";

      if (text) {
        res.write(text);
      }
    }

    res.end();
  } catch (error) {
    console.error("Gemini API streaming error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        error: "Failed to generate response",
      });
    }

    res.end();
  }
}
