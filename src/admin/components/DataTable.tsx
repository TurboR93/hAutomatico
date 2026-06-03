import { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  align?: 'left' | 'right' | 'center'
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
  onRowClick?: (row: T) => void
  emptyMessage?: string
}

const alignClass = { left: 'text-left', right: 'text-right', center: 'text-center' }

function DataTable<T>({
  columns,
  rows,
  rowKey,
  onRowClick,
  emptyMessage = 'Nessun movimento da mostrare.',
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/15 bg-white py-12 text-center text-sm text-black/50">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-sm">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-black/10 bg-neutral-50">
            {columns.map((c) => (
              <th
                key={c.key}
                className={`px-4 py-3 text-xs font-bold uppercase tracking-wide text-black/50 ${
                  alignClass[c.align || 'left']
                }`}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`border-b border-black/5 last:border-0 ${
                onRowClick ? 'cursor-pointer hover:bg-[#FDF07A]/30' : ''
              }`}
            >
              {columns.map((c) => (
                <td key={c.key} className={`px-4 py-3 ${alignClass[c.align || 'left']} ${c.className || ''}`}>
                  {c.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
