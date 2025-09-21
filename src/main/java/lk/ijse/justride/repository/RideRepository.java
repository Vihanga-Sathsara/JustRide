package lk.ijse.justride.repository;

import lk.ijse.justride.entity.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {
    @Query("SELECT r FROM Ride r WHERE r.driver.id = :driverId ORDER BY r.date DESC")
    List<Ride> findByDriverId(Long driverId);

    @Query("SELECT r FROM Ride r WHERE r.passenger.id = :passengerId ORDER BY r.date DESC")
    List<Ride> findByPassengerId(Long passengerId);
}
