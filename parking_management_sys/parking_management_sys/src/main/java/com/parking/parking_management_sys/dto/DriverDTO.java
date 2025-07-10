package com.parking.parking_management_sys.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for Driver information
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Driver information")
public class DriverDTO {
    
    @Schema(description = "Unique identifier of the driver", example = "1")
    private Long driverId;
    
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    @Schema(description = "Full name of the driver", example = "John Doe", required = true)
    private String name;
    
    @NotBlank(message = "License plate is required")
    @Pattern(regexp = "^[A-Z0-9- ]{2,15}$", message = "License plate format is invalid")
    @Schema(description = "Vehicle license plate number", example = "ABC123", required = true)
    private String licensePlate;
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[+]?[(]?[0-9]{1,4}[)]?[-\\s.]?[0-9]{1,3}[-\\s.]?[0-9]{1,4}[-\\s.]?[0-9]{1,4}$", 
             message = "Phone number format is invalid")
    @Schema(description = "Contact phone number", example = "+1-555-123-4567", required = true)
    private String phoneNumber;
    
    @Email(message = "Email format is invalid")
    @Schema(description = "Email address", example = "john.doe@example.com")
    private String email;
    
    @Schema(description = "Whether the driver is active in the system", example = "true", defaultValue = "true")
    private boolean active = true;
}