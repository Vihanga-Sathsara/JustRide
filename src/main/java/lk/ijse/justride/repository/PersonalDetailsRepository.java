package lk.ijse.justride.repository;

import lk.ijse.justride.entity.PersonalDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface PersonalDetailsRepository extends JpaRepository<PersonalDetails, String> {
    @Query("select p from PersonalDetails p where p.user.id = ?1")
    Optional<PersonalDetails> getPersonalDetailsByID(Long id);

}
