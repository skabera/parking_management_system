package com.parking.parking_management_sys.repository;

import com.parking.parking_management_sys.entities.ParkingSpot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, Long> {
    List<ParkingSpot> findByStatus(ParkingSpot.SpotStatus status);
    Optional<ParkingSpot> findBySpotNumber(String spotNumber);
    Optional<ParkingSpot> findByCurrentVehicle(String licensePlate);
}