import { database, ref, onValue } from "./firebase.js";

document.addEventListener('DOMContentLoaded', () => {
    catchCookie();
    findTaxi();
    loadPassengerMap();
    loadPassengerRides();

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
});



let currentLocation = null;
let pickUpLocation = null;
let dropLocation = null;
let locationType = "pickUp";
let lat;
let lng
let map;
let taxiMarkers = {};
let totalFare = null;
let distance ;

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

function loadPassengerMap() {
    map = L.map('map').setView([6.9271, 79.8612], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
    }).addTo(map);

    let pickupMarker = null;
    let dropMarker = null;


    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function (position) {
                lat = position.coords.latitude;
                lng = position.coords.longitude;

            currentLocation = [lat, lng];
            L.marker([lat, lng]).addTo(map)
                .bindPopup("📍 You are here")
                .openPopup();
            map.setView([lat, lng], 19);
        }, function (err) {
            alert(err.message);
        });
    }

    const driversRef = ref(database, 'drivers');
    onValue(driversRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            Object.keys(data).forEach(id => {
                const driver = data[id];
                if (driver.lat && driver.lng) {

                    if (driver.lat === lat && driver.lng === lng) {
                        driver.lat = driver.lat + 0.00010;
                        driver.lng = driver.lng + 0.00010;
                    }

                    if (taxiMarkers[id]) {
                        taxiMarkers[id].setLatLng([driver.lat, driver.lng]);
                    } else {
                        taxiMarkers[id] = L.marker([driver.lat, driver.lng])
                            .addTo(map)
                            .bindPopup(`🚕 Taxi - ${driver.number}`);
                    }
                }
            });
        }
    });

    map.on('click', function (event) {

        if (locationType === "pickUp") {
            pickUpLocation = [event.latlng.lat, event.latlng.lng];
            setPick(pickUpLocation);
            if (pickupMarker) map.removeLayer(pickupMarker);
            pickupMarker = L.marker(pickUpLocation).addTo(map)
                .bindPopup("📍 Pick Up Location")
                .openPopup();
            map.setView(pickUpLocation, 15);
        } else if (locationType === "dropOff") {
            dropLocation = [event.latlng.lat, event.latlng.lng];
            setDrop(dropLocation);
            if (dropMarker) map.removeLayer(dropMarker);
            dropMarker = L.marker(dropLocation).addTo(map)
                .bindPopup("📍 Drop Off Location")
                .openPopup();
            map.setView(dropLocation, 15);
        }
    });

}

document.getElementById('btnPickup').addEventListener('click', (e) => {
    e.preventDefault();
    locationType = "pickUp";
    document.getElementById('mapDiv').style.display = 'block';
    map.invalidateSize();
});

document.getElementById('btnDrop').addEventListener('click', (e) => {
    e.preventDefault();
    locationType = "dropOff";
    document.getElementById('mapDiv').style.display = 'block';
    map.invalidateSize();
});

document.getElementById('btnBookNow').addEventListener('click', (e) => {
    const bookNowModal = new bootstrap.Modal(document.getElementById('nearbyTaxisModal'));
    bookNowModal.show();
});

document.getElementById('btnConfirmRide').addEventListener('click', (e) => {
    e.preventDefault();
    let driverId = "1";
    let  passengerId = "1";
    const now = new Date();
    const date = now.toISOString().split("T")[0];
    const pickupTime = now.toTimeString().split(" ")[0];
    let dropOffTime = null;
    const fareValue = parseFloat(document.getElementById('rideFare').innerText).toFixed(2);
    let Status = "pending";

    console.log(date,pickupTime,dropOffTime,fareValue,Status);


    if (pickUpLocation && dropLocation && date && pickupTime && fareValue && Status) {
        fetch(
            "http://localhost:8080/auth/ride", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    driverId,
                    passengerId,
                    pickupLocation:pickUpLocation.toString(),
                    dropOffLocation: dropLocation.toString(),
                    date,
                    pickupTime,
                    dropOffTime,
                    fareValue,
                    Status
                })
            }).then(response => response.json()).then(result => {
            if (result.status === "error") {
                alert("❌ " + result.data);
            } else {
                alert("✅ " + result.data);
            }
        }).catch(error => {
            alert(error.message);
        })
    }else{
        alert("Please Check the Password!");
    }
});

function catchCookie() {
    const cookies = Object.fromEntries(document.cookie.split("; ").map(c => c.split("=")) );
    console.log(cookies);
    if (cookies.token){ const playloadBase64 = cookies.token.split('.')[1]; console.log(playloadBase64);
        const decodePlayload = JSON.parse(atob(playloadBase64)); console.log(decodePlayload);
        const gmail= decodePlayload.sub;
        const role = decodePlayload.jobRole;
        console.log(role); console.log(gmail);

    }
}

let one;
let two;
function setPick(pickUpLocation){
    console.log(pickUpLocation);
    one = pickUpLocation;
}

function setDrop(dropLocation){
    console.log(dropLocation);
    two = dropLocation;
}


document.getElementById('btnSetTime').addEventListener('click', (event) => {
    event.preventDefault();
    const setTime = document.getElementById('timeInput');
    setTime.type = 'time';
    setTime.disabled = false;
    setTime.showPicker();
});


document.getElementById('hide').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('mapDiv').style.display = 'none';
});





