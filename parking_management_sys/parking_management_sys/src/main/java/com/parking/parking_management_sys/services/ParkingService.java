package com.parking.parking_management_sys.services;

import com.parking.parking_management_sys.dto.ParkVehicleDTO;
import com.parking.parking_management_sys.dto.ParkingSpotDTO;
import com.parking.parking_management_sys.entities.Driver;
import com.parking.parking_management_sys.entities.ParkingSpot;
import com.parking.parking_management_sys.repository.DriverRepository;
import com.parking.parking_management_sys.repository.ParkingSpotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ParkingService {

    @Autowired
    private ParkingSpotRepository parkingSpotRepository;

    @Autowired
    private DriverRepository driverRepository;

    public ParkingSpotDTO addParkingSpot(ParkingSpotDTO spotDTO) {
        ParkingSpot spot = new ParkingSpot();
        spot.setSpotNumber(spotDTO.getSpotNumber());
        spot.setStatus(ParkingSpot.SpotStatus.AVAILABLE);

        ParkingSpot savedSpot = parkingSpotRepository.save(spot);

        // spotDTO.setSpotId(savedSpot.getSpotId());
        spotDTO.setStatus(savedSpot.getStatus());
        return spotDTO;
    }

    public List<ParkingSpotDTO> getAllSpots() {
        return parkingSpotRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ParkingSpotDTO> getAvailableSpots() {
        return parkingSpotRepository.findByStatus(ParkingSpot.SpotStatus.AVAILABLE).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ParkingSpotDTO parkVehicle(ParkVehicleDTO parkRequest) {
        // Verify driver exists
        Optional<Driver> driver = driverRepository.findByLicensePlate(parkRequest.getLicensePlate());
        if (driver.isEmpty()) {
            throw new RuntimeException("Driver with license plate " + parkRequest.getLicensePlate() + " not found");
        }

        // Find the requested spot
        Optional<ParkingSpot> spotOpt = parkingSpotRepository.findBySpotNumber(parkRequest.getSpotNumber());
        if (spotOpt.isEmpty()) {
            throw new RuntimeException("Parking spot " + parkRequest.getSpotNumber() + " not found");
        }

        ParkingSpot spot = spotOpt.get();

        // Check if spot is available
        if (spot.getStatus() == ParkingSpot.SpotStatus.OCCUPIED) {
            throw new RuntimeException("Parking spot " + parkRequest.getSpotNumber() + " is already occupied");
        }

        // Park the vehicle
        spot.setStatus(ParkingSpot.SpotStatus.OCCUPIED);
        spot.setCurrentVehicle(parkRequest.getLicensePlate());

        ParkingSpot updatedSpot = parkingSpotRepository.save(spot);
        return convertToDTO(updatedSpot);
    }

    @Transactional
    public ParkingSpotDTO releaseSpot(String spotNumber) {
        Optional<ParkingSpot> spotOpt = parkingSpotRepository.findBySpotNumber(spotNumber);
        if (spotOpt.isEmpty()) {
            throw new RuntimeException("Parking spot " + spotNumber + " not found");
        }

        ParkingSpot spot = spotOpt.get();

        // Check if spot is occupied
        if (spot.getStatus() == ParkingSpot.SpotStatus.AVAILABLE) {
            throw new RuntimeException("Parking spot " + spotNumber + " is already available");
        }

        // Release the spot
        spot.setStatus(ParkingSpot.SpotStatus.AVAILABLE);
        spot.setCurrentVehicle(null);

        ParkingSpot updatedSpot = parkingSpotRepository.save(spot);
        return convertToDTO(updatedSpot);
    }

    public Optional<ParkingSpotDTO> findVehicleLocation(String licensePlate) {
        return parkingSpotRepository.findByCurrentVehicle(licensePlate)
                .map(this::convertToDTO);
    }

    private ParkingSpotDTO convertToDTO(ParkingSpot spot) {
        ParkingSpotDTO dto = new ParkingSpotDTO();
        // dto.setSpotId(spot.getSpotId());
        dto.setSpotNumber(spot.getSpotNumber());
        dto.setStatus(spot.getStatus());
        dto.setCurrentVehicle(spot.getCurrentVehicle());
        return dto;
    }
}