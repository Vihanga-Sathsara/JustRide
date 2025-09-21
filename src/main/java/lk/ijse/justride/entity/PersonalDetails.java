package lk.ijse.justride.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PersonalDetails {
    @Id
    private String identityCardNumber;
    private String licenseCardNumber;
    private String address;
    private String workingDistrict;
    private String workingType;
    private String profileImage;
    private String status;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}
