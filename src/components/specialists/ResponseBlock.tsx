import { SpecialistId, specialists } from "./SpecialistCard";

interface ResponseBlockProps {
  id: string;
  type: "archon" | SpecialistId;
  content: string;
  details?: { label: string; value: string }[];
}

// Decode HTML entities and render markdown-like formatting
function renderContent(raw: string): string {
  // Decode HTML entities
  let text = raw
    .replace(/&amp;/g, "&")
    .replace(/&#x2F;/g, "/")
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(Number(code)));

  // Escape any remaining HTML tags for safety
  text = text.replace(/<(?!br\s*\/?>)/g, "&lt;");

  // Bold: **text**
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Italic: *text* (but not inside bold)
  text = text.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');

  // Bullet lists: lines starting with - or •
  text = text.replace(/^[\-•]\s+(.+)$/gm, '<li>$1</li>');
  text = text.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul class="list-disc pl-4 my-2 space-y-1">$1</ul>');

  // Numbered lists: lines starting with 1. 2. etc
  text = text.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');

  // Newlines to <br/>
  text = text.replace(/\n/g, "<br/>");

  // Clean up double <br/> after lists
  text = text.replace(/<\/ul><br\/>/g, '</ul>');
  text = text.replace(/<\/li><br\/>/g, '</li>');

  return text;
}

const ResponseBlock = ({ id, type, content, details }: ResponseBlockProps) => {
  const isArchon = type === "archon";
  const specialist = !isArchon ? specialists[type as SpecialistId] : null;
  const Icon = specialist?.icon;

  const blockClass = isArchon 
    ? "response-block-archon" 
    : `response-block response-block-${type}`;

  return (
    <div className={`${blockClass} animate-fade-in-slow`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {isArchon ? (
            <div className="text-lg">🔱</div>
          ) : Icon ? (
            <Icon className="w-4 h-4 text-muted-foreground" />
          ) : null}
          <div>
            <span className="text-sm font-semibold tracking-wide">
              {isArchon ? "ARCHON" : specialist?.name}
            </span>
            <span className="text-xs text-muted-foreground ml-2">
              — {isArchon ? "Síntese" : specialist?.specialty}
            </span>
          </div>
        </div>
      </div>

      <div
        className="text-foreground/90 leading-relaxed mb-4 prose prose-sm max-w-none dark:prose-invert prose-strong:text-foreground prose-li:text-foreground/90"
        dangerouslySetInnerHTML={{
          __html: renderContent(content),
        }}
      />

      {details && details.length > 0 && (
        <div className="space-y-2 pt-4 border-t border-border">
          {details.map((detail, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wider min-w-[80px]">
                {detail.label}:
              </span>
              <span className="text-sm text-foreground/80">
                {detail.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResponseBlock;
