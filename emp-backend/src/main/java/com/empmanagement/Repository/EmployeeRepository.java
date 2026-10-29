package com.empmanagement.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.empmanagement.Entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
	
    // find employee by unique email
    Optional<Employee> findByEmail(String email);
    
    // check email is already exist in database
    boolean existsByEmail(String email);

}
