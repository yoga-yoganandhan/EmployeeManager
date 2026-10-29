import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getEmployeeById } from "../api/employeeApi.js";
import { getErrorMessage } from "../api/axiosClient.js";
import { formatCurrency, formatDate, initials } from "../utils/format.js";
import Alert from "../components/Alert.jsx";
import Loader from "../components/Loader.jsx";

export default function EmployeeDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [flash, setFlash] = useState(location.state?.message || "");

  useEffect(() => {
    if (location.state?.message) navigate(location.pathname, { replace: true, state: null });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    getEmployeeById(id)
      .then((data) => !cancelled && setEmployee(data))
      .catch((err) => !cancelled && setError(getErrorMessage(err)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <Loader text="Loading employee..." />;

  if (error) {
    return (
      <>
        <Alert type="error">{error}</Alert>
        <Link to="/employees" className="btn btn-ghost">
          ← Back to employees
        </Link>
      </>
    );
  }

  const fields = [
    ["Employee ID", employee.id],
    ["Email", employee.email],
    ["Department", employee.department || "—"],
    ["Salary", formatCurrency(employee.salary)],
    ["Hire date", formatDate(employee.hireDate)],
  ];

  return (
    <>
      <div className="page-head">
        <Link to="/employees" className="btn btn-ghost btn-sm">
          ← Back
        </Link>
        <Link to={`/employees/${employee.id}/edit`} className="btn btn-primary">
          Edit employee
        </Link>
      </div>

      <Alert type="success" onClose={() => setFlash("")}>
        {flash}
      </Alert>

      <div className="card detail">
        <div className="detail-head">
          <span className="avatar avatar-lg">{initials(employee.name)}</span>
          <div>
            <h1>{employee.name}</h1>
            <span className="chip">{employee.department || "No department"}</span>
          </div>
        </div>

        <dl className="detail-grid">
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}
