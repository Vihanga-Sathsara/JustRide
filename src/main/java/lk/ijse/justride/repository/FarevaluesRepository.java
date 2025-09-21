package lk.ijse.justride.repository;

import lk.ijse.justride.entity.FareValues;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface FarevaluesRepository extends JpaRepository<FareValues , Long> {
    @Query("select f from FareValues f where f.vehicleType = ?1")
    Optional<FareValues> findByVehicleType(String vehicleType);
}
