package lk.ijse.justride.controller;

import lombok.RequiredArgsConstructor;
import lk.ijse.justride.entity.User;
import lk.ijse.justride.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/password")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PasswordResetController {

    private final JavaMailSender mailSender;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    private final Map<String, Integer> otpStore = new HashMap<>();

    private int generateOtp() {
        Random rand = new Random();
        return 100000 + rand.nextInt(900000);
    }


    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestParam String email) {
        User user = userRepository.findByGmail(email).orElse(null);

        if (user == null) return ResponseEntity.badRequest().body("Email not found");

        int otp = generateOtp();
        otpStore.put(email, otp);


        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Recovery OTP");
        message.setText(STR."Your OTP is: \{otp}");
        mailSender.send(message);

        return ResponseEntity.ok(STR."OTP sent to email: \{email}");
    }


    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestParam String email, @RequestParam int otp) {
        if (!otpStore.containsKey(email) || otpStore.get(email) != otp) {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }
        return ResponseEntity.ok("OTP verified");
    }


    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String email, @RequestParam String newPassword) {
        User user = userRepository.findByGmail(email).orElse(null);
        if (user == null) return ResponseEntity.badRequest().body("Invalid email");

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        otpStore.remove(email); // remove OTP after success
        return ResponseEntity.ok("Password successfully changed");
    }
}
