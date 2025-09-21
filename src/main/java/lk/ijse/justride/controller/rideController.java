package lk.ijse.justride.controller;

import lk.ijse.justride.dto.ApiResponse;
import lk.ijse.justride.dto.RideDTO;
import lk.ijse.justride.entity.Ride;
import lk.ijse.justride.service.RideService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class rideController {
    private final RideService rideService;
    @PostMapping("/ride")
    public ResponseEntity<ApiResponse> saveRide(@RequestBody RideDTO rideDTO) {
        return ResponseEntity.ok(new ApiResponse(
                200,"OK", rideService.saveRide(rideDTO)
        ));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/allDriverRides")
    public ResponseEntity<ApiResponse> getDriverRides(@RequestParam Long driverId) {
        List<Ride> rides = rideService.getAllDriverRides(driverId);

        List<RideDTO> rideDTOs = new ArrayList<>();
        rides.forEach(ride -> {
            RideDTO dto = new RideDTO();
            dto.setDriverId(ride.getDriver().getId());
            dto.setPassengerId(ride.getPassenger().getId());
            dto.setPickupLocation(ride.getPickupLocation());
            dto.setDropOffLocation(ride.getDropOffLocation());
            dto.setDate(ride.getDate());
            dto.setPickupTime(ride.getPickupTime());
            dto.setDropOffTime(ride.getDropOffTime());
            dto.setFare(ride.getFare());
            dto.setStatus(ride.getStatus());
            rideDTOs.add(dto);
        });

        return ResponseEntity.ok(new ApiResponse(200, "success", rideDTOs));
    }

    @PostMapping("/allPassengerRides")
    public ResponseEntity<ApiResponse> getPassengerRides(@RequestParam Long passengerId) {
        List<Ride> rides = rideService.getAllPassengerRides(passengerId);

        List<RideDTO> rideDTOs = new ArrayList<>();
        rides.forEach(ride -> {
            RideDTO dto = new RideDTO();
            dto.setDriverId(ride.getDriver().getId());
            dto.setPassengerId(ride.getPassenger().getId());
            dto.setPickupLocation(ride.getPickupLocation());
            dto.setDropOffLocation(ride.getDropOffLocation());
            dto.setDate(ride.getDate());
            dto.setPickupTime(ride.getPickupTime());
            dto.setDropOffTime(ride.getDropOffTime());
            dto.setFare(ride.getFare());
            dto.setStatus(ride.getStatus());
            rideDTOs.add(dto);
        });

        return ResponseEntity.ok(new ApiResponse(200, "success", rideDTOs));
    }

    @PostMapping("/allRides")
    public ResponseEntity<ApiResponse> getAllRides() {
        List<Ride> rides = rideService.getAllRides();

        List<RideDTO> rideDtos = new ArrayList<>();
        rides.forEach(ride -> {
            RideDTO dto = new RideDTO();
            dto.setDriverId(ride.getDriver().getId());
            dto.setPassengerId(ride.getPassenger().getId());
            dto.setPickupLocation(ride.getPickupLocation());
            dto.setDropOffLocation(ride.getDropOffLocation());
            dto.setDate(ride.getDate());
            dto.setPickupTime(ride.getPickupTime());
            dto.setDropOffTime(ride.getDropOffTime());
            dto.setFare(ride.getFare());
            dto.setStatus(ride.getStatus());
            rideDtos.add(dto);
        });

        return ResponseEntity.ok(new ApiResponse(200, "success", rideDtos));
    }

}







