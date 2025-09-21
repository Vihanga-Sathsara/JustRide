package lk.ijse.justride.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDetailDTO {
    private Long id;
    private String fullName;
    private String gmail;
    private String mobileNumber;
    private String password;


    public UserDetailDTO(long id, String fullName, String gmail, String mobileNumber) {
        this.id = id;
        this.fullName = fullName;
        this.gmail = gmail;
        this.mobileNumber = mobileNumber;
    }
}
