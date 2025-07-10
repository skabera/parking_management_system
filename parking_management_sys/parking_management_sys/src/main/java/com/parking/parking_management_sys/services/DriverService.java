package com.parking.parking_management_sys.services;

import com.parking.parking_management_sys.dto.DriverDTO;
import com.parking.parking_management_sys.entities.Driver;
import com.parking.parking_management_sys.exceptions.DuplicateLicensePlateException;
import com.parking.parking_management_sys.exceptions.ResourceNotFoundException;
import com.parking.parking_management_sys.repository.DriverRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service class for managing driver-related operations
 */
@Service
@Slf4j
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;
    
    /**
     * Register a new driver
     * 
     * @param driverDTO The driver information
     * @return The created driver entity
     * @throws DuplicateLicensePlateException if the license plate already exists
     */
    @Transactional
    public Driver registerDriver(DriverDTO driverDTO) {
        log.info("Registering new driver with license plate: {}", driverDTO.getLicensePlate());
        
        // Check if license plate already exists
        if (driverRepository.existsByLicensePlate(driverDTO.getLicensePlate())) {
            log.error("License plate already exists: {}", driverDTO.getLicensePlate());
            throw new DuplicateLicensePlateException("Driver with license plate already exists: " + driverDTO.getLicensePlate());
        }
        
        // Validate driver data
        validateDriverData(driverDTO);
        
        // Map DTO to entity
        Driver driver = new Driver();
        driver.setName(driverDTO.getName());
        driver.setLicensePlate(driverDTO.getLicensePlate().toUpperCase()); // Standardize license plate format
        driver.setPhoneNumber(driverDTO.getPhoneNumber());
        driver.setEmail(driverDTO.getEmail());
        driver.setActive(true);
        
        Driver savedDriver = driverRepository.save(driver);
        log.info("Driver registered successfully with ID: {}", savedDriver.getDriverId());
        
        return savedDriver;
    }
    
    /**
     * Get all drivers
     * 
     * @return List of all drivers as DTOs
     */
    @Transactional(readOnly = true)
    public List<DriverDTO> getAllDrivers() {
        log.info("Fetching all drivers");
        return driverRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Get driver by license plate
     * 
     * @param licensePlate The license plate to search for
     * @return Optional containing the driver if found
     */
    @Transactional(readOnly = true)
    public Optional<DriverDTO> getDriverByLicensePlate(String licensePlate) {
        log.info("Fetching driver by license plate: {}", licensePlate);
        return driverRepository.findByLicensePlate(licensePlate.toUpperCase())
                .map(this::convertToDTO);
    }
    
    /**
     * Get driver by ID
     * 
     * @param id The driver ID
     * @return Optional containing the driver if found
     */
    @Transactional(readOnly = true)
    public Optional<DriverDTO> getDriverById(Long id) {
        log.info("Fetching driver by ID: {}", id);
        return driverRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    /**
     * Update an existing driver
     * 
     * @param id The driver ID
     * @param driverDTO The updated driver information
     * @return The updated driver entity
     * @throws ResourceNotFoundException if the driver is not found
     * @throws DuplicateLicensePlateException if the new license plate already exists for another driver
     */
    @Transactional
    public Driver updateDriver(Long id, DriverDTO driverDTO) {
        log.info("Updating driver with ID: {}", id);
        
        Driver existingDriver = driverRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Driver not found with ID: {}", id);
                    return new ResourceNotFoundException("Driver not found with id: " + id);
                });
        
        // Check if the license plate is being changed and if it already exists
        if (!existingDriver.getLicensePlate().equalsIgnoreCase(driverDTO.getLicensePlate()) &&
                driverRepository.existsByLicensePlate(driverDTO.getLicensePlate())) {
            log.error("Cannot update driver. License plate already exists: {}", driverDTO.getLicensePlate());
            throw new DuplicateLicensePlateException("Driver with license plate already exists: " + driverDTO.getLicensePlate());
        }
        
        // Validate driver data
        validateDriverData(driverDTO);
        
        // Update driver properties
        existingDriver.setName(driverDTO.getName());
        existingDriver.setLicensePlate(driverDTO.getLicensePlate().toUpperCase());
        existingDriver.setPhoneNumber(driverDTO.getPhoneNumber());
        existingDriver.setEmail(driverDTO.getEmail());
        
        Driver updatedDriver = driverRepository.save(existingDriver);
        log.info("Driver updated successfully with ID: {}", updatedDriver.getDriverId());
        
        return updatedDriver;
    }
    
    /**
     * Delete a driver
     * 
     * @param id The driver ID to delete
     * @return Map with deletion status
     * @throws ResourceNotFoundException if the driver is not found
     */
    @Transactional
    public Map<String, Boolean> deleteDriver(Long id) {
        log.info("Deleting driver with ID: {}", id);
        
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Driver not found with ID: {}", id);
                    return new ResourceNotFoundException("Driver not found with id: " + id);
                });
        
        driverRepository.delete(driver);
        log.info("Driver deleted successfully with ID: {}", id);
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }
    
    /**
     * Search for drivers by name, license plate, phone number or email
     * 
     * @param query The search query
     * @return List of matching drivers
     */
    @Transactional(readOnly = true)
    public List<DriverDTO> searchDrivers(String query) {
        log.info("Searching drivers with query: {}", query);
        
        List<Driver> drivers;
        if (query != null && !query.trim().isEmpty()) {
            drivers = driverRepository.searchDrivers(query);
        } else {
            drivers = driverRepository.findAll();
        }
        
        return drivers.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Count active drivers
     * 
     * @return Count of active drivers
     */
    @Transactional(readOnly = true)
    public Long countActiveDrivers() {
        log.info("Counting active drivers");
        return driverRepository.countByActiveTrue();
    }
    
    /**
     * Set driver active/inactive status
     * 
     * @param id The driver ID
     * @param active The active status to set
     * @return The updated driver entity
     * @throws ResourceNotFoundException if the driver is not found
     */
    @Transactional
    public Driver setDriverActiveStatus(Long id, boolean active) {
        log.info("Setting driver {} active status to: {}", id, active);
        
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Driver not found with ID: {}", id);
                    return new ResourceNotFoundException("Driver not found with id: " + id);
                });
        
        driver.setActive(active);
        Driver updatedDriver = driverRepository.save(driver);
        log.info("Driver active status updated successfully for ID: {}", id);
        
        return updatedDriver;
    }
    
    /**
     * Convert Driver entity to DTO
     * 
     * @param driver The driver entity
     * @return The driver DTO
     */
    private DriverDTO convertToDTO(Driver driver) {
        DriverDTO dto = new DriverDTO();
        dto.setDriverId(driver.getDriverId());
        dto.setName(driver.getName());
        dto.setLicensePlate(driver.getLicensePlate());
        dto.setPhoneNumber(driver.getPhoneNumber());
        dto.setEmail(driver.getEmail());
        dto.setActive(driver.isActive());
        return dto;
    }
    
    /**
     * Validate driver data
     * 
     * @param driverDTO The driver DTO to validate
     * @throws IllegalArgumentException if validation fails
     */
    private void validateDriverData(DriverDTO driverDTO) {
        // Validate name
        if (!StringUtils.hasText(driverDTO.getName())) {
            throw new IllegalArgumentException("Driver name cannot be empty");
        }
        
        // Validate license plate
        if (!StringUtils.hasText(driverDTO.getLicensePlate())) {
            throw new IllegalArgumentException("License plate cannot be empty");
        }
        
        // Validate phone number (basic validation)
        if (!StringUtils.hasText(driverDTO.getPhoneNumber())) {
            throw new IllegalArgumentException("Phone number cannot be empty");
        }
        
        // Add more validation as needed
    }
}