import clsx from "clsx";

export interface Column<T> {
  key: string;
  header: string;
  /** Right-align and use tabular figures — for scores, counts, percentages. */
  numeric?: boolean;
  width?: string;
  render: (row: T, index: number) => React.ReactNode;
}

/**
 * Shared table for the leaderboard, the student roster and the assignment
 * queue. Rows are separated by rules rather than gaps, which reads denser and
 * makes columns line up — the point of a table.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  highlight,
  empty = "Дерек жоқ.",
}: {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string;
  /** Marks a row as belonging to the current user. */
  highlight?: (row: T, index: number) => boolean;
  empty?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="surface-sunken p-6 text-center text-body text-slate-500 dark:text-slate-400">
        {empty}
      </div>
    );
  }

  return (
    <div className="surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/[0.03]">
              {columns.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  style={c.width ? { width: c.width } : undefined}
                  className={clsx(
                    "px-4 py-2.5 text-label uppercase text-slate-500 dark:text-slate-400",
                    c.numeric && "text-right"
                  )}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={rowKey(row, i)}
                className={clsx(
                  "border-b border-slate-100 last:border-b-0 dark:border-white/5",
                  highlight?.(row, i) && "bg-brand-50/60 dark:bg-brand-900/20"
                )}
              >
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={clsx(
                      "px-4 py-3 text-body",
                      c.numeric && "data-num text-right font-semibold"
                    )}
                  >
                    {c.render(row, i)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
