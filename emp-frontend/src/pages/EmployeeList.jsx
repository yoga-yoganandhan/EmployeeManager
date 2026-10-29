import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getEmployeeByEmail, getEmployees } from "../api/employeeApi.js";
import { getErrorMessage } from "../api/axiosClient.js";
import { formatCurrency, formatDate, initials } from "../utils/format.js";
import Alert from "../components/Alert.jsx";
import Loader from "../components/Loader.jsx";
import Pagination from "../components/Pagination.jsx";

// Column header label -> field name the backend can sort by
const COLUMNS = [
  { label: "ID", field: "id" },
  { label: "Employee", field: "name" },
  { label: "Email", field: "email" },
  { label: "Department", field: "department" },
  { label: "Salary", field: "salary" },
  { label: "Hired", field: "hireDate" },
];

const PAGE_SIZES = [5, 10, 20, 50];

export default function EmployeeList() {
  const location = useLocation();
  const navigate = useNavigate();

  const [params, setParams] = useState({ page: 0, size: 5, sortBy: "id", direction: "asc" });
  const [data, setData] = useState(null); // Spring Page object
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState(location.state?.message || "");

  // search-by-email state
  const [emailQuery, setEmailQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null); // employee | null
  const [searchActive, setSearchActive] = useState(false);
  const [searching, setSearching] = useState(false);

  // Clear the one-time flash message from history so a refresh doesn't show it again
  useEffect(() => {
    if (location.state?.message) navigate(location.pathname, { replace: true, state: null });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load a page whenever page / size / sort changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    getEmployees(params)
      .then((res) => !cancelled && setData(res))
      .catch((err) => !cancelled && setError(getErrorMessage(err)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [params]);

  const toggleSort = (field) => {
    setParams((prev) => ({
      ...prev,
      page: 0,
      sortBy: field,
      direction: prev.sortBy === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const email = emailQuery.trim();
    if (!email) return;
    setSearching(true);
    setError("");
    try {
      setSearchResult(await getEmployeeByEmail(email));
    } catch (err) {
      // 404 -> "Employee not found" comes from the backend's ApiResponse message
      setSearchResult(null);
      setError(getErrorMessage(err));
    } finally {
      setSearchActive(true);
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setEmailQuery("");
    setSearchActive(false);
    setSearchResult(null);
    setError("");
  };

  const rows = searchActive ? (searchResult ? [searchResult] : []) : data?.content ?? [];

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Employees</h1>
          <p className="muted">
            {data ? `${data.totalElements} total` : "Browse and manage your team."}
          </p>
        </div>
        <Link to="/employees/new" className="btn btn-primary">
          + Add Employee
        </Link>
      </div>

      <Alert type="success" onClose={() => setFlash("")}>
        {flash}
      </Alert>
      <Alert type="error" onClose={() => setError("")}>
        {error}
      </Alert>

      <div className="toolbar">
        <form className="search" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Find by exact email..."
            value={emailQuery}
            onChange={(e) => setEmailQuery(e.target.value)}
          />
          <button className="btn btn-ghost" disabled={searching || !emailQuery.trim()}>
            {searching ? "Searching..." : "Search"}
          </button>
          {searchActive && (
            <button type="button" className="btn btn-ghost" onClick={clearSearch}>
              Clear
            </button>
          )}
        </form>

        <label className="page-size">
          Rows per page
          <select
            value={params.size}
            onChange={(e) => setParams((p) => ({ ...p, page: 0, size: Number(e.target.value) }))}
            disabled={searchActive}
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="card table-card">
        {loading && !data ? (
          <Loader text="Loading employees..." />
        ) : (
          <div className="table-wrap" aria-busy={loading}>
            <table>
              <thead>
                <tr>
                  {COLUMNS.map((col) => {
                    const active = params.sortBy === col.field && !searchActive;
                    return (
                      <th
                        key={col.field}
                        className={searchActive ? "" : "sortable"}
                        onClick={searchActive ? undefined : () => toggleSort(col.field)}
                      >
                        {col.label}
                        {active && <span className="sort-arrow">{params.direction === "asc" ? " ▲" : " ▼"}</span>}
                      </th>
                    );
                  })}
                  <th className="right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={COLUMNS.length + 1} className="empty">
                      {searchActive ? "No employee found with that email." : "No employees yet. Add your first one!"}
                    </td>
                  </tr>
                ) : (
                  rows.map((emp) => (
                    <tr key={emp.id} className={loading ? "dim" : ""}>
                      <td>{emp.id}</td>
                      <td>
                        <div className="person">
                          <span className="avatar">{initials(emp.name)}</span>
                          <Link to={`/employees/${emp.id}`}>{emp.name}</Link>
                        </div>
                      </td>
                      <td>{emp.email}</td>
                      <td>
                        <span className="chip">{emp.department || "—"}</span>
                      </td>
                      <td>{formatCurrency(emp.salary)}</td>
                      <td>{formatDate(emp.hireDate)}</td>
                      <td className="right">
                        <Link to={`/employees/${emp.id}`} className="btn btn-ghost btn-sm">
                          View
                        </Link>{" "}
                        <Link to={`/employees/${emp.id}/edit`} className="btn btn-ghost btn-sm">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!searchActive && data && (
        <div className="table-footer">
          <span className="muted">
            Page {data.number + 1} of {Math.max(data.totalPages, 1)}
          </span>
          <Pagination
            page={data.number}
            totalPages={data.totalPages}
            onChange={(p) => setParams((prev) => ({ ...prev, page: p }))}
          />
        </div>
      )}
    </>
  );
}
