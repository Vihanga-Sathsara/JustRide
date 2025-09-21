package lk.ijse.justride.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonalDetailsDTO {
    private String identityCardNumber;
    private String licenseCardNumber;
    private String address;
    private String workingDistrict;
    private String workingType;
    private String profileImage;
    private String status;


    public PersonalDetailsDTO(String status) {
        this.status = status;
    }
}