function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function findTaxi() {
    const driversRef = ref(database, 'drivers');

    const loading = document.getElementById('loadingSection');
    const container = document.getElementById('taxisContainer');
    const noMsg = document.getElementById('noTaxisMessage');

    loading.style.display = 'flex';
    container.style.display = 'none';
    noMsg.style.display = 'none';

    onValue(driversRef, (snapshot) => {
        const data = snapshot.val();
        if (!data || !currentLocation) {
            setTimeout(() => {
                loading.style.display = 'none';
                noMsg.style.display = 'block';
            }, 1500);
            return;
        }

        const groupedTaxis = { bike: [], car: [], threewheel: [], van: [], lorry: [] };


        Object.keys(data).forEach(driverId => {
            const d = data[driverId];
            if (d.lat && d.lng && d.type && d.name && d.mobile && d.number) {
                const dist = getDistanceFromLatLonInKm(currentLocation[0], currentLocation[1], d.lat, d.lng);
                if (dist <= 2) {
                    const type = d.type.toLowerCase().replace(/\s+/g, '');
                    if (groupedTaxis[type]) {
                        groupedTaxis[type].push({
                            id: driverId,
                            name:d.name,
                            distance: dist,
                            details: d.number,
                            mobile:d.mobile
                        });
                    }
                }
            }
        });

        setTimeout(() => {
            displayTaxis(groupedTaxis);
        }, 1500);
    });
}

function displayTaxis(groupedTaxis) {
    const loading = document.getElementById('loadingSection');
    const container = document.getElementById('taxisContainer');
    const noMsg = document.getElementById('noTaxisMessage');

    container.innerHTML = '';
    loading.style.display = 'none';

    let hasTaxis = Object.values(groupedTaxis).some(arr => arr.length > 0);
    if (!hasTaxis) {
        noMsg.style.display = 'block';
        return;
    }

    noMsg.style.display = 'none';
    container.style.display = 'block';

    const icons = {
        bike: 'fa-motorcycle',
        car: 'fa-car',
        threewheel: 'fa-rickshaw',
        van: 'fa-shuttle-van',
        lorry: 'fa-truck'
    };

    Object.keys(groupedTaxis).forEach(type => {
        if (groupedTaxis[type].length > 0) {
            const section = document.createElement('div');
            section.className = 'vehicle-section mb-3 p-2 border rounded';

            section.innerHTML = `
                <div class="d-flex align-items-center mb-2">
                    <i class="fas ${icons[type] || 'fa-taxi'} me-2"></i>
                    <h6 class="m-0 flex-grow-1 text-capitalize">${formatType(type)}</h6>
                    <span class="badge bg-primary">${groupedTaxis[type].length}</span>
                </div>
            `;

            groupedTaxis[type].forEach(taxi => {
                const item = document.createElement('div');
                item.className = 'd-flex justify-content-between align-items-center border-top p-2';

                item.innerHTML = `
                    <div>
                        <p class="m-0 fw-bold">${taxi.details}</p>
                        <small class="text-muted">${formatDistance(taxi.distance.toFixed(2))} away</small>
                    </div>
                    <button class="btn btn-sm btn-primary">Select</button>
                `;


                item.querySelector('button').onclick = () => {


                    const modal = bootstrap.Modal.getInstance(document.getElementById('nearbyTaxisModal'));
                    modal.hide();
                    const id = taxi.id;
                    const number = taxi.details;
                    const name  = taxi.name;
                    const mobile = taxi.mobile;
                    const distance = taxi.distance;
                    const vehicleType = type;
                    console.log(id,number,name,vehicleType, distance);

                    assignDetails(id,number,name,vehicleType, distance,mobile);
                };

                section.appendChild(item);
            });

            container.appendChild(section);
        }
    });
}

function formatType(type) {
    if (type === 'threewheel') return 'Three Wheeler';
    return type.charAt(0).toUpperCase() + type.slice(1);
}

function formatDistance(dist) {
    if (dist < 1) {
        return `${Math.round(dist * 1000)} m`; // meters
    }
    return `${dist.toFixed(2)} km`; // kilometers
}

function assignDetails(id,number,name,vehicleType,distance,mobile){
    fetch(`http://localhost:8080/fare/${vehicleType}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => response.json()).then(result => {
        if (result.code === 200) {
            alert("✅ " + result.data);
            let baseFare = result.data.baseFare;
            let perKMRate = result.data.perKMRate;
            distance = getDistanceFromLatLonInKm(one[0], one[1],two[0],two[1]);

            let totalFare = (baseFare + (perKMRate * distance));

            const confirmModal = new bootstrap.Modal(document.getElementById('confirmRidesModal'));
            document.getElementById('vehicle').innerText = vehicleType;
            document.getElementById('vehicleNumber').innerText = number;
            document.getElementById('driverName').innerText = name;
            document.getElementById('mobileNumber').innerText = mobile;
            document.getElementById('rideKm').innerText  = distance.toFixed(2) + "km";
            document.getElementById('rideFare').innerText = totalFare.toFixed(2);
            confirmModal.show();
        } else {
            alert("❌ " + result.data);
        }
    }).catch(error => {
        alert(error.message);
    });
}

const id = localStorage.getItem("userID");
console.log(id);


async function loadPassengerRides() {
   const res= fetch(
        `http://localhost:8080/auth/allPassengerRides?passengerId=${id}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },


        });
    const result = await res.json();
    console.log("Backend response:", result);

    const ridesContainer = document.getElementById("ridesContainer");

    ridesContainer.innerHTML = ""; // clear previous

    if (!result.data || result.data.length === 0) {
       document.getElementById('emptyPassengerState').style.display = "block";
       return;
    }
    document.getElementById('emptyPassengerState').style.display = "none";
    result.data.forEach(ride => {
        const rideDiv = document.createElement("div"); //
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


}



