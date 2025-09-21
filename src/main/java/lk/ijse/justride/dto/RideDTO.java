package lk.ijse.justride.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class RideDTO {
    private long driverId;
    private long passengerId;
    private String pickupLocation;
    private String dropOffLocation;
    private LocalDate date;
    private LocalTime pickupTime;
    private LocalTime dropOffTime;
    private BigDecimal fare;
    private String Status;
}
