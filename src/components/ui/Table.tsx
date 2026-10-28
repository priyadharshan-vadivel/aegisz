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
    <div className={cn("overflow-hidden rounded-tile border border-border bg-bg", className)}>
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead className="hidden sm:table-header-group">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="label px-6 pt-7 pb-4 font-medium sm:px-8">
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
                      "block px-6 align-top sm:table-cell sm:px-8 sm:py-6",
                      j === 0 ? "pt-6" : "pt-2",
                      j === row.length - 1 && "pb-6",
                      isHeader ? "font-semibold text-fg" : "text-fg-muted",
                    )}
                  >
                    {j > 0 && <span className="label mr-2 sm:hidden">{head[j]}</span>}
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
