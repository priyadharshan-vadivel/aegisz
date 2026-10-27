import { cn } from "@/lib/cn";

type TableProps = {
  caption: string;
  head: string[];
  rows: React.ReactNode[][];
  /** First cell of each row is a row header. */
  rowHeaders?: boolean;
  className?: string;
};

/**
 * Real <table> from sm up; on narrow screens each row stacks as a labelled block
 * so nothing scrolls horizontally.
 */
export function Table({ caption, head, rows, rowHeaders = true, className }: TableProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border", className)}>
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="hidden bg-surface-2 sm:table-header-group">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-5 py-3 font-medium text-fg">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="block border-t border-border first:border-t-0 sm:table-row sm:first:border-t">
              {row.map((cell, j) => {
                const isHeader = rowHeaders && j === 0;
                const Cell = isHeader ? "th" : "td";
                return (
                  <Cell
                    key={j}
                    scope={isHeader ? "row" : undefined}
                    className={cn(
                      "block px-5 align-top sm:table-cell sm:py-4",
                      j === 0 ? "pt-4" : "pt-1",
                      j === row.length - 1 && "pb-4",
                      isHeader ? "font-medium text-fg" : "text-fg-muted",
                    )}
                  >
                    {j > 0 && (
                      <span className="mr-1 font-mono text-xs text-fg-subtle sm:hidden">{head[j]}:</span>
                    )}
                    {cell}
                  </Cell>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
