package com.parking.parking_management_sys.controllers;

import com.parking.parking_management_sys.dto.DriverDTO;
import com.parking.parking_management_sys.entities.Driver;
import com.parking.parking_management_sys.services.DriverService;
import com.parking.parking_management_sys.exceptions.ResourceNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;
import java.util.Map;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/drivers")
@Tag(name = "Driver Controller", description = "Operations pertaining to drivers in the Parking Management System")
@Validated
public class DriverController {

    @Autowired
    private DriverService driverService;

    @Operation(summary = "Register a new driver", description = "Creates a new driver record in the system")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Driver successfully registered", 
                content = @Content(schema = @Schema(implementation = Driver.class))),
        @ApiResponse(responseCode = "400", description = "Invalid driver information provided", 
                content = @Content),
        @ApiResponse(responseCode = "409", description = "Driver with this license plate already exists", 
                content = @Content)
    })
    @PostMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<Driver> registerDriver(
            @Parameter(description = "Driver information for registration", required = true)
            @Valid @RequestBody DriverDTO driverDTO) {
        return new ResponseEntity<>(driverService.registerDriver(driverDTO), HttpStatus.CREATED);
    }

    @Operation(summary = "Get all drivers", description = "Returns a list of all registered drivers")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved the list of drivers", 
            content = @Content(schema = @Schema(implementation = DriverDTO.class)))
    @GetMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<DriverDTO>> getAllDrivers() {
        return ResponseEntity.ok(driverService.getAllDrivers());
    }

    @Operation(summary = "Get driver by license plate", description = "Returns a driver based on the license plate")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Driver found", 
                content = @Content(schema = @Schema(implementation = DriverDTO.class))),
        @ApiResponse(responseCode = "404", description = "Driver not found with the given license plate", 
                content = @Content)
    })
    @GetMapping("/license/{licensePlate}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<DriverDTO> getDriverByLicensePlate(
            @Parameter(description = "License plate of the driver to retrieve", required = true)
            @PathVariable @NotBlank String licensePlate) {
        return driverService.getDriverByLicensePlate(licensePlate)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with license plate: " + licensePlate));
    }

    @Operation(summary = "Get driver by ID", description = "Returns a driver based on the ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Driver found", 
                content = @Content(schema = @Schema(implementation = DriverDTO.class))),
        @ApiResponse(responseCode = "404", description = "Driver not found with the given ID", 
                content = @Content)
    })
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<DriverDTO> getDriverById(
            @Parameter(description = "ID of the driver to retrieve", required = true)
            @PathVariable Long id) {
        return driverService.getDriverById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + id));
    }

    @Operation(summary = "Update driver", description = "Updates an existing driver's information")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Driver successfully updated",
                content = @Content(schema = @Schema(implementation = Driver.class))),
        @ApiResponse(responseCode = "400", description = "Invalid driver information provided",
                content = @Content),
        @ApiResponse(responseCode = "404", description = "Driver not found with the given ID",
                content = @Content)
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<Driver> updateDriver(
            @Parameter(description = "ID of the driver to update", required = true)
            @PathVariable Long id,
            @Parameter(description = "Updated driver information", required = true)
            @Valid @RequestBody DriverDTO driverDTO) {
        return ResponseEntity.ok(driverService.updateDriver(id, driverDTO));
    }

    @Operation(summary = "Delete driver", description = "Deletes a driver based on the ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Driver successfully deleted",
                content = @Content),
        @ApiResponse(responseCode = "404", description = "Driver not found with the given ID",
                content = @Content)
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Boolean>> deleteDriver(
            @Parameter(description = "ID of the driver to delete", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(driverService.deleteDriver(id));
    }

    @Operation(summary = "Search drivers", description = "Search for drivers by name or contact information")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved matching drivers",
            content = @Content(schema = @Schema(implementation = DriverDTO.class)))
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<DriverDTO>> searchDrivers(
            @Parameter(description = "Search term for driver name or contact info")
            @RequestParam(required = false) String query) {
        return ResponseEntity.ok(driverService.searchDrivers(query));
    }

    @Operation(summary = "Count active drivers", description = "Returns the count of active drivers")
    @ApiResponse(responseCode = "200", description = "Successfully retrieved count",
            content = @Content(schema = @Schema(implementation = Long.class)))
    @GetMapping("/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> countActiveDrivers() {
        return ResponseEntity.ok(driverService.countActiveDrivers());
    }
}