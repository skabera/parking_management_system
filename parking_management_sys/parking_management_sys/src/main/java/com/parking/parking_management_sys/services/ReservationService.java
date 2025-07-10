package com.parking.parking_management_sys.services;

import com.parking.parking_management_sys.entities.Reservation;
import com.parking.parking_management_sys.entities.Reservation.ReservationStatus;
import com.parking.parking_management_sys.entities.ParkingSpot;
import com.parking.parking_management_sys.entities.Driver;
import com.parking.parking_management_sys.repository.ReservationRepository;
import com.parking.parking_management_sys.repository.ParkingSpotRepository;
import com.parking.parking_management_sys.repository.DriverRepository;
import com.parking.parking_management_sys.dto.ReservationDTO;
import com.parking.parking_management_sys.exceptions.ResourceNotFoundException;
import com.parking.parking_management_sys.exceptions.InvalidReservationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;
    
    @Autowired
    private ParkingSpotRepository parkingSpotRepository;
    
    @Autowired
    private DriverRepository driverRepository;
    
    // Find all reservations
    public List<Reservation> findAll() {
        return reservationRepository.findAll();
    }
    
    // Find reservation by ID
    public Optional<Reservation> findById(Long id) {
        return reservationRepository.findById(id);
    }
    
    // Create new reservation
    @Transactional
    public Reservation save(ReservationDTO reservationDTO) {
        // Validate reservation dates
        validateReservationDates(reservationDTO.getStartTime(), reservationDTO.getEndTime());
        
        // Get ParkingSpot and Driver entities
        ParkingSpot parkingSpot = parkingSpotRepository.findById(reservationDTO.getSpotId())
            .orElseThrow(() -> new ResourceNotFoundException("ParkingSpot not found with id: " + reservationDTO.getSpotId()));
        
        Driver driver = driverRepository.findById(reservationDTO.getDriverId())
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + reservationDTO.getDriverId()));
        
        // Check if parking spot is available for the requested time
        if (!isParkingSpotAvailable(parkingSpot.getSpotId(), reservationDTO.getStartTime(), reservationDTO.getEndTime())) {
            throw new InvalidReservationException("Parking spot is not available for the requested time period");
        }
        
        // Create and save the reservation
        Reservation reservation = new Reservation();
        reservation.setStartTime(reservationDTO.getStartTime());
        reservation.setEndTime(reservationDTO.getEndTime());
        reservation.setStatus(ReservationStatus.PENDING);
        reservation.setSpot(parkingSpot);
        reservation.setDriverId(driver);
        
        return reservationRepository.save(reservation);
    }
    
    // Update reservation
    @Transactional
    public Reservation update(Long id, ReservationDTO reservationDTO) {
        Reservation existingReservation = reservationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        
        // Validate reservation dates
        validateReservationDates(reservationDTO.getStartTime(), reservationDTO.getEndTime());
        
        // Get ParkingSpot and Driver entities
        ParkingSpot parkingSpot = parkingSpotRepository.findById(reservationDTO.getSpotId())
            .orElseThrow(() -> new ResourceNotFoundException("ParkingSpot not found with id: " + reservationDTO.getSpotId()));
        
        Driver driver = driverRepository.findById(reservationDTO.getDriverId())
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + reservationDTO.getDriverId()));
        
        // Check if parking spot is available for the requested time (excluding current reservation)
        if (!isParkingSpotAvailableForUpdate(id, parkingSpot.getSpotId(), reservationDTO.getStartTime(), reservationDTO.getEndTime())) {
            throw new InvalidReservationException("Parking spot is not available for the requested time period");
        }
        
        // Update reservation
        existingReservation.setStartTime(reservationDTO.getStartTime());
        existingReservation.setEndTime(reservationDTO.getEndTime());
        existingReservation.setSpot(parkingSpot);
        existingReservation.setDriverId(driver);
        
        return reservationRepository.save(existingReservation);
    }
    
    // Delete reservation
    @Transactional
    public Map<String, Boolean> delete(Long id) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        
        reservationRepository.delete(reservation);
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }
    
    // Find reservations by date range
    public List<Reservation> findByDateRange(Date startDate, Date endDate) {
        return reservationRepository.findByStartTimeBetween(startDate, endDate);
    }
    
    // Find reservations by driver ID
    public List<Reservation> findByDriverId(Long driverId) {
        Driver driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + driverId));
        
        return reservationRepository.findByDriverId(driver);
    }
    
    // Find reservations by parking spot ID
    public List<Reservation> findByParkingSpotId(Long spotId) {
        ParkingSpot parkingSpot = parkingSpotRepository.findById(spotId)
            .orElseThrow(() -> new ResourceNotFoundException("ParkingSpot not found with id: " + spotId));
        
        return reservationRepository.findBySpot(parkingSpot);
    }
    
    // Find reservations by status
    public List<Reservation> findByStatus(String status) {
        return reservationRepository.findByStatus(status);
    }
    
    // Cancel reservation
    @Transactional
    public Reservation cancelReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        
        // Check if reservation can be canceled
        if ("COMPLETED".equals(reservation.getStatus())) {
            throw new InvalidReservationException("Cannot cancel a completed reservation");
        }
        
        reservation.setStatus(ReservationStatus.CANCELLED);
        return reservationRepository.save(reservation);
    }
    
    // Complete reservation
    @Transactional
    public Reservation completeReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        
        // Check if reservation can be completed
        if ("CANCELLED".equals(reservation.getStatus())) {
            throw new InvalidReservationException("Cannot complete a cancelled reservation");
        }
        
        reservation.setStatus(ReservationStatus.COMPLETED);
        return reservationRepository.save(reservation);
    }
    
    // Check if parking spot is available for the given time period
    public boolean isParkingSpotAvailable(Long spotId, Date startTime, Date endTime) {
        ParkingSpot parkingSpot = parkingSpotRepository.findById(spotId)
            .orElseThrow(() -> new ResourceNotFoundException("ParkingSpot not found with id: " + spotId));
        
        // Get overlapping reservations
        List<Reservation> overlappingReservations = reservationRepository.findOverlappingReservations(
            parkingSpot, startTime, endTime);
        
        // Exclude canceled reservations
        overlappingReservations = overlappingReservations.stream()
            .filter(r -> !"CANCELLED".equals(r.getStatus()))
            .toList();
        
        return overlappingReservations.isEmpty();
    }
    
    // Check if parking spot is available for updating a reservation
    private boolean isParkingSpotAvailableForUpdate(Long reservationId, Long spotId, Date startTime, Date endTime) {
        ParkingSpot parkingSpot = parkingSpotRepository.findById(spotId)
            .orElseThrow(() -> new ResourceNotFoundException("ParkingSpot not found with id: " + spotId));
        
        // Get overlapping reservations
        List<Reservation> overlappingReservations = reservationRepository.findOverlappingReservations(
            parkingSpot, startTime, endTime);
        
        // Exclude canceled reservations and the current reservation being updated
        overlappingReservations = overlappingReservations.stream()
            .filter(r -> !"CANCELLED".equals(r.getStatus()) && !r.getId().equals(reservationId))
            .toList();
        
        return overlappingReservations.isEmpty();
    }
    
    // Validate reservation dates
    private void validateReservationDates(Date startTime, Date endTime) {
        if (startTime == null || endTime == null) {
            throw new InvalidReservationException("Start time and end time cannot be null");
        }
        
        if (startTime.after(endTime)) {
            throw new InvalidReservationException("Start time cannot be after end time");
        }
        
        if (startTime.before(new Date())) {
            throw new InvalidReservationException("Cannot create reservations in the past");
        }
    }
}