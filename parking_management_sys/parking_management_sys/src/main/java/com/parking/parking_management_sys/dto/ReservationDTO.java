package com.parking.parking_management_sys.dto;

import java.util.Date;

import com.parking.parking_management_sys.entities.Reservation.ReservationStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDTO {
    // private Long id;
    private Date startTime;
    private Date endTime;
    private ReservationStatus status;
    private Long spotId;
    private Long driverId;
}