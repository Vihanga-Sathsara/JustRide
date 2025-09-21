package lk.ijse.justride.controller;

import lk.ijse.justride.dto.*;
import lk.ijse.justride.entity.PersonalDetails;
import lk.ijse.justride.service.AuthService;
import lk.ijse.justride.service.PersonalDetailsService;
import lk.ijse.justride.service.VerificationDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class PersonalDetailController {
    private final PersonalDetailsService personalDetailsService;
    private final AuthService authService;
    private final VerificationDetailsService verificationDetailsService;

    @PostMapping("/saveDetails")
    public ResponseEntity<ApiResponse> savePersonalDetails(@RequestBody PersonalDetailsDTO personalDetailsDTO) {
        return ResponseEntity.ok(personalDetailsService.savePersonalDetails(personalDetailsDTO));
    }

    @PostMapping("/profileDetails")
    public ResponseEntity<UserDetailDTO> getProfileDetails(@RequestBody Map<String, Long> payload) {
        Long id = payload.get("id");
        return ResponseEntity.ok(authService.getDetails(id));
    }

    @PostMapping("/personalDetails")
    public ResponseEntity<PersonalDetailsDTO> getPersonalDetails(@RequestBody Map<String, Long> payload) {
        Long id = payload.get("id");
        return ResponseEntity.ok(personalDetailsService.getPersonalDetails(id));
    }

    @PostMapping("/profileImage")
    public ResponseEntity<ApiResponse> saveProfileImage(@RequestBody Map<String, Object> payload) {
        if (!payload.containsKey("id") || !payload.containsKey("profileImage")) {
            return ResponseEntity.badRequest().body(new ApiResponse(400, "error", "Missing id or profileImage"));
        }

        Long id = Long.valueOf(payload.get("id").toString());
        String url = payload.get("profileImage").toString();
        return ResponseEntity.ok(personalDetailsService.updateProfilePicture(id, url));
    }

    @PostMapping("/verification")
    public ResponseEntity<ApiResponse> uploadIdentityDetails(@RequestBody VerificationImagesDTO verificationImagesDTO) {
        return ResponseEntity.ok(verificationDetailsService.saveVerificationDocuments(verificationImagesDTO));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/getAll")
    public ResponseEntity<ApiResponse> getAll() {
        List<PersonalDetails> personalDetails = personalDetailsService.getDriverDetails();

        List<PersonalDetailsDTO> personalDetailsDTOS = new ArrayList<>();
        personalDetails.forEach(personalDetail ->{
            PersonalDetailsDTO personalDetailsDTO = new PersonalDetailsDTO();
            personalDetailsDTO.setIdentityCardNumber(personalDetail.getIdentityCardNumber());
            personalDetailsDTO.setLicenseCardNumber(personalDetail.getLicenseCardNumber());
            personalDetailsDTO.setAddress(personalDetail.getAddress());
            personalDetailsDTO.setWorkingDistrict(personalDetail.getWorkingDistrict());
            personalDetailsDTO.setWorkingType(personalDetail.getWorkingType());
            personalDetailsDTO.setStatus(personalDetail.getStatus());
            personalDetailsDTOS.add(personalDetailsDTO);
        });
        return ResponseEntity.ok(new ApiResponse(200, "success", personalDetailsDTOS));
    }

    @PostMapping("/{id}")
    public ResponseEntity<ApiResponse> updatePersonalStatus(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse(200,"updated",personalDetailsService.updateStatus(id)));
    }

}
