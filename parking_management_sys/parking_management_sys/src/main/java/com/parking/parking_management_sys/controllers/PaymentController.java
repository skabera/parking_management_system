package com.parking.parking_management_sys.controllers;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.parking.parking_management_sys.dto.PaymentDTO;
import com.parking.parking_management_sys.entities.Payment;
import com.parking.parking_management_sys.entities.Payment.PaymentMethod;
import com.parking.parking_management_sys.entities.Payment.PaymentStatus;
import com.parking.parking_management_sys.exceptions.ResourceNotFoundException;
import com.parking.parking_management_sys.services.PaymentService;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.findAll());
    }


    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        Payment payment = paymentService.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        return ResponseEntity.ok(payment);
    }


    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody PaymentDTO paymentDTO) {
        Payment savedPayment = paymentService.save(paymentDTO);
        return new ResponseEntity<>(savedPayment, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Payment> updatePayment(
            @PathVariable Long id,
            @RequestBody PaymentDTO paymentDTO) {
        
        return ResponseEntity.ok(paymentService.update(id, paymentDTO));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deletePayment(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.delete(id));
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<Payment>> findPaymentsByDriver(@PathVariable Long driverId) {
        return ResponseEntity.ok(paymentService.findByDriver(driverId));
    }


    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<List<Payment>> findPaymentsByReservation(@PathVariable Long reservationId) {
        return ResponseEntity.ok(paymentService.findByReservation(reservationId));
    }


    @GetMapping("/status/{status}")
    public ResponseEntity<List<Payment>> findPaymentsByStatus(@PathVariable PaymentStatus status) {
        return ResponseEntity.ok(paymentService.findByStatus(status));
    }


    @GetMapping("/method/{method}")
    public ResponseEntity<List<Payment>> findPaymentsByMethod(@PathVariable PaymentMethod method) {
        return ResponseEntity.ok(paymentService.findByPaymentMethod(method));
    }


    @GetMapping("/date-range")
    public ResponseEntity<List<Payment>> findPaymentsByDateRange(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") Date endDate) {
        
        return ResponseEntity.ok(paymentService.findByDateRange(startDate, endDate));
    }


    @PatchMapping("/{id}/process")
    public ResponseEntity<Payment> processPayment(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.processPayment(id));
    }


    @PatchMapping("/{id}/refund")
    public ResponseEntity<Payment> refundPayment(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.refundPayment(id));
    }


    @GetMapping("/total")
    public ResponseEntity<Double> getTotalPayments(
            @RequestParam PaymentStatus status,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") Date endDate) {
        
        return ResponseEntity.ok(paymentService.calculateTotalByStatusAndDateRange(status, startDate, endDate));
    }


    @GetMapping("/count/driver/{driverId}/status/{status}")
    public ResponseEntity<Long> countPaymentsByDriverAndStatus(
            @PathVariable Long driverId,
            @PathVariable PaymentStatus status) {
        
        return ResponseEntity.ok(paymentService.countByDriverAndStatus(driverId, status));
    }
}