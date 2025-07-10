package com.parking.parking_management_sys.repository;

import com.parking.parking_management_sys.entities.Driver;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Driver entity operations
 */
@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    
    /**
     * Find a driver by license plate
     * 
     * @param licensePlate The license plate to search for
     * @return Optional containing the driver if found
     */
    Optional<Driver> findByLicensePlate(String licensePlate);
    
    /**
     * Check if a driver exists with the given license plate
     * 
     * @param licensePlate The license plate to check
     * @return true if a driver exists with this license plate
     */
    boolean existsByLicensePlate(String licensePlate);
    
    /**
     * Count active drivers
     * 
     * @return Count of active drivers
     */
    long countByActiveTrue();
    
    /**
     * Search for drivers by various fields
     * 
     * @param query The search query
     * @return List of matching drivers
     */
    @Query("SELECT d FROM Driver d WHERE " +
           "LOWER(d.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.licensePlate) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.phoneNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "(d.email IS NOT NULL AND LOWER(d.email) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Driver> searchDrivers(@Param("query") String query);
    
    /**
     * Find active drivers
     * 
     * @return List of active drivers
     */
    List<Driver> findByActiveTrue();
    
    /**
     * Find inactive drivers
     * 
     * @return List of inactive drivers
     */
    List<Driver> findByActiveFalse();
    
    /**
     * Find drivers created after a certain date
     * 
     * @param date The date to compare against
     * @return List of drivers created after the specified date
     */
    @Query("SELECT d FROM Driver d WHERE d.createdAt >= :date")
    List<Driver> findByCreatedAtAfter(@Param("date") Date date);
    
    /**
     * Count reservations for each driver
     * Properly structured to return driver IDs with their counts
     */
    @Query("SELECT d.driverId, COUNT(r.id) FROM Driver d LEFT JOIN Reservation r ON r.driverId = d WHERE d.active = true GROUP BY d.driverId")
    List<Object[]> countReservationsByDriver();
}