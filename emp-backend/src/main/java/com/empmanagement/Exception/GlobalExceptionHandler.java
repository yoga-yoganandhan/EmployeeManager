package com.empmanagement.Exception;

import com.empmanagement.Response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // This method catches any RuntimeException thrown anywhere in our application
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Void>> handleRuntimeException(RuntimeException ex) {
        
        // Wrap the error message inside your existing ApiResponse structure!
        ApiResponse<Void> response = new ApiResponse<>(
                false,
                ex.getMessage(), // This will grab "Error: An employee with this email already exists!"
                null
        );

        // Return a clean 400 Bad Request status code
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
 // Add this method inside your GlobalExceptionHandler class:
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException ex) {
        
        // Get the error message we wrote in the Entity ("Salary must be greater than zero")
        String errorMessage = ex.getBindingResult().getFieldError().getDefaultMessage();
        
        ApiResponse<Void> response = new ApiResponse<>(
                false,
                errorMessage,
                null
        );
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
