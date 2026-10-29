import { useState } from "react";
import { Link } from "react-router-dom";
import Alert from "./Alert.jsx";

const DEPARTMENT_SUGGESTIONS = [
  "Engineering",
  "Human Resources",
  "Finance",
  "Marketing",
  "Sales",
  "Operations",
  "IT Support",
  "Design",
];

// Your backend's PUT /api/employees/{id} does not copy hireDate onto the saved entity,
// so editing it in the UI would silently do nothing. After you add
//   existingEmployee.setHireDate(updatedEmployeeData.getHireDate());
// in EmployeeService.updateEmployee(), set this to true.
const HIRE_DATE_EDITABLE_ON_UPDATE = true;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY = { name: "", email: "", department: "", salary: "", hireDate: "" };

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Name is required.";
  if (!values.email.trim()) errors.email = "Email is required.";
  else if (!EMAIL_REGEX.test(values.email.trim())) errors.email = "Enter a valid email address.";
  if (!values.department.trim()) errors.department = "Department is required.";
  if (values.salary === "" || values.salary === null) errors.salary = "Salary is required.";
  else if (Number(values.salary) <= 0) errors.salary = "Salary must be greater than zero.";
  return errors;
}

export default function EmployeeForm({
  initialValues,
  onSubmit,
  submitLabel = "Save",
  submitting = false,
  serverError = "",
  isEdit = false,
  cancelTo = "/employees",
}) {
  const [values, setValues] = useState({ ...EMPTY, ...initialValues });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onSubmit({
      name: values.name.trim(),
      email: values.email.trim(),
      department: values.department.trim(),
      salary: Number(values.salary),
      hireDate: values.hireDate || null, // backend expects yyyy-MM-dd or null
    });
  };

  const hireDateLocked = isEdit && !HIRE_DATE_EDITABLE_ON_UPDATE;

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <Alert type="error">{serverError}</Alert>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" value={values.name} onChange={handleChange} placeholder="e.g. Priya Sharma" />
          {errors.name && <small className="field-error">{errors.name}</small>}
        </div>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            placeholder="name@company.com"
          />
          {errors.email && <small className="field-error">{errors.email}</small>}
        </div>

        <div className="field">
          <label htmlFor="department">Department</label>
          <input
            id="department"
            name="department"
            list="department-list"
            value={values.department}
            onChange={handleChange}
            placeholder="Pick or type a department"
          />
          <datalist id="department-list">
            {DEPARTMENT_SUGGESTIONS.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
          {errors.department && <small className="field-error">{errors.department}</small>}
        </div>

        <div className="field">
          <label htmlFor="salary">Salary (₹)</label>
          <input
            id="salary"
            name="salary"
            type="number"
            min="0"
            step="0.01"
            value={values.salary}
            onChange={handleChange}
            placeholder="e.g. 55000"
          />
          {errors.salary && <small className="field-error">{errors.salary}</small>}
        </div>

        <div className="field">
          <label htmlFor="hireDate">Hire date</label>
          <input
            id="hireDate"
            name="hireDate"
            type="date"
            value={values.hireDate}
            onChange={handleChange}
            disabled={hireDateLocked}
          />
          {hireDateLocked && (
            <small className="muted">Not editable yet: the update API doesn&apos;t save hire date.</small>
          )}
        </div>
      </div>

      <div className="form-actions">
        <Link to={cancelTo} className="btn btn-ghost">
          Cancel
        </Link>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
