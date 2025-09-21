package lk.ijse.justride.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VerificationImagesDTO {
    private String idCardFront;
    private String idCardBack;
    private String licenseCardFront;
    private String licenseCardBack;
}
