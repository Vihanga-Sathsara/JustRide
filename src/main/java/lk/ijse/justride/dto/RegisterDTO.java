package lk.ijse.justride.dto;

import lombok.Data;

@Data
public class RegisterDTO {
    private String fullName;
    private String gmail;
    private String mobileNumber;
    private String password;
    private String role;
}
