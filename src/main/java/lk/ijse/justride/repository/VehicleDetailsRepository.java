package lk.ijse.justride.repository;

import lk.ijse.justride.entity.VehicleDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface VehicleDetailsRepository extends JpaRepository<VehicleDetails, String> {
    @Query("select v from VehicleDetails v where v.user.id = ?1")
    Optional<VehicleDetails> findVehicleDetailsByUserId(Long id);
}
