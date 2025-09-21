package lk.ijse.justride.service;

import lk.ijse.justride.dto.*;
import lk.ijse.justride.entity.Role;
import lk.ijse.justride.entity.User;
import lk.ijse.justride.repository.UserRepository;
import lk.ijse.justride.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponseDTO authenticate(AuthDTO authDTO) {
        User user = userRepository.findByGmail(authDTO.getGmail()).orElseThrow(() -> new UsernameNotFoundException("User`Not Found"));

        if (!passwordEncoder.matches(authDTO.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Incorrect password");
        }
        String token = jwtUtil.generateToken(user.getGmail(),user.getRole().name());
        return new AuthResponseDTO(
                token,
                user.getId(),
                user.getRole().name());
    }

    public AuthResponseDTO googleAuthenticate(googleDTO googleDTO) {
        User user = userRepository.findByGmail(googleDTO.getGmail()).orElseThrow(() -> new UsernameNotFoundException("User`Not Found"));

        String token = jwtUtil.generateToken(user.getGmail(),user.getRole().name());
        return new AuthResponseDTO(
                token,
                user.getId(),
                user.getRole().name());
    }


    public ApiResponse register(RegisterDTO registerDTO) {
        if (userRepository.findByGmail(registerDTO.getGmail()).isPresent()) {
            return new ApiResponse(400,"error","User already exists");
        }
        User user = User.builder().
                fullName(registerDTO.getFullName())
                .gmail(registerDTO.getGmail())
                .mobileNumber(registerDTO.getMobileNumber())
                .password(registerDTO.getPassword() != null ? passwordEncoder.encode(registerDTO.getPassword()) : null)
                .role(Role.valueOf(registerDTO.getRole()))
                .build();
        userRepository.save(user);
        return new ApiResponse(200,"success", "User registration successful!");
    }

    public UserDetailDTO getDetails(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("User Not Found"));

        return new UserDetailDTO(
                user.getId(),
                user.getFullName(),
                user.getGmail(),
                user.getMobileNumber()
        );
    }

    public List<UserDetailDTO> getAllDrivers(){
        List<User> users = userRepository.findByDriver();

        ArrayList<UserDetailDTO> drivers = new ArrayList<>();
        for (User user : users) {
            if (user.getPassword() != null) {
                drivers.add(new UserDetailDTO(
                        user.getId(),
                        user.getFullName(),
                        user.getGmail(),
                        user.getMobileNumber()
                ));
            }
        }
        return drivers;
    }

    public List<UserDetailDTO> getAllPassengers(){
        List<User> users = userRepository.findByPassenger();

        ArrayList<UserDetailDTO> passengers = new ArrayList<>();
        for (User user : users) {
            if (user.getPassword() != null) {
                passengers.add(new UserDetailDTO(
                        user.getId(),
                        user.getFullName(),
                        user.getGmail(),
                        user.getMobileNumber()
                ));
            }
        }
        return passengers;
    }

    public ApiResponse deleteUser(Long id) {
        int rows = userRepository.deleteAccess(id);
        if (rows > 0) {
            return new ApiResponse(200,"success","User deleted successfully!");
        }
        return new ApiResponse(400,"success", "User deletion unsuccessful!");
    }

}
