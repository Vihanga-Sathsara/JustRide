package lk.ijse.justride.service;

import lk.ijse.justride.dto.ApiResponse;

import lk.ijse.justride.dto.VerificationImagesDTO;
import lk.ijse.justride.entity.User;
import lk.ijse.justride.entity.VerificationImages;
import lk.ijse.justride.repository.UserRepository;
import lk.ijse.justride.repository.VerificationDetailsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VerificationDetailsService {
    private final UserRepository userRepository;
    private final VerificationDetailsRepository verificationDetailsRepository;
    public ApiResponse saveVerificationDocuments(VerificationImagesDTO verificationImagesDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userRepository.findByGmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        if (verificationImagesDTO.getIdCardFront() == null || verificationImagesDTO.getIdCardBack() == null ||
                verificationImagesDTO.getLicenseCardFront() == null || verificationImagesDTO.getLicenseCardBack() == null) {
            return new ApiResponse(400, "error", "Missing required fields");
        }
        VerificationImages verificationImages = VerificationImages.builder()
                .idCardFront(verificationImagesDTO.getIdCardFront())
                .idCardBack(verificationImagesDTO.getIdCardBack())
                .licenseCardFront(verificationImagesDTO.getLicenseCardFront())
                .licenseCardBack(verificationImagesDTO.getLicenseCardBack())
                .user(currentUser)
                .build();
        verificationDetailsRepository.save(verificationImages);
        return new ApiResponse(200,"success", "successful!");
    }
}
