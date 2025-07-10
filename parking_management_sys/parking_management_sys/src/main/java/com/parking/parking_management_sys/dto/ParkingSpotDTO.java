package com.parking.parking_management_sys.dto;

import com.parking.parking_management_sys.entities.ParkingSpot;
import lombok.Data;

@Data
public class ParkingSpotDTO {
    // private Long spotId;
    private String spotNumber;
    private ParkingSpot.SpotStatus status;
    private String currentVehicle;
    private String location;
}