package com.empmanagement.Controller;

import com.empmanagement.Entity.Employee;
import com.empmanagement.Service.EmployeeService;

import jakarta.validation.Valid;

import com.empmanagement.Response.ApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
//@CrossOrigin(origins = "*", allowedHeaders = "*") 
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    
    @PostMapping
    public ResponseEntity<ApiResponse<Employee>> createEmployee(
            @Valid @RequestBody Employee employee) { 

        Employee savedEmployee = employeeService.saveEmployee(employee);

        ApiResponse<Employee> response = new ApiResponse<>(
                true,
                "Employee created successfully",
                savedEmployee
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    @GetMapping
    public ResponseEntity<ApiResponse<Page<Employee>>> getAllEmployees(
            @RequestParam(defaultValue = "0") int page,          // Dynamic page index
            @RequestParam(defaultValue = "5") int size,          // ◄ CHANGE DEFAULT TO 5 (Matches your array start)
            @RequestParam(defaultValue = "id") String sortBy,     
            @RequestParam(defaultValue = "asc") String direction  
    ) {
        
        Page<Employee> employeePage = employeeService.getAllEmployeesPaginated(page, size, sortBy, direction);

        ApiResponse<Page<Employee>> response = new ApiResponse<>(
                true,
                "Employees retrieved successfully",
                employeePage
        );

        return ResponseEntity.ok(response);
    }


    // Get Employee By ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Employee>> getEmployeeById(
            @PathVariable Long id) {

        Employee employee = employeeService.getEmployeeById(id);

        if (employee == null) {
            ApiResponse<Employee> response = new ApiResponse<>(
                    false,
                    "Employee not found",
                    null
            );

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        ApiResponse<Employee> response = new ApiResponse<>(
                true,
                "Employee retrieved successfully",
                employee
        );

        return ResponseEntity.ok(response);
    }

   
    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<Employee>> getEmployeeByEmail(
            @PathVariable String email) {

        return employeeService.getEmployeeByEmail(email)
                .map(employee -> {
                    ApiResponse<Employee> response = new ApiResponse<>(
                            true,
                            "Employee retrieved successfully",
                            employee
                    );

                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    ApiResponse<Employee> response = new ApiResponse<>(
                            false,
                            "Employee not found",
                            null
                    );

                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(response);
                });
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Employee>> updateEmployee(
            @PathVariable Long id, 
            @Valid @RequestBody Employee employeeDetails) {
        
        Employee updatedEmployee = employeeService.updateEmployee(id, employeeDetails);
        
        if (updatedEmployee == null) {
            ApiResponse<Employee> response = new ApiResponse<>(
                    false,
                    "Employee not found with ID: " + id,
                    null
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        ApiResponse<Employee> response = new ApiResponse<>(
                true,
                "Employee updated successfully",
                updatedEmployee
        );
        return ResponseEntity.ok(response);
    }

}



//package com.empmanagement.Controller;
//
//import com.empmanagement.Entity.Employee;
//import com.empmanagement.Service.EmployeeService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;

//
//@RestController
//@RequestMapping("/api/employees")
//public class EmployeeController {
//
//    private final EmployeeService employeeService;
//
//    @Autowired
//    public EmployeeController(EmployeeService employeeService) {
//        this.employeeService = employeeService;
//    }
//
//    @PostMapping
//    public ResponseEntity<Employee> createEmployee(@RequestBody Employee employee) {
//        Employee savedEmployee = employeeService.saveEmployee(employee);
//        return ResponseEntity.ok(savedEmployee);
//    }
//
// 
//    @GetMapping
//    public ResponseEntity<List<Employee>> getAllEmployees() {
//        List<Employee> employees = employeeService.getAllEmployees();
//        return ResponseEntity.ok(employees);
//    }
//
//   
//    @GetMapping("/{id}")
//    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
//        Employee employee = employeeService.getEmployeeById(id);
//        if (employee == null) {
//            return ResponseEntity.notFound().build();
//        }
//        return ResponseEntity.ok(employee);
//    }
//
//    @GetMapping("/email/{email}")
//    public ResponseEntity<Employee> getEmployeeByEmail(
//            @PathVariable String email) {
//
//        return employeeService.getEmployeeByEmail(email)
//                .map(ResponseEntity::ok)
//                .orElseGet(() -> ResponseEntity.notFound().build());
//    }
//}
