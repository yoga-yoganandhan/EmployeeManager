import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEmployeeById, updateEmployee } from "../api/employeeApi.js";
import { getErrorMessage } from "../api/axiosClient.js";
import EmployeeForm from "../components/EmployeeForm.jsx";
import Alert from "../components/Alert.jsx";
import Loader from "../components/Loader.jsx";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getEmployeeById(id)
      .then((data) => !cancelled && setEmployee(data))
      .catch((err) => !cancelled && setLoadError(getErrorMessage(err)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setServerError("");
    try {
      const res = await updateEmployee(id, payload);
      navigate(`/employees/${id}`, { state: { message: res.message || "Employee updated successfully" } });
    } catch (err) {
      setServerError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  if (loading) return <Loader text="Loading employee..." />;
  if (loadError) return <Alert type="error">{loadError}</Alert>;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Edit employee</h1>
          <p className="muted">Update details for {employee.name}.</p>
        </div>
      </div>
      <EmployeeForm
        isEdit
        initialValues={{
          name: employee.name ?? "",
          email: employee.email ?? "",
          department: employee.department ?? "",
          salary: employee.salary ?? "",
          hireDate: employee.hireDate ?? "",
        }}
        onSubmit={handleSubmit}
        submitting={submitting}
        serverError={serverError}
        submitLabel="Save changes"
        cancelTo={`/employees/${id}`}
      />
    </>
  );
}
