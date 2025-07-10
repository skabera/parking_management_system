package com.parking.parking_management_sys.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.parking.parking_management_sys.entities.Driver;
import com.parking.parking_management_sys.entities.Payment;
import com.parking.parking_management_sys.entities.Payment.PaymentMethod;
import com.parking.parking_management_sys.entities.Payment.PaymentStatus;
import com.parking.parking_management_sys.entities.Reservation;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    List<Payment> findByDriver(Driver driver);
    
    List<Payment> findByReservation(Reservation reservation);
    
    List<Payment> findByStatus(PaymentStatus status);
    
    List<Payment> findByPaymentMethod(PaymentMethod paymentMethod);
    
    List<Payment> findByTransactionId(String transactionId);
    
    List<Payment> findByPaymentDateBetween(Date startDate, Date endDate);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = :status AND p.paymentDate BETWEEN :startDate AND :endDate")
    Double calculateTotalAmountByStatusAndDateRange(
            @Param("status") PaymentStatus status,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate);
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.driver = :driver AND p.status = :status")
    Long countByDriverAndStatus(
            @Param("driver") Driver driver, 
            @Param("status") PaymentStatus status);
}