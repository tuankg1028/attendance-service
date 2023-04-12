# Attendance System
This project is a web application for managing attendance records. It allows users to view and track attendance data for students, and filter the data by day, week, or month.


## Proud Features

- API for recording attendances
- Web dashboard for displaying attendance metrics
- Real-time updates for attendance data with filters by day/week/month
- Automated generate attendance data aggregation using cron jobs

## Prerequisites
Before you begin, make sure you have the following installed on your machine:

- Node.js >= 14
- npm >= 0.38

## Installation

### Backend

1. Clone the repository
```
git clone https://github.com/tuankg1028/attendance-service.git
```
2. Navigate to the `be` directory of the cloned repository:
```
cd your-repo/be
```
3. Set environment variables by creating a .env file based on the example .env.example file
4. Install dependencies:
```
npm install
```
5. Build the production-ready files, run:
```
npm run build
```
6. Start the server:
```
npm start
```

### Frontend

1. Clone the repository
```
git clone https://github.com/tuankg1028/attendance-service.git
```
2. Navigate to the `fe` directory of the cloned repository:
```
cd your-repo/fe
```
3. Set environment variables by creating a .env file based on the example .env.example file
4. Install dependencies: 
```
npm install
```
5. Start the client: 
```
npm start
```

## Development

<b>During development, you can use the following command to start the server with Babel and Babel-Watch:</b>
```
npm run dev
```
This will start the server with Babel and automatically restart it whenever you make changes to the code.

<b>To use Docker for development, you'll need to have Docker and Docker Compose installed on your machine. Once you have those installed, run the following command to start the Docker containers:</b>
```
docker-compose up
```

## Populating Fake Data

To populate the database with fake data for testing purposes, you can use the following command:
```
cd be && npm run fake-data
```
This will generate and insert fake attendance data into the database.


## Incomplete Features

None

## Technical Documentation

- [Specification Documents](https://docs.google.com/document/d/1g_rYV0DNfTej5nZtLxe4f005DIS62-dLA0-7HcVYT2M/edit?usp=share_link)

