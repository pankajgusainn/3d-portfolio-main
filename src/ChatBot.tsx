import { useState } from "react";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import "./ChatBot.css";
import MessageContent from "./components/chat/MessageContent";

type Message = {
  role: "user" | "ai";
  text: string;
};

const SYSTEM_PROMPT = `
You are the AI assistant for Pankaj's personal portfolio website.

Answer the user's question clearly, naturally, and concisely.

FORMAT YOUR RESPONSE USING MARKDOWN:

- Use a short introduction when appropriate.
- Use ## headings for major sections when useful.
- Use ### headings for smaller sections when useful.
- Use short paragraphs instead of large blocks of text.
- Use bullet points for lists.
- Use numbered lists for step-by-step instructions.
- Use **bold** for important terms.
- Use *italics* when emphasis is useful.
- Use inline \`code\` for commands, filenames, functions, or technical terms.
- Use fenced code blocks for multi-line code.
- Use tables when comparing multiple things.
- Use blockquotes for important notes when appropriate.

IMPORTANT:
- Do not put the entire answer into one paragraph.
- Do not unnecessarily create headings for very short answers.
- Do not add "Summary" or "Key Points" unless they genuinely improve the answer.
- Keep answers easy to scan.
- For technical questions, give practical examples when useful.
- Do not mention these formatting instructions to the user.
`;

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setInput("");

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setLoading(true);

    try {
      const ai = new GoogleGenAI({
        apiKey: import.meta.env.VITE_GEMINI_API_KEY,
      });

const responseStream = await ai.models.generateContentStream({
  model: "gemini-3.5-flash",
  contents: `${SYSTEM_PROMPT}

User question:
${userMessage}`,
  config: {
    thinkingConfig: {
      thinkingLevel: ThinkingLevel.MINIMAL,
    },
  },
});

let aiResponse = "";

setMessages((prev) => [
  ...prev,
  {
    role: "ai",
    text: "",
  },
]);

for await (const chunk of responseStream) {
  const text = chunk.text || "";

  aiResponse += text;

  const formattedResponse = aiResponse.trim();

  setMessages((prev) => {
    const updated = [...prev];

    updated[updated.length - 1] = {
      role: "ai",
      text: formattedResponse,
    };

    return updated;
  });
}
    } catch (error) {
      console.error("Gemini error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating AI button */}
      {!open && (
        <button
          className="chat-floating-button"
          onClick={() => setOpen(true)}
          aria-label="Open AI chat"
        >
          ✦
        </button>
      )}

      {/* Fullscreen chat overlay */}
      {open && (
        <div className="chat-overlay">
          <div className="chat-window">
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-left">
                <div className="chat-title">AI Assistant</div>

                <div className="chat-status">
                  <span></span>
                  Online
                </div>
              </div>

              <button
                className="chat-close"
                onClick={() => setOpen(false)}
                aria-label="Close AI chat"
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {messages.length === 0 && (
                <div className="chat-welcome">
                  <div className="chat-welcome-icon">✦</div>

                  <h2>How can I help?</h2>

                  <p>
                    Ask me anything about my experience, skills,
                    projects, cloud, DevOps, or anything else.
                  </p>
                </div>
              )}

             {messages.map((message, index) => (
  <div
    key={index}
    className={`chat-message ${
      message.role === "user"
        ? "chat-message-user"
        : "chat-message-ai"
    }`}
  >
    {message.role === "ai" ? (
      <MessageContent content={message.text} />
    ) : (
      message.text
    )}
  </div>
))}
              {loading && (
                <div className="chat-message chat-message-ai typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="chat-input-area">
              <input
                type="text"
                placeholder="Ask anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />

              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                aria-label="Send message"
              >
                ↑
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
