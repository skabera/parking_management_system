package com.parking.parking_management_sys.controllers;
import org.springframework.http.HttpStatus;
import com.parking.parking_management_sys.dto.ParkVehicleDTO;
import com.parking.parking_management_sys.dto.ParkingSpotDTO;
import com.parking.parking_management_sys.services.ParkingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/parking")
public class ParkingController {

    @Autowired
    private ParkingService parkingService;

    @PostMapping("/spots")
    public ResponseEntity<ParkingSpotDTO> addParkingSpot(@RequestBody ParkingSpotDTO spotDTO) {
        return new ResponseEntity<>(parkingService.addParkingSpot(spotDTO), HttpStatus.CREATED);
    }

    @GetMapping("/spots")
    public ResponseEntity<List<ParkingSpotDTO>> getAllSpots() {
        return ResponseEntity.ok(parkingService.getAllSpots());
    }

    @GetMapping("/spots/available")
    public ResponseEntity<List<ParkingSpotDTO>> getAvailableSpots() {
        return ResponseEntity.ok(parkingService.getAvailableSpots());
    }

    @PostMapping("/park")
    public ResponseEntity<ParkingSpotDTO> parkVehicle(@RequestBody ParkVehicleDTO parkRequest) {
        try {
            return ResponseEntity.ok(parkingService.parkVehicle(parkRequest));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/release/{spotNumber}")
    public ResponseEntity<ParkingSpotDTO> releaseSpot(@PathVariable String spotNumber) {
        try {
            return ResponseEntity.ok(parkingService.releaseSpot(spotNumber));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/find/{licensePlate}")
    public ResponseEntity<ParkingSpotDTO> findVehicle(@PathVariable String licensePlate) {
        return parkingService.findVehicleLocation(licensePlate)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}