package lk.ijse.justride.controller;

import lk.ijse.justride.dto.ApiResponse;
import lk.ijse.justride.dto.VehicleDetailsDTO;
import lk.ijse.justride.service.VehicleDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/vehicle")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VehicleDetailsController {

    private final VehicleDetailsService vehicleDetailsService;

    @PostMapping("/save")
    public ResponseEntity<ApiResponse> saveVehicleDetails(@RequestBody VehicleDetailsDTO vehicleDetailsDTO) {
        return ResponseEntity.ok(vehicleDetailsService.saveVehicleDetails(vehicleDetailsDTO));
    }

    @PostMapping("/details")
    public ResponseEntity<VehicleDetailsDTO> getVehicleDetails(@RequestBody Map<String, Long> payload) {
        Long id = payload.get("id");
        return ResponseEntity.ok(vehicleDetailsService.getVehicleDetails(id));
    }
}
