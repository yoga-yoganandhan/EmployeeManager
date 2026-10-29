import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getEmployees } from "../api/employeeApi.js";
import { getErrorMessage } from "../api/axiosClient.js";
import { formatCurrency, formatDate } from "../utils/format.js";
import Loader from "../components/Loader.jsx";
import Alert from "../components/Alert.jsx";

const SAMPLE_SIZE = 200; // the API is paginated, so the dashboard samples the first 200 records

export default function Dashboard() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getEmployees({ page: 0, size: SAMPLE_SIZE, sortBy: "id", direction: "asc" })
      .then((data) => !cancelled && setPage(data))
      .catch((err) => !cancelled && setError(getErrorMessage(err)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    const list = page?.content ?? [];
    const payroll = list.reduce((sum, e) => sum + Number(e.salary || 0), 0);

    const byDept = {};
    list.forEach((e) => {
      const key = e.department || "Unassigned";
      byDept[key] = (byDept[key] || 0) + 1;
    });
    const departments = Object.entries(byDept).sort((a, b) => b[1] - a[1]);

    const recent = [...list]
      .filter((e) => e.hireDate)
      .sort((a, b) => b.hireDate.localeCompare(a.hireDate))
      .slice(0, 5);

    return {
      total: page?.totalElements ?? 0,
      departments,
      avgSalary: list.length ? payroll / list.length : 0,
      payroll,
      recent,
    };
  }, [page]);

  if (loading) return <Loader text="Loading dashboard..." />;
  if (error) return <Alert type="error">{error}</Alert>;

  const maxDept = stats.departments[0]?.[1] || 1;
  const sampled = stats.total > SAMPLE_SIZE;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">A quick look at your workforce.</p>
        </div>
        <Link to="/employees/new" className="btn btn-primary">
          + Add Employee
        </Link>
      </div>

      {sampled && (
        <Alert type="info">
          Figures other than the total are based on the first {SAMPLE_SIZE} employees.
        </Alert>
      )}

      <section className="stat-grid">
        <div className="card stat">
          <span className="muted">Total employees</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="card stat">
          <span className="muted">Departments</span>
          <strong>{stats.departments.length}</strong>
        </div>
        <div className="card stat">
          <span className="muted">Average salary</span>
          <strong>{formatCurrency(stats.avgSalary)}</strong>
        </div>
        <div className="card stat">
          <span className="muted">Total payroll</span>
          <strong>{formatCurrency(stats.payroll)}</strong>
        </div>
      </section>

      <section className="two-col">
        <div className="card">
          <h2>Employees by department</h2>
          {stats.departments.length === 0 ? (
            <p className="muted">No employees yet.</p>
          ) : (
            <ul className="bars">
              {stats.departments.map(([name, count]) => (
                <li key={name}>
                  <div className="bar-label">
                    <span>{name}</span>
                    <span className="muted">{count}</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${(count / maxDept) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card">
          <h2>Recent hires</h2>
          {stats.recent.length === 0 ? (
            <p className="muted">No hire dates recorded yet.</p>
          ) : (
            <ul className="recent">
              {stats.recent.map((e) => (
                <li key={e.id}>
                  <Link to={`/employees/${e.id}`}>{e.name}</Link>
                  <span className="muted">
                    {e.department} · {formatDate(e.hireDate)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
