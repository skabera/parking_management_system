package com.parking.parking_management_sys.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.parking.parking_management_sys.entities.User;
import com.parking.parking_management_sys.entities.User.UserRole;
import com.parking.parking_management_sys.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Create default admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setRole(UserRole.ADMIN);
            userRepository.save(adminUser);
            System.out.println("Default admin user created");
        }
        
        // Create default staff user if not exists
        if (!userRepository.existsByUsername("staff")) {
            User staffUser = new User();
            staffUser.setUsername("staff");
            staffUser.setPassword(passwordEncoder.encode("staff123"));
            staffUser.setRole(UserRole.STAFF);
            userRepository.save(staffUser);
            System.out.println("Default staff user created");
        }
    }
}