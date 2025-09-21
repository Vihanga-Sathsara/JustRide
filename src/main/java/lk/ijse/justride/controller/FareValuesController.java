package lk.ijse.justride.controller;

import lk.ijse.justride.dto.ApiResponse;
import lk.ijse.justride.dto.FareValuesDTO;
import lk.ijse.justride.entity.FareValues;
import lk.ijse.justride.service.FareValuesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/fare")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FareValuesController {
    private final FareValuesService fareValuesService;

    @PostMapping("/values")
    public ResponseEntity<ApiResponse> saveFareValues(@RequestBody FareValuesDTO fareValuesDTO) {
        return ResponseEntity.ok(new ApiResponse(200,"Values Saved",fareValuesService.saveValues(fareValuesDTO)));
    }

    @PostMapping("/allValues")
    public ResponseEntity<ApiResponse>getAllFareValues() {
        List<FareValues> fareValues = fareValuesService.getAllValues();

        List<FareValuesDTO> fareValuesDTOS = new ArrayList<>();
        fareValues.forEach(fareValue -> {
            FareValuesDTO fareValuesDTO1 = new FareValuesDTO();
            fareValuesDTO1.setVehicleType(fareValue.getVehicleType());
            fareValuesDTO1.setBaseFare(fareValue.getBaseFare());
            fareValuesDTO1.setPerKMRate(fareValue.getPerKMRate());
            fareValuesDTOS.add(fareValuesDTO1);
        });
        return ResponseEntity.ok(new ApiResponse(200,"All Values Fetched",fareValuesDTOS));
    }

    @PostMapping("/{vehicleType}")
    public ResponseEntity<ApiResponse>getFare(@PathVariable String vehicleType) {
        return ResponseEntity.ok(new ApiResponse(200,"All Values Fetched",fareValuesService.getValuesDetails(vehicleType)));
    }
}
