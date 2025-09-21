package lk.ijse.justride.repository;

import jakarta.transaction.Transactional;
import lk.ijse.justride.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByGmail(String gmail);

    @Query("SELECT u FROM User u WHERE u.role = 'DRIVER'")
    List<User> findByDriver();

    @Query("SELECT u FROM User u WHERE u.role = 'PASSENGER'")
    List<User> findByPassenger();

    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.password = NULL WHERE u.id = ?1")
    int deleteAccess(Long id);

}
