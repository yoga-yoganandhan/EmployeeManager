# Employee Management: React (Vite) frontend

Frontend for the Spring Boot `com.empmanagement` backend (`/api/employees`).

## Run it

1. Start the Spring Boot backend (default `http://localhost:8080`).
2. In this folder:

   ```bash
   npm install
   npm run dev
   ```

3. Open http://localhost:5173 and sign in with your Spring Security credentials
   (default user is `user`, password is printed in the backend console at startup,
   unless you set `spring.security.user.name/password`).

Backend URL is set in `.env` (`VITE_API_URL`).

## Structure

```
src/
  main.jsx                 entry: Router + AuthProvider
  App.jsx                  route table
  index.css                all styles
  api/
    axiosClient.js         axios instance, Basic-auth header, 401 handling, error helper
    employeeApi.js         one function per backend endpoint
  context/AuthContext.jsx  login / logout state (sessionStorage)
  components/              Navbar, Layout, ProtectedRoute, EmployeeForm, Pagination, Alert, Loader
  pages/                   Login, Dashboard, EmployeeList, EmployeeDetail, AddEmployee, EditEmployee, NotFound
  utils/format.js          currency / date helpers
```

## Backend endpoints used

| UI action              | Endpoint                                   |
|------------------------|--------------------------------------------|
| List / sort / paginate | `GET /api/employees?page&size&sortBy&direction` |
| View one               | `GET /api/employees/{id}`                  |
| Search by email        | `GET /api/employees/email/{email}`         |
| Add                    | `POST /api/employees`                      |
| Edit                   | `PUT /api/employees/{id}`                  |

## Known backend gaps (small fixes on the Java side)

- **No DELETE endpoint.** Add `@DeleteMapping("/{id}")` and a Delete button can be wired in.
- **`updateEmployee` ignores `hireDate`.** Add `existingEmployee.setHireDate(updatedEmployeeData.getHireDate());`
  in `EmployeeService`, then set `HIRE_DATE_EDITABLE_ON_UPDATE = true` in `components/EmployeeForm.jsx`.
- **CORS** currently allows every origin (`*`), which is fine for development. Restrict it to
  `http://localhost:5173` before deploying.
