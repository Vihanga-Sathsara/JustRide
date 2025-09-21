package lk.ijse.justride.controller;

import jakarta.servlet.http.HttpServletRequest;
import lk.ijse.justride.dto.*;
import lk.ijse.justride.service.AuthService;
import lk.ijse.justride.service.TokenBlacklist;
import lk.ijse.justride.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    private final AuthService authService;
    private final TokenBlacklist tokenBlacklist;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(@RequestBody RegisterDTO registerDTO) {
        ApiResponse apiResponse = authService.register(registerDTO);
        if ("error".equals(apiResponse.getStatus())) {
            return ResponseEntity.badRequest().body(apiResponse);
        }
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody AuthDTO authDTO) {
        return ResponseEntity.ok(new ApiResponse(
                200,"OK", authService.authenticate(authDTO)
        ));
    }

    @PostMapping("/loginGoggle")
    public ResponseEntity<ApiResponse> login(@RequestBody googleDTO googleDTO) {
        return ResponseEntity.ok(new ApiResponse(200,"OK",authService.googleAuthenticate(googleDTO)));
    }
//
//    @PutMapping("/update")
//    public ResponseEntity<ApiResponse> updateUser(@RequestBody UserDetailDTO userDetailDTO) {
//        return ResponseEntity.ok(new ApiResponse(200,"OK",authService.googleAuthenticate(userDetailDTO)));
//    }

    @PostMapping("/Driver")
    public ResponseEntity<ApiResponse> getAllDrivers() {
        return ResponseEntity.ok(new ApiResponse(200,"OK",authService.getAllDrivers()));
    }

    @PostMapping("/Passenger")
    public ResponseEntity<ApiResponse> getAllPassengers() {
        return ResponseEntity.ok(new ApiResponse(200,"OK",authService.getAllPassengers()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse(200,"OK",authService.deleteUser(id)));
    }



    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String liveToken = token.substring(7);
            Date expiry = jwtUtil.extractExpiration(liveToken);
            tokenBlacklist.addToken(liveToken, expiry);
            return ResponseEntity.ok(new ApiResponse(200, "Logged out successfully", null));
        }
        return ResponseEntity.badRequest().body(new ApiResponse(400, "Invalid token", null));
    }
}
