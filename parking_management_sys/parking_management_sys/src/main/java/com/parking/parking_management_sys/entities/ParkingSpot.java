package com.parking.parking_management_sys.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "parking_spots")
@Data
public class ParkingSpot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long spotId;

    @Column(unique = true, nullable = false)
    private String spotNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SpotStatus status = SpotStatus.AVAILABLE;

    @Column
    private String currentVehicle;

    @Column
    private String location;

   // In ParkingSpot entity
@OneToMany(mappedBy = "spot")
@JsonManagedReference
private List<Reservation> reservations;

    public enum SpotStatus {
        AVAILABLE,
        OCCUPIED
    }
}