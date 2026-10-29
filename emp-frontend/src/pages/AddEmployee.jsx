import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEmployee } from "../api/employeeApi.js";
import { getErrorMessage } from "../api/axiosClient.js";
import EmployeeForm from "../components/EmployeeForm.jsx";

export default function AddEmployee() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setServerError("");
    try {
      const res = await createEmployee(payload);
      navigate("/employees", { state: { message: res.message || "Employee created successfully" } });
    } catch (err) {
      // e.g. "Error: An employee with this email already exists!"
      setServerError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Add employee</h1>
          <p className="muted">Create a new employee record.</p>
        </div>
      </div>
      <EmployeeForm
        onSubmit={handleSubmit}
        submitting={submitting}
        serverError={serverError}
        submitLabel="Create employee"
      />
    </>
  );
}
