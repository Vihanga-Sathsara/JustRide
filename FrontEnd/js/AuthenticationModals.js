document.addEventListener("DOMContentLoaded",function (){
    window.onload = () => {

        google.accounts.id.initialize({
            client_id: '85028028424-ha9lmsre1l70alg1e8bkm2hi7sskia2o.apps.googleusercontent.com',
            callback: handleSignUpCredentialResponse,
            context: 'signup'
        });

        google.accounts.id.renderButton(
            document.getElementById('g_id_signup'),
            {
                theme: 'filled_blue',
                size: 'large',
                text: 'continue_with',
                shape: 'rect',
                logo_alignment: 'left',
            }
        );

        google.accounts.id.initialize({
                    client_id: '85028028424-ha9lmsre1l70alg1e8bkm2hi7sskia2o.apps.googleusercontent.com',
                    callback: handleSignInCredentialResponse,
                    context: 'signIn'
                });

                google.accounts.id.renderButton(
                    document.getElementById('g-id_signin'),
                    {
                        theme: 'filled_blue',
                        size: 'large',
                        text: 'continue_with',
                        shape: 'rect',
                        logo_alignment: 'left',
                    }
                );
    };

});

document.getElementById('showPW').addEventListener('click', function(event) {
    event.preventDefault();
    const passwordField = document.getElementById('floatingPassword');
    const icon = document.getElementById('showPWIcon');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.className = 'bi bi-eye';
    } else {
        passwordField.type = 'password';
        icon.className = 'bi bi-eye-slash';
    }
});

document.getElementById('showUserPWIcon').addEventListener('click', function(event) {
    event.preventDefault();
    const userPasswordField = document.getElementById('userPassword');
    const icon = document.getElementById('showUserPWIcon');

    if (userPasswordField.type === 'password') {
        userPasswordField.type = 'text';
        icon.className = 'bi bi-eye';
    }else {
        userPasswordField.type = 'password';
        icon.className = 'bi bi-eye-slash';
    }
})

document.getElementById('showConPW').addEventListener('click', function(event) {
    event.preventDefault();
    const passwordField = document.getElementById('floatingConfirmPassword');
    const icon = document.getElementById('showConPWIcon');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.className = 'bi bi-eye';
    } else {
        passwordField.type = 'password';
        icon.className = 'bi bi-eye-slash';
    }
});

document.getElementById('fullName').addEventListener('input', function() {
    let fullName = document.getElementById('fullName').value;
    const namePattern = /^[A-Za-z\s'-]{2,50}$/;

    if(!namePattern.test(fullName)){
        this.style.borderColor = 'red';
    }else {
        this.style.borderColor = 'green';
    }

    if (this.value === null || this.value === '') {
        this.style.borderColor = 'black';
    }
});

document.getElementById('mobileNumber').addEventListener('input', function() {
    let mobileNumberField = document.getElementById('mobileNumber').value;
    const mobileNumberPattern = /^(?:\+94|0)7\d{8}$/;

    if(!mobileNumberPattern.test(mobileNumberField)){
        this.style.borderColor = 'red';
    }else {
        this.style.borderColor = 'green';
    }

    if (this.value === null || this.value === '') {
        this.style.borderColor = 'black';
    }
});

document.getElementById('floatingEmail').addEventListener('input', function() {
    let emailField = document.getElementById('floatingEmail').value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if(!emailPattern.test(emailField)){
        this.style.borderColor = 'red';
    }else {
        this.style.borderColor = 'green';
    }

    if (this.value === null || this.value === '') {
        this.style.borderColor = 'black';
    }
});

document.getElementById('userEmail').addEventListener('input',function (){
    let userEmailField = document.getElementById('userEmail').value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if(!emailPattern.test(userEmailField)){
        this.style.borderColor = 'red';
    }else {
        this.style.borderColor = 'green';
    }

    if (this.value === null || this.value === '') {
        this.style.borderColor = 'black';
    }
});

document.getElementById('floatingConfirmPassword').addEventListener('input', function() {
   let passwordField = document.getElementById('floatingPassword').value;
   let confirmPasswordField = document.getElementById('floatingConfirmPassword').value;
   if (passwordField !== confirmPasswordField) {
       this.style.borderColor = 'red';
   }else {
       this.style.borderColor = 'green';
   }

    if (this.value === null || this.value === '') {
        this.style.borderColor = 'black';
    }
});

document.getElementById('floatingPassword').addEventListener('input', function() {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    let passwordField = document.getElementById('floatingPassword').value;
    if(!passwordPattern.test(passwordField)){
        this.style.borderColor = 'red';
    }else {
        this.style.borderColor = 'green';
    }

    if (this.value === null || this.value === '') {
        this.style.borderColor = 'black';
    }
});

document.getElementById('asDriver').addEventListener('click',function (){
        document.getElementById('roleInput').value = 'DRIVER';
        console.log(document.getElementById('roleInput').value);
});

document.getElementById('asCustomer').addEventListener('click',function (){
    document.getElementById('roleInput').value = 'PASSENGER';
    console.log(document.getElementById('roleInput').value);
});

document.getElementById('btnSignUp').addEventListener('click', function(event) {
    event.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const gmail = document.getElementById('floatingEmail').value;
    const mobileNumber = document.getElementById('mobileNumber').value;
    const password  = document.getElementById('floatingPassword').value;
    const confirmPassword = document.getElementById('floatingConfirmPassword').value;
    const role = document.getElementById('roleInput').value;

    if (fullName && gmail && mobileNumber && password && confirmPassword) {
        if (password === confirmPassword) {
            fetch(
                "http://localhost:8080/auth/register", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fullName,
                        gmail,
                        mobileNumber,
                        password,
                        role
                    })
            }).then(response => response.json()).then(result => {
                if (result.status === "error") {
                    alert("❌ " + result.data); // Username Already Exists
                } else {
                    alert("✅ " + result.data); // User Registration Success
                    const modalElement = document.getElementById('createAccountModal');
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    modalInstance.hide();
                }
            }).catch(error => {
                alert(error.message);
            })
        }else {
            alert("Please Check the Password!");
        }
    }else {
        alert("Please Fill All Fields!");
    }
});

