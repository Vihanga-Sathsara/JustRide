package lk.ijse.justride.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FareValues {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fareID;
    private String vehicleType;
    private double baseFare;
    private double perKMRate;
}
