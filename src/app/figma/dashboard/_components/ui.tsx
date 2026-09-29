import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet";
}) {
  return <button {...props} className={`sn-button ${variant} ${className}`} />;
}
export function Card({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`sn-card ${className}`} />;
}
export function PageHeader({
  crumb,
  title,
  subtitle,
}: {
  crumb: string;
  title: string;
  subtitle: string;
}) {
  return (
    <header className="sn-page-header">
      <p className="sn-eyebrow">{crumb}</p>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}
export function StatusBadge({
  tone = "info",
  children,
}: {
  tone?: string;
  children: ReactNode;
}) {
  return <span className={`sn-badge ${tone}`}>{children}</span>;
}
export function ProgressBar({ value }: { value: number }) {
  return (
    <div
      className="sn-progress"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: `${value}%` }} />
    </div>
  );
}
export function EmptyState({ children }: { children: ReactNode }) {
  return <p className="sn-empty">{children}</p>;
}
export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, string> = {
    dashboard: "M3 10 12 3l9 7v10H3Z M9 20v-7h6v7",
    documents: "M6 3h9l4 4v14H6Z M14 3v5h5 M9 12h7 M9 16h7",
    notifications: "M5 17h14l-2-3V9a5 5 0 0 0-10 0v5Z M10 21h4",
    support:
      "M4 13v-2a8 8 0 0 1 16 0v2 M4 12h3v7H4Z M17 12h3v7h-3Z M17 19v2h-5",
    zenna: "M8 4H5v17h14V4h-3 M8 3h8v4H8Z M8 11h8 M8 15h6",
    connect: "M3 6h12v12H3Z M15 10l6-3v10l-6-3",
    cst: "M12 3a9 9 0 1 0 9 9 M12 7a5 5 0 1 0 5 5 M12 12l9-9 M17 3h4v4",
    p004: "M8 16c-4 0-5 5-5 5s5-1 5-5 M8 15l-3-3 4-3 M9 15l6-6c3-3 6-6 6-6s0 5-3 8l-6 6Z M15 16l-3 5-3-3",
    settings:
      "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M12 2l3 3 4 1 1 4 2 2-2 3-1 4-4 1-3 2-3-2-4-1-1-4-2-3 2-2 1-4 4-1Z",
    logout: "M10 3H4v18h6 M10 12h11 M17 8l4 4-4 4",
    search: "M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14 M15 15l6 6",
    arrow: "M4 12h16 M14 6l6 6-6 6",
    close: "M5 5l14 14 M19 5 5 19",
    menu: "M4 6h16 M4 12h16 M4 18h16",
    check: "M4 12l5 5L20 6",
    lock: "M6 11h12v10H6Z M8 11V7a4 4 0 0 1 8 0v4",
    calendar: "M3 5h18v16H3Z M3 10h18 M7 3v4 M17 3v4",
    mail: "M3 5h18v14H3Z M3 5l9 8 9-8",
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.support} />
    </svg>
  );
}
