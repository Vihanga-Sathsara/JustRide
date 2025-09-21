document.addEventListener('DOMContentLoaded', function() {
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');

    const emailInput = document.getElementById('email');
    const otpInput = document.getElementById('otp');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    const sendOtpBtn = document.getElementById('send-otp');
    const verifyOtpBtn = document.getElementById('verify-otp');
    const changePasswordBtn = document.getElementById('change-password');
    const resendOtpLink = document.getElementById('resend-otp');

    const successMessage = document.getElementById('success-message');
    const stepCircles = document.querySelectorAll('.step-circle');
    const stepLines = document.querySelectorAll('.step-line');

    let userEmail = '';

    function updateStepIndicator(step) {
        stepCircles.forEach((circle, index) => circle.classList.toggle('active', index < step));
        stepLines.forEach((line, index) => line.classList.toggle('active', index < step - 1));
    }

    function showStep(stepNumber) {
        step1.classList.toggle('active', stepNumber === 1);
        step2.classList.toggle('active', stepNumber === 2);
        step3.classList.toggle('active', stepNumber === 3);
        updateStepIndicator(stepNumber);
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPassword(password) {
        return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/.test(password);
    }

    // --------------------- SEND OTP ---------------------
    sendOtpBtn.addEventListener('click', async () => {
        const email = emailInput.value.trim();
        const emailError = document.getElementById('email-error');

        if (!email) {
            emailError.textContent = 'Please enter your email address';
            return;
        }
        if (!isValidEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
            return;
        }
        emailError.textContent = '';
        userEmail = email;

        try {
            const response = await fetch(`/api/password/send-otp?email=${encodeURIComponent(email)}`, {
                method: 'POST'
            });

            const text = await response.text();
            if (!response.ok) throw new Error(text);

            successMessage.textContent = text;
            showStep(2);
            setTimeout(() => successMessage.textContent = '', 3000);

        } catch (error) {
            emailError.textContent = error.message || 'Failed to send OTP';
        }
    });

    // --------------------- VERIFY OTP ---------------------
    verifyOtpBtn.addEventListener('click', async () => {
        const otp = otpInput.value.trim();
        const otpError = document.getElementById('otp-error');

        if (!otp) {
            otpError.textContent = 'Please enter the OTP';
            return;
        }
        otpError.textContent = '';

        try {
            const response = await fetch(`/api/password/verify-otp?email=${encodeURIComponent(email)}&otp=${otp}`, {
                method: 'POST'
            });
            const text = await response.text();
            if (!response.ok) throw new Error(text);

            successMessage.textContent = 'OTP verified';
            showStep(3);
            setTimeout(() => successMessage.textContent = '', 2000);

        } catch (error) {
            otpError.textContent = error.message || 'Invalid OTP';
        }
    });

    // --------------------- RESEND OTP ---------------------
    resendOtpLink.addEventListener('click', async () => {
        try {
            const response = await fetch(`/api/password/send-otp?email=${encodeURIComponent(email)}`, {
                method: 'POST'
            });
            const text = await response.text();
            if (!response.ok) throw new Error(text);

            successMessage.textContent = 'New OTP sent';
            setTimeout(() => successMessage.textContent = '', 3000);

        } catch (error) {
            successMessage.textContent = 'Failed to resend OTP';
        }
    });

    // --------------------- CHANGE PASSWORD ---------------------
    changePasswordBtn.addEventListener('click', async () => {
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const passwordError = document.getElementById('password-error');
        const confirmError = document.getElementById('confirm-error');

        if (!newPassword) {
            passwordError.textContent = 'Please enter a new password';
            return;
        }
        if (!isValidPassword(newPassword)) {
            passwordError.textContent = 'Password must be at least 8 characters with a number and special character';
            return;
        }
        if (newPassword !== confirmPassword) {
            confirmError.textContent = 'Passwords do not match';
            return;
        }
        passwordError.textContent = '';
        confirmError.textContent = '';

        try {
            const response = await fetch(`/api/password/reset-password?email=${encodeURIComponent(email)}&newPassword=${encodeURIComponent(newPassword)}`, {
                method: 'POST'
            });
            const text = await response.text();
            if (!response.ok) throw new Error(text);

            successMessage.textContent = text;
            setTimeout(() => {
                emailInput.value = '';
                otpInput.value = '';
                newPasswordInput.value = '';
                confirmPasswordInput.value = '';
                showStep(1);
                successMessage.textContent = '';
            }, 3000);

        } catch (error) {
            passwordError.textContent = error.message || 'Failed to change password';
        }
    });
});
