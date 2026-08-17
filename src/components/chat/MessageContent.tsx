import ReactMarkdown from "react-markdown";

interface MessageContentProps {
  content: string;
}

export default function MessageContent({
  content,
}: MessageContentProps) {
  return (
    <div className="message-content">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="md-h1">{children}</h1>
          ),

          h2: ({ children }) => (
            <h2 className="md-h2">{children}</h2>
          ),

          h3: ({ children }) => (
            <h3 className="md-h3">{children}</h3>
          ),

          p: ({ children }) => (
            <p className="md-p">{children}</p>
          ),

          ul: ({ children }) => (
            <ul className="md-ul">{children}</ul>
          ),

          ol: ({ children }) => (
            <ol className="md-ol">{children}</ol>
          ),

          li: ({ children }) => (
            <li className="md-li">{children}</li>
          ),

          strong: ({ children }) => (
            <strong className="md-strong">{children}</strong>
          ),

          em: ({ children }) => (
            <em className="md-em">{children}</em>
          ),

          code: ({ children, className }) => {
            const isBlock = className?.includes("language-");

            if (isBlock) {
              return <code>{children}</code>;
            }

            return (
              <code className="md-inline-code">
                {children}
              </code>
            );
          },

          pre: ({ children }) => (
            <pre className="md-code-block">
              {children}
            </pre>
          ),

          blockquote: ({ children }) => (
            <blockquote className="md-blockquote">
              {children}
            </blockquote>
          ),

          table: ({ children }) => (
            <div className="md-table-wrapper">
              <table className="md-table">
                {children}
              </table>
            </div>
          ),

          thead: ({ children }) => (
            <thead>{children}</thead>
          ),

          th: ({ children }) => (
            <th className="md-th">{children}</th>
          ),

          td: ({ children }) => (
            <td className="md-td">{children}</td>
          ),

          hr: () => (
            <hr className="md-hr" />
          ),

          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="md-link"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
