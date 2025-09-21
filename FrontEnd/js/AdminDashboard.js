document.addEventListener('DOMContentLoaded', () => {
    barchart();
    ridesBarchart();
    initMaps();
    loadAllRides();
    loadAllDrivers();
    loadAllPassengers();
    populateVehicleTypes();
});

import {database, onValue, ref} from './firebase.js';

let taxiMarkersMap1 = {};
let taxiMarkersMap2 = {};
let map1, map2;

function initMaps() {

    map1 = L.map('mapView').setView([6.9271, 79.8612], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
    }).addTo(map1);


    map2 = L.map('mapViewLarge').setView([6.9271, 79.8612], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
    }).addTo(map2);

    subscribeDrivers();
}

function subscribeDrivers() {
    const driversRef = ref(database, 'drivers');

    onValue(driversRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        Object.entries(data).forEach(([driverId, driver]) => {
            if (driver.lat && driver.lng) {
                const newLatLng = [driver.lat, driver.lng];

                if (taxiMarkersMap1[driverId]) {
                    taxiMarkersMap1[driverId].setLatLng(newLatLng);
                } else {
                    taxiMarkersMap1[driverId] = L.marker(newLatLng)
                        .addTo(map1)
                        .bindPopup(`🚕 Taxi - ${driverId}`);
                }


                if (taxiMarkersMap2[driverId]) {
                    taxiMarkersMap2[driverId].setLatLng(newLatLng);
                } else {
                    taxiMarkersMap2[driverId] = L.marker(newLatLng)
                        .addTo(map2)
                        .bindPopup(`🚕 Taxi - ${driverId}`);
                }
            }
        });
    });
}

function barchart() {
    const ctx = document.getElementById('earningsChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{
                label: 'Earnings ($)',
                data: [500, 700, 400, 1900, 800],
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

function ridesBarchart() {
    const ctx = document.getElementById('ridesChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{
                label: 'Earnings ($)',
                data: [500, 700, 400, 1900, 800],
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
document.getElementById("liveTracking").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById('largeMapView').style.display = 'block';
    document.getElementById("largeMapView").scrollIntoView({
        behavior: "smooth"
    });
    map2.invalidateSize();
});

document.getElementById("ridesDetails").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById('ridesView').style.display = 'block';
    document.getElementById("ridesView").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("driverManagement").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById('driverView').style.display = 'block';
    document.getElementById("driverView").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("passengerManagement").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById('passengerView').style.display = 'block';
    document.getElementById("passengerView").scrollIntoView({
        behavior: "smooth"
    });
});

document.getElementById("addMember").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById('addMembersSection').style.display = 'block';
    document.getElementById("addMembersSection").scrollIntoView({
        behavior: "smooth"
    });
});

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

