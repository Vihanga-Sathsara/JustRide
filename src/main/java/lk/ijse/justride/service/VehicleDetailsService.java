package lk.ijse.justride.service;

import lk.ijse.justride.dto.ApiResponse;
import lk.ijse.justride.dto.VehicleDetailsDTO;
import lk.ijse.justride.entity.User;
import lk.ijse.justride.entity.VehicleDetails;
import lk.ijse.justride.repository.UserRepository;
import lk.ijse.justride.repository.VehicleDetailsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VehicleDetailsService {
    private final VehicleDetailsRepository vehicleDetailsRepository;
    private final UserRepository userRepository;

    public ApiResponse saveVehicleDetails(VehicleDetailsDTO vehicleDetailsDTO) {
        Optional<VehicleDetails> vehicle = vehicleDetailsRepository.findById(vehicleDetailsDTO.getVehicleNumber());
        if (vehicle.isPresent()) {
            return new ApiResponse(409, "Record already exists...", "already exists");
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User currentUser = userRepository.findByGmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        VehicleDetails vehicleDetails = VehicleDetails.builder()
                .vehicleNumber(vehicleDetailsDTO.getVehicleNumber())
                .type(vehicleDetailsDTO.getType())
                .make(vehicleDetailsDTO.getMake())
                .model(vehicleDetailsDTO.getModel())
                .user(currentUser)
                .build();
        vehicleDetailsRepository.save(vehicleDetails);
        return new ApiResponse(200,"success", "successful!");
    }

    public VehicleDetailsDTO getVehicleDetails(Long id) {
        Optional<VehicleDetails> vehicle = vehicleDetailsRepository.findVehicleDetailsByUserId(id);
        VehicleDetails vehicleDetails = vehicle.orElseThrow(() -> new RuntimeException("Vehicle not found"));

        return new VehicleDetailsDTO(
                vehicleDetails.getVehicleNumber(),
                vehicleDetails.getType(),
                vehicleDetails.getMake(),
                vehicleDetails.getModel()
        );

    }
}