document.getElementById('btnSignIn').addEventListener('click',function (e) {
    e.preventDefault();
    const gmail = document.getElementById('userEmail').value;
    const password = document.getElementById('userPassword').value;

    if (!gmail || !password) {
        alert("Please Fill All Fields!");
    }

    fetch(
        "http://localhost:8080/auth/login",{
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                gmail,
                password
            })
        }).then(response => response.json()).then(result => {
            if (result.status === "Incorrect password") {
                alert("Please check");
            }else {
                alert("✅ Signin Success!");
                const userID = result.data.id;
                localStorage.setItem('userID', userID);
                document.cookie = "token=" + result.data.accessToken + "; path=/; max-age=86400";
                console.log(result.data.role);
                if (result.data.role === "DRIVER"){
                    window.location.href = "./pages/DashBoard.html";
                }else if(result.data.role === "PASSENGER"){
                    window.location.href = "./pages/Passenger.html";
                }else if (result.data.role === "ADMIN"){
                    window.location.href = "./pages/AdminDashboard.html";
                }
            }
    });

});

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function generateRandomString(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function handleSignUpCredentialResponse(response) {
    let base64Url = response.credential.split('.')[1];

    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
        base64 += '=';
    }

    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );

    const user = JSON.parse(jsonPayload);


    const fullName = user.given_name + " " + user.family_name;
    const gmail = user.email;
    const mobileNumber = +94000000000;
    const password = generateRandomString(12);
    const role = document.getElementById('roleInput').value;
    console.log(role);

    if (fullName && gmail ) {
            fetch(
                "http://localhost:8080/auth/register", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fullName,
                        gmail,
                        mobileNumber,
                        password,
                        role
                    })
                }).then(response => response.json()).then(result => {
                if (result.status === "error") {
                    alert("❌ " + result.data); // Username Already Exists
                } else {
                    alert("✅ " + result.data); // User Registration Success
                    const modalElement = document.getElementById('createAccountModal');
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    modalInstance.hide();
                }
            }).catch(error => {
                alert(error.message);
            })
        }else{
        alert("Please Check the Password!");
    }
}

function handleSignInCredentialResponse(response) {

    let base64Url = response.credential.split('.')[1];

    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
        base64 += '=';
    }

    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );

    const user = JSON.parse(jsonPayload);

    console.log(user); // { name, email, picture, ... }

    const gmail = user.email;

    if (gmail) {
        fetch(
            "http://localhost:8080/auth/loginGoggle", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    gmail
                })
            }).then(response => response.json()).then(result => {
            if (result.status === "error") {
                alert("❌ You Haven't any account!");
            } else {
                alert("✅ Signin Success!");
                console.log(result.data)

                document.cookie = "token=" + result.data.accessToken + "; path=/; max-age=86400";
                localStorage.setItem('userID', result.data.id);
                let role = result.data.role;
                console.log(role);
                if (result.data.role === "DRIVER"){
                    window.location.href = "./pages/DashBoard.html";
                }else if(result.data.role === "CUSTOMER"){
                    window.location.href = "./pages/Passenger.html";
                }
            }
        }).catch(error => {
            alert(error.message);
        })
    } else {
        alert("Please Check the Password!");
    }
}