const token = getCookie('token');
if (token) {
    const payload = parseJwt(token);
    if (payload && payload.exp) {
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

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

async function loadAllRides() {
    try {
        const res = await fetch("http://localhost:8080/auth/allRides", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const result = await res.json();
        console.log("Backend response:", result);

        const ridesContainer = document.getElementById("ridesContainer");

        ridesContainer.innerHTML = ""; // clear previous

        if (!result.data || result.data.length === 0) {
            const emptyDiv = document.createElement("div");
            emptyDiv.style.minHeight = "500px";
            emptyDiv.style.textAlign = "center";
            emptyDiv.style.alignContent = "center";
            emptyDiv.innerHTML = `<h4 class="noResult">No rides found 🚫</h4>`;
            ridesContainer.appendChild(emptyDiv);
            return;
        }

        result.data.forEach(ride => {
            const rideDiv = document.createElement("div"); // create new div for each ride
            rideDiv.classList.add("ride-card");

            rideDiv.innerHTML = `
                <h4>🚕 Ride</h4>
                <p><b>Driver ID:</b> ${ride.driverId}</p>
                <p><b>Passenger ID:</b> ${ride.passengerId}</p>
                <p><b>Pickup:</b> ${ride.pickupLocation} at ${ride.pickupTime}</p>
                <p><b>Drop-off:</b> ${ride.dropOffLocation} at ${ride.dropOffTime}</p>
                <p><b>Date:</b> ${ride.date}</p>
                <p><b>Fare:</b> Rs. ${ride.fare}</p>
                <p><b>Status:</b> ${ride.status}</p>
            `;
            ridesContainer.appendChild(rideDiv);
        });

    } catch (err) {
        console.error("Error fetching rides:", err);
        alert("Error loading rides");
    }
}


async function loadAllDrivers(){
    try {
        const res = await fetch("http://localhost:8080/auth/Driver", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const result = await res.json();
        const driverDiv = document.getElementById('driverDiv');
        const emptyState = document.getElementById('emptyState');

        driverDiv.innerHTML = "";
        const selectedFilter = document.getElementById("driver-filter").value;
        for (const driver of result.data) {
            if (driver.length === 0){
                emptyState.style.display = "block";
                return;
            }

            emptyState.style.display = "none";
            const initial = driver.fullName.charAt(0);
            const driversDiv = document.createElement("div");
            driversDiv.classList.add("driver-card");
            driversDiv.setAttribute("data-driver-id", driver.id);
            let driverInfo ="";
            if (driver.password === null) {
                driverInfo +=` <div>
                    <p>Deleted Account</p>
                </div>`
            }
            driverInfo = `
                         <div class="driver-header-card">
                                <div class="driver-id">${driver.id}</div>
                                <div class="driver-avatar">${initial}</div>
                            </div>
                            <div class="driver-info">
                                <div class="info-item">
                                    <div class="info-icon"><i class="fas fa-user"></i></div>
                                    <div class="info-text"><b>Name:</b> ${driver.fullName}</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-icon"><i class="fas fa-envelope"></i></div>
                                    <div class="info-text"><b>Email:</b> ${driver.gmail}</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-icon"><i class="fas fa-phone"></i></div>
                                  <div class="info-text">
                    `;

            if (driver.mobileNumber === null || driver.mobileNumber === "94000000000") {
                driverInfo += `<b>Mobile:</b> <span class="mobile-warning">Not Set</span>`;
            } else {
                driverInfo += `<b>Mobile:</b> ${driver.mobileNumber}`;
            }


            driverInfo += `</div></div>`;
            let status = null;
            try {
                const response = await fetch("http://localhost:8080/profile/personalDetails", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ id: driver.id })
                });

                if (response.ok) {
                    const details = await response.json();
                    console.log("✅ Personal Details:", details);
                    status = details.status;
                    driverInfo += `
                        <div class="additional-details">
                            <p><b>IDentity Card Number:</b> ${details.identityCardNumber}</p>
                            <p><b>License Card Number: </b> ${details.licenseCardNumber}</p>
                            <p><b>Address:             </b> ${details.address}</p>
                            <p><b>Working District:    </b> ${details.workingDistrict}</p>
                            <p><b>Driver Type:         </b> ${details.workingType}</p>
                            <p class="driverStatus"><b>Driver Status:      </b> ${details.status}</p>
                        </div>
                    `;
                }
            } catch (e) {
                console.error("Error fetching personal details:", e);
            }

            try {
                const response = await fetch("http://localhost:8080/vehicle/details", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ id: driver.id })
                });

                if (response.ok) {
                    const details = await response.json();
                    console.log("✅ Vehicle Details:", details);
                    driverInfo += `
                        <div class="additional-details">
                            <p><b>Vehicle Number:</b> ${details.vehicleNumber}</p>
                            <p><b>Vehicle Type:</b> ${details.type}</p>
                            <p><b>Make:</b> ${details.make}</p>
                            <p><b>Model:</b> ${details.model}</p>
                        </div>
                    `;
                }
            } catch (e) {
                console.error("Error fetching personal details:", e);
            }

            if (status === "verified" ){
                driverInfo += `
                            </div>
                        </div>
                    </div>
                    <div class="driver-actions">
                        <button class="btn-remove" onclick="deleteUser('${driver.id}')">
                            <i class="fas fa-trash-alt"></i> Remove Driver
                        </button>
                    </div>
            `;
            }else {
                driverInfo += `
                            </div>
                        </div>
                    </div>
                    <div class="driver-actions">
                        <button class="btn-secondary" onclick="acceptUser('${driver.id}')">
                            <i class="fas fa-trash-alt"></i> Accept Driver
                        </button>
                        <button class="btn-remove" onclick="acceptUser('${driver.id}')">
                            <i class="fas fa-trash-alt"></i> Decline Driver
                        </button>
                    </div>
            `;
            }


            if (selectedFilter === "verified" && status !== "verified") {
                continue;
            }
            if (selectedFilter === "pending" && status === "verified") {
                continue;
            }

            driversDiv.innerHTML = driverInfo;

            driverDiv.appendChild(driversDiv);


        }
    }catch(e){
        console.error("Error fetching rides:", e);
        alert("Error loading drivers");
    }
}
document.getElementById("driver-filter").addEventListener("change", function() {
    loadAllDrivers();
});
window.deleteUser = deleteUser;
window.acceptUser = acceptUser;


