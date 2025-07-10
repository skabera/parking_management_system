# Parking Management System

A comprehensive system for managing parking reservations, drivers, payments, and user authentication.

![Parking Management System](./Screenshot%202025-03-15%20at%2010.38.36.png)

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Setup and Installation](#setup-and-installation)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Component Overview](#component-overview)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Reservation Management**: Create, update, and manage parking spot reservations
- **Driver Management**: Register and track drivers with vehicle information
- **Payment Processing**: Handle payments with multiple payment methods
- **User Authentication**: Secure role-based access with admin and staff permissions
- **Parking Spot Management**: Monitor availability and occupancy of parking spots
- **Reporting**: Generate statistics and reports on usage and revenue
- **API Documentation**: Comprehensive Swagger documentation
- **Security**: Spring Security with password hashing

## Technology Stack

- **Backend**: Spring Boot 3.x
- **Database**: MySQL/PostgreSQL with JPA/Hibernate
- **Security**: Spring Security (Form-based + Token-based authentication)
- **Documentation**: OpenAPI 3.0 (Swagger)
- **Build Tool**: Maven
- **Testing**: JUnit 5, Mockito

## Setup and Installation

### Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL/PostgreSQL

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/parking-management-sys.git
   cd parking-management-sys
   ```

2. **Configure database**
   - Create a database named `parking_db`
   - Update `application.properties` with your database credentials

3. **Build the application**
   ```bash
   mvn clean install
   ```

4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

5. **Access the application**
   - API: http://localhost:8080/api
   - Swagger UI: http://localhost:8080/swagger-ui.html

## API Documentation

The API is documented using Swagger/OpenAPI. Once the application is running, you can access the documentation at:

```
http://localhost:8080/swagger-ui.html
```

### Key Endpoints

- **Authentication**: `/api/auth/login`, `/api/auth/register`
- **Reservations**: `/api/reservations`
- **Drivers**: `/api/drivers`
- **Payments**: `/api/payments`
- **Parking Spots**: `/api/spots`
- **Users**: `/api/users` (Admin only)

## Authentication

The system uses token-based authentication:

1. **Login/Register**: Call the authentication endpoint to receive a token
2. **Use Token**: Include the token in subsequent requests:
   - As a header: `Authorization: Bearer your-token`
   - Or as a parameter: `?token=your-token`

### Default Users

Two default users are created on first run:

- **Admin**: username: `admin`, password: `admin123`
- **Staff**: username: `staff`, password: `staff123`

## Component Overview

### Reservations

The reservation system allows booking parking spots for specific time periods:

- Check availability before creating reservations
- Prevent double-booking through overlapping reservation detection
- Support for cancellation and completion workflows

### Drivers

The driver management system tracks individuals who park vehicles:

- Register drivers with contact information
- Track vehicles by license plate
- Search and filter driver information

### Payments

The payment system handles financial transactions:

- Support for multiple payment methods
- Status tracking (pending, completed, refunded)
- Integration with reservation system

### Security

Role-based access control separates privileges:

- **ADMIN**: Full access to all features
- **STAFF**: Limited to reservation and driver management

## Database Schema

The system uses the following key tables:

- `users`: System users with authentication information
- `drivers`: Driver information and contact details
- `parking_spots`: Available parking locations
- `reservations`: Bookings linking drivers to parking spots
- `payments`: Financial transactions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Troubleshooting

### Common Issues

#### Authentication Problems

If you're having trouble with authentication:

1. Ensure you're using the correct token format (`Bearer your-token`)
2. Check that your token hasn't expired (tokens expire after 30 minutes)
3. Verify you have the appropriate role for the endpoint you're accessing

#### Database Connection Issues

If you encounter database connection problems:

1. Check your database credentials in `application.properties`
2. Ensure your database server is running
3. Verify the database user has appropriate permissions

## Deployment

### Production Considerations

When deploying to production:

1. Enable HTTPS by configuring SSL in `application.properties`
2. Use environment variables for sensitive configuration
3. Configure a more secure password encoder (bcrypt with higher strength)
4. Set up proper database connection pooling

### Docker Deployment

A Dockerfile is provided for containerized deployment:

```bash
docker build -t parking-management-system .
docker run -p 8080:8080 -e SPRING_PROFILES_ACTIVE=prod parking-management-system
```