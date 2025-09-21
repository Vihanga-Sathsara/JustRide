package lk.ijse.justride.service;

import lk.ijse.justride.dto.ApiResponse;
import lk.ijse.justride.dto.RideDTO;
import lk.ijse.justride.entity.Ride;
import lk.ijse.justride.entity.User;
import lk.ijse.justride.repository.RideRepository;
import lk.ijse.justride.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RideService {
    private final RideRepository rideRepository;
    private final UserRepository userRepository;



    public ApiResponse saveRide(RideDTO rideDTO) {
        User driver = userRepository.findById(rideDTO.getDriverId())
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        User passenger = userRepository.findById(rideDTO.getPassengerId())
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        Ride ride = Ride.builder()
                .driver(driver)
                .passenger(passenger)
                .pickupLocation(rideDTO.getPickupLocation())
                .dropOffLocation(rideDTO.getDropOffLocation())
                .date(rideDTO.getDate())
                .pickupTime(rideDTO.getPickupTime())
                .dropOffTime(rideDTO.getDropOffTime())
                .fare(rideDTO.getFare())
                .status(rideDTO.getStatus())
                .build();
        rideRepository.save(ride);

        return new ApiResponse(200,"success", "successful!");
    }

    public List<Ride> getAllDriverRides(Long driverId) {
        return rideRepository.findByDriverId(driverId);
    }

    public List<Ride> getAllPassengerRides(Long passengerId) {
        return rideRepository.findByPassengerId(passengerId);
    }

    public List<Ride> getAllRides() {
        return rideRepository.findAll();
    }

}
