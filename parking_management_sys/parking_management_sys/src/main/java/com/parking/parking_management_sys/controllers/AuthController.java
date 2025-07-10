package com.parking.parking_management_sys.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.parking.parking_management_sys.dto.UserDTO;
import com.parking.parking_management_sys.entities.User.UserRole;
import com.parking.parking_management_sys.security.TokenProvider;
import com.parking.parking_management_sys.services.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Data;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication API")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;
    
    @Autowired
    private TokenProvider tokenProvider;

    @Operation(summary = "Login user", description = "Authenticates a user with username and password")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            UserDTO user = userService.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Generate token
            String token = tokenProvider.generateToken(user.getUsername(), user.getRole().toString());

            // Create response with token
            TokenAuthResponse response = new TokenAuthResponse();
            response.setUsername(user.getUsername());
            response.setRole(user.getRole());
            response.setToken(token);
            response.setMessage("Login successful");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Authentication failed: " + e.getMessage()));
        }
    }

    @Operation(summary = "Register new user", description = "Creates a new user account")
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegistrationRequest registrationRequest) {
        UserDTO newUser = new UserDTO();
        newUser.setUsername(registrationRequest.getUsername());
        newUser.setPassword(registrationRequest.getPassword());
        newUser.setRole(registrationRequest.getRole());

        UserDTO createdUser = userService.save(newUser);

        // Generate token for the new user
        String token = tokenProvider.generateToken(createdUser.getUsername(), createdUser.getRole().toString());

        TokenAuthResponse response = new TokenAuthResponse();
        response.setUsername(createdUser.getUsername());
        response.setRole(createdUser.getRole());
        response.setToken(token);
        response.setMessage("Registration successful");

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(summary = "Get user profile", description = "Returns the profile of the currently authenticated user")
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        // Get the current authentication
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.isAuthenticated() && 
            !"anonymousUser".equals(authentication.getPrincipal())) {
            
            // Safely get the username
            String username = authentication.getName();
            UserDTO user = userService.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            UserProfileResponse response = new UserProfileResponse();
            response.setId(user.getId());
            response.setUsername(user.getUsername());
            response.setRole(user.getRole());

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Not authenticated"));
        }
    }

    @Operation(summary = "Logout user", description = "Invalidates the user's token")
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        // Get token from request
        String token = getTokenFromRequest(request);
        
        if (token != null) {
            // Invalidate token
            tokenProvider.invalidateToken(token);
        }
        
        SecurityContextHolder.clearContext();
        
        return ResponseEntity.ok(new MessageResponse("Logout successful"));
    }
    
    private String getTokenFromRequest(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        
        return request.getParameter("token");
    }

    // DTO classes for requests and responses
    @Data
    static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    static class RegistrationRequest {
        private String username;
        private String password;
        private UserRole role;
    }

    @Data
    static class TokenAuthResponse {
        private String username;
        private UserRole role;
        private String token;
        private String message;
    }

    @Data
    static class UserProfileResponse {
        private Long id;
        private String username;
        private UserRole role;
    }

    @Data
    static class MessageResponse {
        private String message;

        public MessageResponse(String message) {
            this.message = message;
        }
    }
}