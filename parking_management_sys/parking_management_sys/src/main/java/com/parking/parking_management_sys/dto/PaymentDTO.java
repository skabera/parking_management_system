package com.parking.parking_management_sys.dto;

import java.util.Date;

import com.parking.parking_management_sys.entities.Payment.PaymentMethod;
import com.parking.parking_management_sys.entities.Payment.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Long id;
    private Double amount;
    private Date paymentDate;
    private PaymentMethod paymentMethod;
    private String transactionId;
    private PaymentStatus status;
    private Long driverId;
    private Long reservationId;
}