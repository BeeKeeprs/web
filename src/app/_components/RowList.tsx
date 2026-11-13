import type { ReactNode } from "react";

export type RowItem = { title: string; body: ReactNode };

/**
 * Hairline-divided rows shared by the home FAQ and the pilot guide (styled to match the app list on the home page).
 * "accordion" folds the body under the title; "term" shows title and body side by side.
 */
export default function RowList({ items, variant = "accordion", label, className = "" }: { items: RowItem[]; variant?: "accordion" | "term"; label?: string; className?: string }) {
  if (variant === "term") {
    return (
      <dl className={`rl rl-term ${className}`.trim()} aria-label={label}>
        {items.map(({ title, body }) => <div key={title}><dt>{title}</dt><dd>{body}</dd></div>)}
      </dl>
    );
  }
  return (
    <div className={`rl rl-accordion ${className}`.trim()} aria-label={label}>
      {items.map(({ title, body }) => (
        <details key={title}>
          <summary><span>{title}</span><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 5 7 9.5 11.5 5" /></svg></summary>
          <div className="rl-body">{body}</div>
        </details>
      ))}
    </div>
  );
}
