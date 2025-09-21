document.addEventListener('DOMContentLoaded', async () => {
    barchart();
    barchart1();
    await loadDriverRides(1);
    populateVehicleType('vehicleType');
    populateWorkingDistrict('workingDistrict');
    populateWorkingType('workingType');
    await loadProfileData();
    await loadPersonalData();
    await loadVehicleData();
    await loadDriverMap();
    document.getElementById('personalInfo').style.display = 'none';
});


const id = localStorage.getItem('userID');
const token = getCookie('token'); // your cookie name
if (token) {
    const payload = parseJwt(token);
    if (payload && payload.exp) {
        // JWT exp is in seconds since epoch
        const expireDate = new Date(payload.exp * 1000);
        console.log("Token expires at:", expireDate);

        const now = new Date();
        const remainingMs = expireDate - now;
        const minutes = Math.floor(remainingMs / 1000 / 60);
        const seconds = Math.floor((remainingMs / 1000) % 60);

        console.log(`Remaining time: ${minutes}m ${seconds}s`);
    } else {
        console.log("Cannot read expiration from token");
    }
} else {
    console.log("Token cookie not found");
}

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1]; // payload is the 2nd part
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}



import { database, ref, set } from './firebase.js';


function barchart() {
    const ctx = document.getElementById('earningsChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{
                label: 'Earnings ($)',
                data: [0, 0, 0, 0,0],
                backgroundColor: 'rgba(77, 146, 243, 0.6)',
                borderColor: 'rgba(77, 146, 243, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

function barchart1() {
    const ctx = document.getElementById('workingHoursChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{
                label: 'Earnings ($)',
                data: [0, 0, 0, 0, 0],
                backgroundColor: 'rgba(77, 146, 243, 0.6)',
                borderColor: 'rgba(77, 146, 243, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

async function loadDriverRides(driverId) {
    fetch(
       `http://localhost:8080/auth/allDriverRides?driverId=${driverId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },


        }).then(response => response.json()).then(result => {
       const ridesContainer = document.getElementById("recentDIV");
       ridesContainer.innerHTML = "";

       result.data.forEach(ride => {
           const rideDiv = document.createElement("div");
           rideDiv.classList.add("col-12", "m-0", "p-2", "d-flex", "justify-content-evenly", "align-items-center");
           rideDiv.style.backgroundColor = "#59d102";
           rideDiv.innerHTML = `
                <h5><i class="fas fa-car"></i></h5>
                <h5 id="rideTime">${ride.date}, ${ride.pickupTime}'}</h5>
                <h6 id="value">LKR ${ride.fare}</h6>
            `;
           ridesContainer.appendChild(rideDiv);
       });

   }).catch(error => {
        alert(error.message);
    })

}



document.getElementById('idCardNumber').addEventListener('input', function() {
    let idCardNumberField = document.getElementById('idCardNumber').value;
    const idCardPattern = /^(\d{9}[Vv]|\d{12})$/;

    if(!idCardPattern.test(idCardNumberField)){
        this.style.borderColor = 'red';
    }else {
        this.style.borderColor = 'green';
    }

    if (this.value === null || this.value === '') {
        this.style.borderColor = 'black';
    }
});


document.getElementById('licenseCardNumber').addEventListener('input', function() {
    let licenseField = document.getElementById('licenseCardNumber').value;
    const licensePattern = /^\d{12}$/;

    if (!licensePattern.test(licenseField)){
        this.style.borderColor = 'red';
    }else{
        this.style.borderColor = 'green';
    }

    if (this.value === null || this.value === '') {
        this.style.borderColor = 'black';
    }
});

document.getElementById("addressLine1").addEventListener('input', function() {
    let addressLine1Field = document.getElementById('addressLine1').value;
    const addressPattern = /^.{10,}$/

    if (!addressPattern.test(addressLine1Field)){
        this.style.borderColor = 'red';
    }else{
        this.style.borderColor = 'green';
    }

    if (this.value === null || this.value === '') {
        this.style.borderColor = 'black';
    }
});



document.getElementById("idCardFrontDiv").addEventListener("click",function (){
    document.getElementById('idCardFrontInput').click();
});

document.getElementById("idCardBackDiv").addEventListener("click",function (){
    document.getElementById('idCardBackInput').click();
});

document.getElementById("licenseFrontDiv").addEventListener("click",function (){
    document.getElementById('licenseFrontInput').click();
});

document.getElementById("licenseBackDiv").addEventListener("click",function (){
    document.getElementById('licenseBackInput').click();
});

document.getElementById('profilePicture').addEventListener('click',function (){
    document.getElementById('profileImage').click();
});

function populateVehicleType(){
    const vehicleTypes = [
        "Bike","Three Wheel","Car","Van","Lorry"
    ];
    vehicleTypes.forEach(vehicleType =>{
        let option = document.createElement("option");
        option.text = vehicleType;
        option.value = vehicleType;
        document.getElementById('vehicleType').add(option);
    });
}

function populateWorkingDistrict(){
    const districts = [
        "Ampara",
        "Anuradhapura",
        "Badulla",
        "Batticaloa",
        "Colombo",
        "Galle",
        "Gampaha",
        "Hambantota",
        "Jaffna",
        "Kalutara",
        "Kandy",
        "Kegalle",
        "Kilinochchi",
        "Kurunegala",
        "Mannar",
        "Matale",
        "Matara",
        "Monaragala",
        "Mullaitivu",
        "Nuwara Eliya",
        "Polonnaruwa",
        "Puttalam",
        "Ratnapura",
        "Trincomalee",
        "Vavuniya"
    ];
    districts.forEach(district =>{
        let option = document.createElement("option");
        option.text = district;
        option.value = district;
        document.getElementById('workingDistrict').add(option);
    });
}

function populateWorkingType(){
    const workingTypes = [
        "Part Time","Full Time"
    ];
    workingTypes.forEach(workingType =>{
        let option = document.createElement("option");
        option.text = workingType;
        option.value = workingType;
        document.getElementById('workingType').add(option);
    });
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}
document.getElementById('btnPersonalInfo').addEventListener('click', function(e){
    e.preventDefault();

    const idCardNumber = document.getElementById('idCardNumber').value.trim();
    const licenseCardNumber = document.getElementById('licenseCardNumber').value.trim();
    const addressLine1 = document.getElementById('addressLine1').value.trim();
    const addressLine2 = document.getElementById('addressLine2').value.trim();
    const address = addressLine2 ? `${addressLine1}..${addressLine2}` : addressLine1;

    const workingDistrict = document.getElementById('workingDistrict').value;
    const workingType = document.getElementById('workingType').value;
    const profileImage = null;
    const driverStatus = "unverified";

    let details = {
        identityCardNumber: idCardNumber,
        licenseCardNumber: licenseCardNumber,
        address: address,
        workingDistrict: workingDistrict,
        workingType: workingType,
        profileImage: profileImage,
        status: driverStatus
    }
    console.log(details);
    // Validation
    if (!idCardNumber || !licenseCardNumber || !address || !workingDistrict || !workingType) {
        alert("Please Fill all details");
        return;
    }

    const token = getCookie('token');
    if (!token) {
        alert("Token not found! Please login again.");
        return;
    }
    console.log(token);

    fetch("http://localhost:8080/profile/saveDetails", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(details)
    })
        .then(response => response.json())
        .then(result => {
            if (result.status === "error") {
                alert("❌ " + result.data);
            } else {
                alert("✅ " + result.data);
            }
        })
        .catch(error => {
            alert(error.message);
        });

});

async function loadProfileData() {

    try {
        const response = await fetch("http://localhost:8080/profile/profileDetails", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id: id })
        });

        if (!response.ok) {
            console.error("Error:", response.status, response.statusText);
            return;
        }

        const result = await response.json();
        console.log("✅ User Details:", result);


        document.getElementById('accountID').value =  result.id;
        document.getElementById('fullName').value = result.fullName;
        document.getElementById('userName').innerText = result.fullName;
        document.getElementById('email').value = result.gmail;
        if (result.mobileNumber === "94000000000"){
            document.getElementById('mobileNumber').style.borderColor = 'red';
        }else{
            document.getElementById('mobileNumber').value = result.mobileNumber;
        }


    } catch (error) {
        console.error("Error fetching profile data:", error);
    }
}

async function loadPersonalData() {

    try {
        const response = await fetch("http://localhost:8080/profile/personalDetails", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id: id })
        });

        if (!response.ok) {
            const modalEl = document.getElementById('completeProfileModal');
            const modal = new bootstrap.Modal(modalEl);
            modal.show();
        }

        const result = await response.json();
        console.log("✅ Personal Details:", result);

        const  address = result.address;
        const addressLines = address.split("..");
       console.log(result.status);
        const addressLine1 = addressLines[0];
        const addressLine2 = addressLines[1];

        document.getElementById('idCardNumber').value = result.identityCardNumber;
        document.getElementById('licenseCardNumber').value = result.licenseCardNumber;
        document.getElementById('addressLine1').value = addressLine1;
        document.getElementById('addressLine2').value = addressLine2;
        document.getElementById('workingDistrict').value = result.workingDistrict;
        document.getElementById('workingType').value = result.workingType;
        document.getElementById('profile').src = result.profileImage;
        if ( document.getElementById('profile').src === null){
            document.getElementById('showText').style.display = 'block';
        }else {
            document.getElementById('showText').style.display = 'none';
        }
       if (result.status === "unverified"){
           const modalEl = document.getElementById('verificationModal');
           const modal = new bootstrap.Modal(modalEl);
           modal.show();
       }

    } catch (error) {
        console.error("Error fetching profile data:", error);
    }
}

document.getElementById('btnUploadProfile').addEventListener('click',uploadImage);
const fileInput = document.getElementById('profileImage');


fileInput.addEventListener('change',()=>{
    const reader = new FileReader();
    let selected = fileInput.files[0];

    reader.readAsDataURL(selected);

    reader.onloadend = () => {
        const img = document.getElementById('profile');
        document.getElementById('showText').style.display = 'none';
        img.src = reader.result;
        img.style.display = "block";
    }
});

const apiKey = "ff595d1acf1ad36b2e88bf1f5d3676c7";
async function uploadImage() {

    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file first!");
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
        const base64Image = reader.result.split(',')[1];

        try {
            const apiKey = "ff595d1acf1ad36b2e88bf1f5d3676c7";
            const formData = new FormData();
            formData.append("image", base64Image);

            const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            console.log(result);

            if (result.success) {
                alert("Uploaded! URL: " + result.data.url);
                console.log("Direct Image URL:", result.data.url);
                console.log("Display URL:", result.data.display_url);
                await fetch("http://localhost:8080/profile/profileImage",{
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        id: id,
                        profileImage: result.data.url
                    })
                }).then(response => response.json()).then(result => {
                    if (result.status === "unauthorized") {
                        alert("❌ " + result.data);
                    } else {
                        alert("✅ " + result.data);
                    }
                });
            } else {
                alert("Upload failed!");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
}

document.getElementById('btnSaveVehicle').addEventListener('click',(e)=>{
    e.preventDefault();
    const vehicleType = document.getElementById('vehicleType').value;
    const vehicleNumber = document.getElementById('vehicleNumber').value;
    const vehicleMake = document.getElementById('vehicleMake').value;
    const vehicleModel = document.getElementById('vehicleModel').value;

    let vehicleDetails = {
        vehicleNumber:vehicleNumber,
        type:vehicleType,
        make:vehicleMake,
        model:vehicleModel
    }
    console.log(vehicleDetails);
    if (!vehicleType || !vehicleNumber || !vehicleMake || !vehicleModel) {
        alert("Please Fill all details");
        return;
    }

    fetch("http://localhost:8080/vehicle/save", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(
            vehicleDetails
        )
    })
        .then(response => response.json())
        .then(result => {
            if (result.code === 200) {
                Swal.fire({
                    title: "Details Saved Successfully!",
                    icon: "success",
                    draggable: true
                });

            }else if(result.code === 409){
                Swal.fire({
                    title: "This Vehicle Already Registered!",
                    icon: "warning",
                    draggable: true
                });
            } else {
                Swal.fire({
                    title: "Please Try again!",
                    icon: "error",
                    draggable: true
                });
            }
        })
        .catch(error => {
            alert(error.message);
        });
});

async function loadVehicleData() {

    try {
        const response = await fetch("http://localhost:8080/vehicle/details", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id: id }) // send JSON body
        });

        if (!response.ok) {
            console.error("Error:", response.status, response.statusText);
            return;
        }

        const result = await response.json();
        console.log("✅ Vehicle Details:", result);

        document.getElementById('vehicleType').value = result.type;
        document.getElementById('vehicleNumber').value = result.vehicleNumber;
        document.getElementById('vehicleMake').value = result.make;
        document.getElementById('vehicleModel').value = result.model;

    } catch (error) {
        console.error("Error fetching profile data:", error);
    }
}

document.getElementById('btnSaveIdentity').addEventListener('click',uploadIdentity);
const files = [
    { inputId: "idCardFrontInput" },
    { inputId: "idCardBackInput"},
    { inputId: "licenseFrontInput"},
    { inputId: "licenseBackInput"}
];

files.forEach(({ inputId }) => {
    const fileInput = document.getElementById(inputId);

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = () => {
            const imgPreview = document.getElementById(inputId + "Preview");
            if (imgPreview) {
                imgPreview.src = reader.result;
                imgPreview.style.display = "block";
            }
        };
    });
});

async function uploadIdentity() {

    const uploadedUrls = {};

    for (const { inputId } of files) {
        const fileInput = document.getElementById(inputId);
        const file = fileInput.files[0];

        if (!file) {
            alert(`Please select a file for ${inputId}`);
            return;
        }

        try {
            const base64 = await fileToBase64(file);
            const formData = new FormData();
            formData.append("image", base64);

            const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                uploadedUrls[inputId] = result.data.url;
                console.log(`${inputId} uploaded:`, result.data.url);
            } else {
                console.error(`${inputId} upload failed`, result);
                alert(`${inputId} upload failed`);
                return;
            }
        } catch (err) {
            console.error(`${inputId} upload error:`, err);
            alert(`${inputId} upload error`);
            return;
        }
    }

    console.log("All uploaded URLs:", uploadedUrls);
    alert("All files uploaded successfully!");

    const documents = {
        idCardFront: uploadedUrls["idCardFrontInput"],
        idCardBack: uploadedUrls["idCardBackInput"],
        licenseCardFront: uploadedUrls["licenseFrontInput"],
        licenseCardBack: uploadedUrls["licenseBackInput"]
    };
    if (!documents.idCardFront || !documents.idCardBack || !documents.licenseCardFront || !documents.licenseCardBack) {
        alert("Some files failed to upload. Cannot send to backend.");
        return;
    }
    console.log("data fetch:",documents);

    try {
        const res = await fetch("http://localhost:8080/profile/verification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(documents)
        });

        const result = await res.json();
        console.log("Backend response:", result);
        alert(result.data); // show backend response
    } catch (err) {
        console.error("Error sending to backend:", err);
        alert("Failed to save verification images to server");
    }

}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("File read error"));
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.readAsDataURL(file);
    });
}



async function loadDriverMap() {
    let type;
    let number;
    let name;
    let mobile;
    try {
        const response = await fetch("http://localhost:8080/vehicle/details", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id: id }) // send JSON body
        });

        if (!response.ok) {
            console.error("Error:", response.status, response.statusText);
            return;
        }

        const result = await response.json();
        console.log("✅ Vehicle Details:", result);
        number = result.vehicleNumber;
        type = result.type;


    } catch (error) {
        console.error("Error fetching profile data:", error);
    }

    try {
        const response = await fetch("http://localhost:8080/profile/profileDetails", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id: id })
        });

        if (!response.ok) {
            const modalEl = document.getElementById('completeProfileModal');
            const modal = new bootstrap.Modal(modalEl);
            modal.show();
        }

        const results = await response.json();
        console.log("✅ Personal Details:", results);
        name = results.fullName;
        mobile = results.mobileNumber;
    } catch (error) {
        console.error("Error fetching profile data:", error);
    }
    console.log(number,type,name,mobile);
    var map = L.map('mapView').setView([6.9271, 79.8612], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
    }).addTo(map);

    console.log("Sending initial location data to Firebase...");
    const initialLocation = [6.9271, 79.8612];
    set(ref(database, `drivers/${id}`), {
        lat: initialLocation[0],
        lng: initialLocation[1],
        timestamp: Date.now(),
    });

    if (navigator.geolocation) {
        let userMarker;
        navigator.geolocation.watchPosition(function(position) {
            let lat = position.coords.latitude;
            let lng = position.coords.longitude;

            // ✅ Update location in Firebase continuously
            set(ref(database, `drivers/${id}`), {
                lat: lat,
                lng:  lng,
                timestamp: Date.now(),
                type,
                number,
                name,
                mobile

            }).catch((error) => {
                console.error("Failed to update location:", error);
            });

            if (!userMarker) {
                userMarker = L.marker([lat, lng]).addTo(map)
                    .bindPopup("📍 You are here")
                    .openPopup();
            } else {
                userMarker.setLatLng([lat, lng]);
            }
            map.setView([lat, lng], 15);
        }, function(err){
            alert("Could not get your location. Allow location access.");
        }, { enableHighAccuracy: true, maximumAge: 0 });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

document.getElementById("btnLogout").addEventListener("click", async function (e) {
    e.preventDefault();
    localStorage.removeItem("userID");
    // Get token from cookies
    const cookies = Object.fromEntries(document.cookie.split("; ").map(c => c.split("=")));
    const token = cookies.token;


    if (!token) {
        document.cookie = "token=; path=/; max-age=0";
        window.location.href = "index.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/auth/logout", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (response.ok) {
            // Remove cookie
            document.cookie = "token=; path=/; max-age=0";
            const data = await response.json().catch(() => ({}));
            alert(data.message || "Logout successful");

            // Redirect after short delay
            setTimeout(() => {
                window.location.href = "../index.html";

            }, 500);
        } else {
            const errorText = await response.text();
            console.error("Logout failed:", errorText);
        }
    } catch (error) {
        console.error("Logout failed:", error);
    }
});

document.getElementById('btnComplete').addEventListener('click',()=>{
    document.getElementById('staticsSection').style.display = 'none';
    document.getElementById('statusSection').style.display = 'none';
    document.getElementById('rideSection').style.display = 'none';
    document.getElementById('personalInfo').style.display = "block";
    document.getElementById('profileSection').style.display = "none";
    document.getElementById('profileTitle').style.display = "none";
    setTimeout(() => {
        document.getElementById('personalInfo').scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
    const modalEl = document.getElementById('completeProfileModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
});

