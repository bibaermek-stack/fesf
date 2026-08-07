/**
 * Page and section heading with an optional trailing action. Having one
 * component keeps the type scale consistent — headings were previously picked
 * ad hoc (text-2xl here, text-lg there).
 */
export function SectionHeader({
  title,
  description,
  action,
  as: Tag = "h2",
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  as?: "h1" | "h2" | "h3";
}) {
  const size = Tag === "h1" ? "text-h1" : Tag === "h2" ? "text-h2" : "text-h3";
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <Tag className={size}>{title}</Tag>
        {description && (
          <p className="mt-1 text-body text-slate-600 dark:text-slate-400">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
