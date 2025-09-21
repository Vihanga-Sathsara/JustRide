package lk.ijse.justride.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FareValuesDTO {
    private Long id;
    private String vehicleType;
    private double baseFare;
    private double perKMRate;

    public FareValuesDTO(double baseFare, double perKMRate) {
        this.baseFare = baseFare;
        this.perKMRate = perKMRate;
    }
}
