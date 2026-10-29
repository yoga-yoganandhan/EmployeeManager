package com.empmanagement.Service;

import com.empmanagement.Entity.Employee;
import com.empmanagement.Repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;


@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    // Save a new employee (with existsByEmail check)
    public Employee saveEmployee(Employee employee) {
        if (employeeRepository.existsByEmail(employee.getEmail())) {
            throw new RuntimeException(
                "Error: An employee with this email already exists!"
            );
        }

        return employeeRepository.save(employee);
    }

    // Get all employees
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // Get employee by ID
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id).orElse(null);
    }

    // Find employee by email in Optional
    public Optional<Employee> getEmployeeByEmail(String email) {
        return employeeRepository.findByEmail(email);
    }
    
    // Update an existing employee
    public Employee updateEmployee(Long id, Employee updatedEmployeeData) {
        // Find the existing employee first
        Employee existingEmployee = employeeRepository.findById(id).orElse(null);
        
        if (existingEmployee == null) {
            return null; // Employee not found
        }
        
        // Check if the new email is already taken by a DIFFERENT employee
        if (!existingEmployee.getEmail().equals(updatedEmployeeData.getEmail()) && 
            employeeRepository.existsByEmail(updatedEmployeeData.getEmail())) {
            throw new RuntimeException("Error: An employee with this email already exists!");
        }

        // Update the fields
        existingEmployee.setName(updatedEmployeeData.getName());
        existingEmployee.setEmail(updatedEmployeeData.getEmail());
        existingEmployee.setDepartment(updatedEmployeeData.getDepartment());
        existingEmployee.setSalary(updatedEmployeeData.getSalary());
        existingEmployee.setHireDate(updatedEmployeeData.getHireDate());

        // Save the updated entity back to the database
        return employeeRepository.save(existingEmployee);
    }

    public Page<Employee> getAllEmployeesPaginated(int page, int size, String sortBy, String direction) {
        // 1. Create sorting rules (Ascending or Descending)
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        // 2. Create the pageable configuration containing page number, chunk size, and sorting
        Pageable pageable = PageRequest.of(page, size, sort);
        
        // 3. Pass it to the repository to fetch ONLY that specific slice of data
        return employeeRepository.findAll(pageable);
    }
}
