package com.parking.parking_management_sys.dto;

import com.parking.parking_management_sys.entities.User.UserRole;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String password;
    private UserRole role;
}

// Login Request DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
class LoginRequest {
    private String username;
    private String password;
}

// Registration Request DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
class RegistrationRequest {
    private String username;
    private String password;
    private UserRole role;
}

// Response DTO with user details (without password)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
class UserResponse {
    private Long id;
    private String username;
    private UserRole role;
}