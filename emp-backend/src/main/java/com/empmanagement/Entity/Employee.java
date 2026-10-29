package com.empmanagement.Entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "employees")
public class Employee {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String name;
	
	@Column(unique = true , nullable = false )
	private String email;
	
	private String department;
	
	@Positive(message = "Salary must be greater than zero")
	private BigDecimal salary;
	
	private LocalDate hireDate;
	
	public Employee() {
    }
	
	public Employee(String name, String email, String department, BigDecimal salary) {
		super();
		this.name = name;
		this.email = email;
		this.department = department;
		this.salary = salary;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public BigDecimal getSalary() {
		return salary;
	}

	public void setSalary(BigDecimal salary) {
		this.salary = salary;
	}
	
	
	public LocalDate getHireDate() {
	    return hireDate;
	}

	public void setHireDate(LocalDate hireDate) {
	    // If your table name mapping does not match exactly, 
	    // Hibernate automatically snake_cases 'hireDate' to 'hire_date'
	    this.hireDate = hireDate;
	}
	
	
}