document.addEventListener("change", function (e) {
    if (e.target.classList.contains("driver-dropdown")) {
        const action = e.target.value;
        const driverId = e.target.getAttribute("data-driver-id");
        const status = e.target.getAttribute("data-status");

        if (action === "view") {
            if (status === "verified") {
                alert("👀 Viewing driver " + driverId);
            } else {
                alert("⚠️ Driver is not verified yet!");
            }
        }

        e.target.value = "";
    }
});


async function acceptUser(id){
    if (!confirm("Are you sure you want to accept this driver?")) return;

    try {
        const response = await fetch(`http://localhost:8080/profile/${id}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if (result.code === 200) {
            alert("✅ " + result.data);
            await loadAllDrivers();
        } else {
            alert("❌ " + result.data);
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        alert("⚠️ Error updating user");
    }
}

async function loadAllPassengers(){
    try {
        const res = await fetch("http://localhost:8080/auth/Passenger", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        const result = await res.json();
        console.log("✅ Passenger Details:", result.data);
        const passengerDiv = document.getElementById('passengerDiv');
        const emptyPassengerState = document.getElementById('emptyPassengerState');
        passengerDiv.innerHTML = "";
        if (!result.data || result.data.length === 0){
            emptyPassengerState.style.display = "block";
            return;
        }
        emptyPassengerState.style.display = "none";
        for (const passenger of result.data) {

            const passengerInitial = passenger.fullName.charAt(0);
            const passengersDiv = document.createElement("passDiv");
            passengersDiv.classList.add("driver-card");
            passengersDiv.setAttribute("data-driver-id", passenger.id);
            let passengerInfo = `
                         <div class="driver-header-card">
                                <div class="driver-id">${passenger.id}</div>
                                <div class="driver-avatar">${passengerInitial}</div>
                            </div>
                            <div class="driver-info">
                                <div class="info-item">
                                    <div class="info-icon"><i class="fas fa-user"></i></div>
                                    <div class="info-text"><b>Name:</b> ${passenger.fullName}</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-icon"><i class="fas fa-envelope"></i></div>
                                    <div class="info-text"><b>Email:</b> ${passenger.gmail}</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-icon"><i class="fas fa-phone"></i></div>
                                  <div class="info-text">
                    `;

            if (passenger.mobileNumber === null || passenger.mobileNumber === "94000000000") {
               passengerInfo += `<b>Mobile:</b> <span class="mobile-warning">Not Set</span>`;
            } else {
                passengerInfo += `<b>Mobile:</b> ${passenger.mobileNumber}`;
            }

            passengerInfo += `
                            </div>
                        </div>
                    </div>
                    <div class="driver-actions">
                        <button class="btn-remove" onclick="deleteUser('${driver.id}')">
                            <i class="fas fa-trash-alt"></i> Remove Driver
                        </button>
                    </div>
            `;

           passengersDiv.innerHTML = passengerInfo;
           passengerDiv.appendChild(passengersDiv);
        }
    }catch (e){
        console.error("Error fetching :", e);
        alert("Error loading passengers");
    }
}


async function deleteUser(id) {
    if (!confirm("Are you sure you want to remove this driver?")) return;

    try {
        const response = await fetch(`http://localhost:8080/auth/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if (result.code === 200) {
            alert("✅ " + result.data);
            document.querySelector(`[data-driver-id="${id}"]`)?.remove();
        } else {
            alert("❌ " + result.data);
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        alert("⚠️ Error deleting user");
    }
}

document.getElementById('btnAddMember').addEventListener('click', function(event) {
    event.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const gmail = document.getElementById('floatingEmail').value;
    const mobileNumber = document.getElementById('mobileNumber').value;
    const password  = document.getElementById('floatingPassword').value;
    const confirmPassword = document.getElementById('floatingConfirmPassword').value;
    const role = "ADMIN";

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

document.getElementById('btnAddFare').addEventListener('click', function(event) {
    event.preventDefault();
    const vehicleType = document.getElementById('vehicleType').value;
    const baseFare = parseFloat(document.getElementById('baseFare').value);
    const perKMRate = parseFloat(document.getElementById('perKMRate').value);

    const values = {
        vehicleType: vehicleType,
        baseFare: baseFare,
        perKMRate:perKMRate
    }
    fetch("http://localhost:8080/fare/values", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values)
    }).then(response => response.json()).then(result => {
        if (result.code === 200) {
            alert("✅ " + result.data);
        } else {
            alert("❌ " + result.data);
        }
    }).catch(error => {
        alert(error.message);
    });
});


function populateVehicleTypes(){
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