// `page` is 0-based, exactly like Spring Data's Pageable
export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  // Show a window of up to 5 page buttons around the current page
  const windowSize = 5;
  let start = Math.max(0, page - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize);
  start = Math.max(0, end - windowSize);
  const pages = [];
  for (let i = start; i < end; i++) pages.push(i);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button className="btn btn-ghost btn-sm" disabled={page === 0} onClick={() => onChange(0)}>
        « First
      </button>
      <button className="btn btn-ghost btn-sm" disabled={page === 0} onClick={() => onChange(page - 1)}>
        ‹ Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={`btn btn-sm ${p === page ? "btn-primary" : "btn-ghost"}`}
          onClick={() => onChange(p)}
          aria-current={p === page ? "page" : undefined}
        >
          {p + 1}
        </button>
      ))}

      <button
        className="btn btn-ghost btn-sm"
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
      >
        Next ›
      </button>
      <button
        className="btn btn-ghost btn-sm"
        disabled={page >= totalPages - 1}
        onClick={() => onChange(totalPages - 1)}
      >
        Last »
      </button>
    </nav>
  );
}
