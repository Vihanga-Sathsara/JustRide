package lk.ijse.justride.service;

import lk.ijse.justride.dto.ApiResponse;
import lk.ijse.justride.dto.PersonalDetailsDTO;
import lk.ijse.justride.entity.PersonalDetails;
import lk.ijse.justride.entity.User;
import lk.ijse.justride.repository.PersonalDetailsRepository;
import lk.ijse.justride.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PersonalDetailsService {
   private final PersonalDetailsRepository personalDetailsRepository;
   private final UserRepository userRepository;

    public ApiResponse savePersonalDetails(PersonalDetailsDTO personalDetailsDTO) {

        Optional<PersonalDetails> person = personalDetailsRepository.findById(personalDetailsDTO.getIdentityCardNumber());
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userRepository.findByGmail(email).orElseThrow(() -> new RuntimeException("User not found"));


        if (person.isPresent()) {
           return new ApiResponse(
                   409,
                   "Record already exists...",
                   null
           );
       }

       PersonalDetails personalDetails = PersonalDetails.builder()
               .identityCardNumber(personalDetailsDTO.getIdentityCardNumber())
               .licenseCardNumber(personalDetailsDTO.getLicenseCardNumber())
               .address(personalDetailsDTO.getAddress())
               .workingDistrict(personalDetailsDTO.getWorkingDistrict())
               .workingType(personalDetailsDTO.getWorkingType())
               .profileImage(personalDetailsDTO.getProfileImage())
               .status(personalDetailsDTO.getStatus())
               .user(currentUser)
               .build();
       personalDetailsRepository.save(personalDetails);
        return new ApiResponse(200,"success", "successful!");
    }

    public PersonalDetailsDTO getPersonalDetails(Long id) {
        Optional<PersonalDetails> personalDetailsOpt = personalDetailsRepository.getPersonalDetailsByID(id);

        PersonalDetails personalDetails = personalDetailsOpt.orElseThrow(
                () -> new UsernameNotFoundException("Personal details not found for user id")
        );

        return new PersonalDetailsDTO(
                personalDetails.getIdentityCardNumber(),
                personalDetails.getLicenseCardNumber(),
                personalDetails.getAddress(),
                personalDetails.getWorkingDistrict(),
                personalDetails.getWorkingType(),
                personalDetails.getProfileImage(),
                personalDetails.getStatus()
        );
    }

    public List<PersonalDetails> getDriverDetails() {
       return personalDetailsRepository.findAll();
    }


    public ApiResponse updateProfilePicture(Long id,String profileImage) {
        Optional<PersonalDetails> personalDetailsOpt = personalDetailsRepository.getPersonalDetailsByID(id);

       if (personalDetailsOpt.isPresent()) {
           PersonalDetails personalDetails = personalDetailsOpt.get();
           personalDetails.setProfileImage(profileImage);
           personalDetailsRepository.save(personalDetails);
           return new ApiResponse(200,"success", "successful");
       }
       return new ApiResponse(403,"unauthorized", "unauthorized");
    }

    public ApiResponse updateStatus(Long id){
        Optional<PersonalDetails> personalDetailsOpt = personalDetailsRepository.getPersonalDetailsByID(id);
        if (personalDetailsOpt.isPresent()) {
            PersonalDetails personalDetails = personalDetailsOpt.get();
            personalDetails.setStatus("verified");
            personalDetailsRepository.save(personalDetails);
            return new ApiResponse(200,"success", "successful");
        }
        return new ApiResponse(403,"unauthorized", "unauthorized");
    }
}
