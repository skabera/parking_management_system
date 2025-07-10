package com.parking.parking_management_sys.services;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.parking.parking_management_sys.dto.PaymentDTO;
import com.parking.parking_management_sys.entities.Driver;
import com.parking.parking_management_sys.entities.Payment;
import com.parking.parking_management_sys.entities.Payment.PaymentMethod;
import com.parking.parking_management_sys.entities.Payment.PaymentStatus;
import com.parking.parking_management_sys.entities.Reservation;
import com.parking.parking_management_sys.exceptions.InvalidPaymentException;
import com.parking.parking_management_sys.exceptions.ResourceNotFoundException;
import com.parking.parking_management_sys.repository.DriverRepository;
import com.parking.parking_management_sys.repository.PaymentRepository;
import com.parking.parking_management_sys.repository.ReservationRepository;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private DriverRepository driverRepository;
    
    @Autowired
    private ReservationRepository reservationRepository;
    
    // Find all payments
    public List<Payment> findAll() {
        return paymentRepository.findAll();
    }
    
    // Find payment by ID
    public Optional<Payment> findById(Long id) {
        return paymentRepository.findById(id);
    }
    
    // Save new payment
    @Transactional
    public Payment save(PaymentDTO paymentDTO) {
        // Get driver entity
        Driver driver = driverRepository.findById(paymentDTO.getDriverId())
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + paymentDTO.getDriverId()));
        
        // Get reservation entity if provided
        Reservation reservation = null;
        if (paymentDTO.getReservationId() != null) {
            reservation = reservationRepository.findById(paymentDTO.getReservationId())
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + paymentDTO.getReservationId()));
        }
        
        // Validate payment
        validatePayment(paymentDTO);
        
        // Create payment entity
        Payment payment = new Payment();
        payment.setAmount(paymentDTO.getAmount());
        payment.setPaymentDate(paymentDTO.getPaymentDate() != null ? paymentDTO.getPaymentDate() : new Date());
        payment.setPaymentMethod(paymentDTO.getPaymentMethod());
        payment.setStatus(paymentDTO.getStatus() != null ? paymentDTO.getStatus() : PaymentStatus.PENDING);
        payment.setDriver(driver);
        payment.setReservation(reservation);
        
        // Generate transaction ID if not provided
        payment.setTransactionId(paymentDTO.getTransactionId() != null ? 
                paymentDTO.getTransactionId() : generateTransactionId());
        
        return paymentRepository.save(payment);
    }
    
    // Update payment
    @Transactional
    public Payment update(Long id, PaymentDTO paymentDTO) {
        Payment existingPayment = paymentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        
        // Update fields only if they are provided in the DTO
        if (paymentDTO.getAmount() != null) {
            existingPayment.setAmount(paymentDTO.getAmount());
        }
        
        if (paymentDTO.getPaymentMethod() != null) {
            existingPayment.setPaymentMethod(paymentDTO.getPaymentMethod());
        }
        
        if (paymentDTO.getStatus() != null) {
            existingPayment.setStatus(paymentDTO.getStatus());
        }
        
        if (paymentDTO.getTransactionId() != null) {
            existingPayment.setTransactionId(paymentDTO.getTransactionId());
        }
        
        // Update driver if provided
        if (paymentDTO.getDriverId() != null) {
            Driver driver = driverRepository.findById(paymentDTO.getDriverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + paymentDTO.getDriverId()));
            existingPayment.setDriver(driver);
        }
        
        // Update reservation if provided
        if (paymentDTO.getReservationId() != null) {
            Reservation reservation = reservationRepository.findById(paymentDTO.getReservationId())
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + paymentDTO.getReservationId()));
            existingPayment.setReservation(reservation);
        }
        
        return paymentRepository.save(existingPayment);
    }
    
    // Delete payment
    @Transactional
    public Map<String, Boolean> delete(Long id) {
        Payment payment = paymentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        
        // Check if payment can be deleted (e.g., not COMPLETED)
        if (PaymentStatus.COMPLETED.equals(payment.getStatus())) {
            throw new InvalidPaymentException("Cannot delete a completed payment");
        }
        
        paymentRepository.delete(payment);
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", Boolean.TRUE);
        return response;
    }
    
    // Find payments by driver
    public List<Payment> findByDriver(Long driverId) {
        Driver driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + driverId));
        
        return paymentRepository.findByDriver(driver);
    }
    
    // Find payments by reservation
    public List<Payment> findByReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
            .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + reservationId));
        
        return paymentRepository.findByReservation(reservation);
    }
    
    // Find payments by status
    public List<Payment> findByStatus(PaymentStatus status) {
        return paymentRepository.findByStatus(status);
    }
    
    // Find payments by payment method
    public List<Payment> findByPaymentMethod(PaymentMethod paymentMethod) {
        return paymentRepository.findByPaymentMethod(paymentMethod);
    }
    
    // Find payments by date range
    public List<Payment> findByDateRange(Date startDate, Date endDate) {
        return paymentRepository.findByPaymentDateBetween(startDate, endDate);
    }
    
    // Process payment
    @Transactional
    public Payment processPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        
        // Check if payment can be processed
        if (!PaymentStatus.PENDING.equals(payment.getStatus())) {
            throw new InvalidPaymentException("Payment cannot be processed because it is not in PENDING status");
        }
        
        // Here you would typically integrate with a payment gateway
        // For demonstration, we'll just mark it as completed
        payment.setStatus(PaymentStatus.COMPLETED);
        
        return paymentRepository.save(payment);
    }
    
    // Refund payment
    @Transactional
    public Payment refundPayment(Long id) {
        Payment payment = paymentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        
        // Check if payment can be refunded
        if (!PaymentStatus.COMPLETED.equals(payment.getStatus())) {
            throw new InvalidPaymentException("Payment cannot be refunded because it is not in COMPLETED status");
        }
        
        // Here you would typically integrate with a payment gateway for refund
        // For demonstration, we'll just mark it as refunded
        payment.setStatus(PaymentStatus.REFUNDED);
        
        return paymentRepository.save(payment);
    }
    
    // Calculate total payments by status and date range
    public Double calculateTotalByStatusAndDateRange(PaymentStatus status, Date startDate, Date endDate) {
        Double total = paymentRepository.calculateTotalAmountByStatusAndDateRange(status, startDate, endDate);
        return total != null ? total : 0.0;
    }
    
    // Count payments by driver and status
    public Long countByDriverAndStatus(Long driverId, PaymentStatus status) {
        Driver driver = driverRepository.findById(driverId)
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + driverId));
        
        return paymentRepository.countByDriverAndStatus(driver, status);
    }
    
    // Generate unique transaction ID
    private String generateTransactionId() {
        return "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    // Validate payment
    private void validatePayment(PaymentDTO paymentDTO) {
        if (paymentDTO.getAmount() == null || paymentDTO.getAmount() <= 0) {
            throw new InvalidPaymentException("Payment amount must be greater than zero");
        }
        
        if (paymentDTO.getPaymentMethod() == null) {
            throw new InvalidPaymentException("Payment method must be specified");
        }
        
        // Additional validation rules can be added here
    }
}