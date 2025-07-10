package com.parking.parking_management_sys.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exception thrown when attempting to create a driver with a license plate
 * that already exists in the system
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class DuplicateLicensePlateException extends RuntimeException {
    
    private static final long serialVersionUID = 1L;
    
    public DuplicateLicensePlateException(String message) {
        super(message);
    }
}