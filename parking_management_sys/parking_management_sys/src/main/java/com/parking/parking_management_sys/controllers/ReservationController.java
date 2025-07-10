package com.parking.parking_management_sys.controllers;

import com.parking.parking_management_sys.entities.Reservation;
import com.parking.parking_management_sys.services.ReservationService;
import com.parking.parking_management_sys.dto.ReservationDTO;
import com.parking.parking_management_sys.exceptions.ResourceNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;


    @GetMapping
    public ResponseEntity<List<Reservation>> getAllReservations() {
        return ResponseEntity.ok(reservationService.findAll());
    }


    @GetMapping("/{id}")
    public ResponseEntity<Reservation> getReservationById(@PathVariable Long id) {
        Reservation reservation = reservationService.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        return ResponseEntity.ok(reservation);
    }


    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody ReservationDTO reservationDTO) {
        Reservation savedReservation = reservationService.save(reservationDTO);
        return new ResponseEntity<>(savedReservation, HttpStatus.CREATED);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Reservation> updateReservation(
            @PathVariable Long id,
            @RequestBody ReservationDTO reservationDTO) {
        
        return ResponseEntity.ok(reservationService.update(id, reservationDTO));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteReservation(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.delete(id));
    }


    @GetMapping("/search")
    public ResponseEntity<List<Reservation>> findReservationsByDateRange(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") Date endDate) {
        
        return ResponseEntity.ok(reservationService.findByDateRange(startDate, endDate));
    }


    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<Reservation>> findReservationsByDriver(@PathVariable Long driverId) {
        return ResponseEntity.ok(reservationService.findByDriverId(driverId));
    }


    @GetMapping("/spot/{spotId}")
    public ResponseEntity<List<Reservation>> findReservationsByParkingSpot(@PathVariable Long spotId) {
        return ResponseEntity.ok(reservationService.findByParkingSpotId(spotId));
    }


    @GetMapping("/status/{status}")
    public ResponseEntity<List<Reservation>> findReservationsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(reservationService.findByStatus(status));
    }
    

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Reservation> cancelReservation(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.cancelReservation(id));
    }
    

    @PatchMapping("/{id}/complete")
    public ResponseEntity<Reservation> completeReservation(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.completeReservation(id));
    }
    

    @GetMapping("/availability/{spotId}")
    public ResponseEntity<Boolean> checkAvailability(
            @PathVariable Long spotId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") Date startTime,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") Date endTime) {
        
        return ResponseEntity.ok(reservationService.isParkingSpotAvailable(spotId, startTime, endTime));
    }
}