🚖 JustRide – Taxi Booking System
Project Description

JustRide is a web-based taxi booking system designed to make finding rides fast, simple, and secure. The platform connects passengers, drivers, and admins to manage ride bookings efficiently.

Key Objectives:

Convenience: Quick booking for passengers and easy ride management for drivers.

Safety & Security: Verified drivers and secure authentication using JWT tokens.

Real-time Updates: Live ride tracking and status updates.

Transparency: Admin dashboard with full monitoring of rides and drivers.

Target Users:

Passengers: Book taxis, track rides, and view ride details.

Drivers: Accept rides, update availability, and track earnings.

Admins: Verify drivers, monitor rides, and manage the system.


![](C:\Users\Vihanga Sathsara\Desktop\Capture.PNG)

![](C:\Users\Vihanga Sathsara\Desktop\Capture1.PNG)

![](C:\Users\Vihanga Sathsara\Desktop\Capture2.PNG)

![](C:\Users\Vihanga Sathsara\Desktop\Capture3.PNG)

![](C:\Users\Vihanga Sathsara\Desktop\Capture4.PNG)

![](C:\Users\Vihanga Sathsara\Desktop\Capture5.PNG)

Features Overview
🔹 Passenger Features

Sign up / login using credentials or Google account

Book rides with pickup & drop-off locations

View nearby taxis with distance, fare, taxi number, driver name, and mobile number

Track rides in real-time

View past ride history

🔹 Driver Features

Sign up / login with profile verification

Upload documents for admin approval

Accept or decline ride requests

Monitor ride requests and passenger details

Start earning after verification

🔹 Admin Features

Verify new drivers (accept or decline)

Monitor all ride details in real-time

Track active drivers and their locations

View statistics for passengers and drivers

Tech Stack
Layer	Technology / Tool
Backend	Java, Spring Boot, Hibernate (JPA), MySQL
Frontend	HTML5, CSS3, Bootstrap 5, JavaScript
Authentication	Spring Security with JWT
Database	MySQL 8.0+
Build Tool	Maven
Setup Instructions
Prerequisites

Java 17+

Maven

MySQL 8.0+

Node.js (optional for frontend tooling)

Backend Setup

Clone the repository:

git clone https://github.com/Vihanga-Sathsara/JustRide.git
cd JustRide


Configure application.properties with your MySQL credentials:

spring.datasource.url=jdbc:mysql://localhost:3306/justride
spring.datasource.username=root
spring.datasource.password=yourpassword
jwt.secret=YourSecretKeyHere


Install dependencies and run:

mvn clean install
mvn spring-boot:run

Frontend Setup

Open the frontend folder and serve index.html in a browser.

Use Live Server (VS Code) or

python -m http.server 3000 or

npx http-server -p 3000

Access at: http://localhost:3000

Demo Video

🎥 Watch the JustRide system in action:
📺 JustRide Taxi Booking System Demo

The video showcases:

Passenger and driver signup/login (including Google login)

Booking rides and real-time tracking

Admin dashboard and driver verification

Ride fare, distance, driver info display

Real-time monitoring of active drivers

Contact

Project Developer: Vihanga Sathsara

Email: sathsaravihanga27.com


GitHub: @Vihanga-Sathsara

⭐ If you found this project helpful, please give it a star! ⭐