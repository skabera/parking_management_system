package com.parking.parking_management_sys.repository;

import com.parking.parking_management_sys.entities.Reservation;
import com.parking.parking_management_sys.entities.ParkingSpot;
import com.parking.parking_management_sys.entities.Driver;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    
    List<Reservation> findByDriverId(Driver driver);
    
    List<Reservation> findBySpot(ParkingSpot parkingSpot);
    
    List<Reservation> findByStatus(String status);
    
    List<Reservation> findByStartTimeBetween(Date startDate, Date endDate);
    
    @Query("SELECT r FROM Reservation r WHERE r.spot = :parkingSpot AND " +
       "((r.startTime <= :endTime AND r.endTime >= :startTime))")
List<Reservation> findOverlappingReservations(
    @Param("parkingSpot") ParkingSpot parkingSpot,
    @Param("startTime") Date startTime,
    @Param("endTime") Date endTime);
}