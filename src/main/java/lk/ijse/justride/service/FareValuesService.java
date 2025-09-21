package lk.ijse.justride.service;

import lk.ijse.justride.dto.ApiResponse;
import lk.ijse.justride.dto.FareValuesDTO;
import lk.ijse.justride.dto.PersonalDetailsDTO;
import lk.ijse.justride.entity.FareValues;
import lk.ijse.justride.entity.PersonalDetails;
import lk.ijse.justride.repository.FarevaluesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FareValuesService {
    private final FarevaluesRepository farevaluesRepository;

    public ApiResponse saveValues(FareValuesDTO fareValuesDTO){
        FareValues fareValues = FareValues.builder()
                .vehicleType(fareValuesDTO.getVehicleType())
                .baseFare(fareValuesDTO.getBaseFare())
                .perKMRate(fareValuesDTO.getPerKMRate())
                .build();
         farevaluesRepository.save(fareValues);
        return new ApiResponse(200,"success", "Add Values Successfully");
    }

    public List<FareValues> getAllValues(){
        return farevaluesRepository.findAll();
    }

    public FareValuesDTO getValuesDetails(String vehicleType) {
        Optional<FareValues> fareValuesDTOOpt = farevaluesRepository.findByVehicleType(vehicleType);

        FareValues fareValues = fareValuesDTOOpt.orElseThrow( () -> new UsernameNotFoundException("Fare Value details not found"));

        return new FareValuesDTO(
                fareValues.getBaseFare(),
                fareValues.getPerKMRate()
        );
    }
}
