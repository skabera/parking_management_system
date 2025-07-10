package com.parking.parking_management_sys.entities;

import java.util.Date;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/**
 * Entity representing a driver in the system
 */
@Entity
@Table(name = "drivers", 
       uniqueConstraints = {
           @UniqueConstraint(columnNames = "license_plate", name = "uk_driver_license_plate")
       },
       indexes = {
           @Index(name = "idx_driver_license_plate", columnList = "license_plate"),
           @Index(name = "idx_driver_name", columnList = "name"),
           @Index(name = "idx_driver_active", columnList = "active")
       })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Driver {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "driver_id")
    private Long driverId;
    
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    
    @Column(name = "license_plate", nullable = false, length = 15)
    private String licensePlate;
    
    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;
    
    @Column(name = "email", length = 100)
    private String email;
    
    @Column(name = "active", nullable = false)
    private boolean active = true;
    
    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createdAt;
    
    @UpdateTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "updated_at", nullable = false)
    private Date updatedAt;
    
    @OneToMany(mappedBy = "driverId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Reservation> reservations;
    
    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Payment> payments;
    
    @Version
    @Column(name = "version")
    private Long version;
    
    // Additional methods can be added here if needed
    public String getFullDetails() {
        return String.format("%s (%s) - %s", name, licensePlate, phoneNumber);
    }
}