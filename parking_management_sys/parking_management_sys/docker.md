# Docker Setup Instructions

This document explains how to deploy the Parking Management System using Docker and Docker Compose.

## Prerequisites

- Docker Engine (version 20.10.0 or later)
- Docker Compose (version 2.0.0 or later)
- Git (to clone the repository)

## File Structure

Ensure you have the following files in your project directory:

```
parking-management-sys/
├── src/                      # Your application source code
├── Dockerfile                # For building the application container
├── docker-compose.yml        # For orchestrating app and database containers
├── init-db/                  # Database initialization scripts
│   └── init-db.sql           # SQL script for initial data 
├── application-prod.properties # Production configuration
└── pom.xml                   # Maven configuration file
```

## Configuration

### 1. Create Required Directories

```bash
mkdir -p logs init-db
```

### 2. Add PostgreSQL Driver to pom.xml

Ensure your pom.xml includes the PostgreSQL driver dependency:

```xml
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

### 3. Copy Configuration Files

Place the `application-prod.properties` file in your `src/main/resources` directory.

Place the `init-db.sql` file in the `init-db` directory.

## Running with Docker Compose

### 1. Build and Start Containers

```bash
docker-compose up -d
```

This command:
- Builds the application image
- Creates and starts both app and PostgreSQL containers
- Sets up the network between containers
- Mounts volumes for data persistence

### 2. Check Container Status

```bash
docker-compose ps
```

### 3. View Application Logs

```bash
docker-compose logs -f app
```

### 4. Stop and Remove Containers

```bash
docker-compose down
```

To remove volumes as well (this will delete all database data):

```bash
docker-compose down -v
```

## Accessing the Application

- **Web Interface**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **API Documentation**: http://localhost:8080/api-docs

## Database Access

You can connect to the PostgreSQL database using:

- **Host**: localhost
- **Port**: 5432
- **Database**: parking_db
- **Username**: postgres
- **Password**: postgres

## Default Users

Two default users are created:

1. **Admin**
   - Username: admin
   - Password: admin123

2. **Staff**
   - Username: staff
   - Password: staff123

## Environment Variables

You can customize the deployment by changing environment variables in the docker-compose.yml file:

| Variable | Description | Default |
|----------|-------------|---------|
| SERVER_PORT | Application port | 8080 |
| SPRING_PROFILES_ACTIVE | Active profile | prod |
| SPRING_DATASOURCE_URL | Database connection URL | jdbc:postgresql://postgres:5432/parking_db |
| SPRING_DATASOURCE_USERNAME | Database username | postgres |
| SPRING_DATASOURCE_PASSWORD | Database password | postgres |
| SPRING_JPA_HIBERNATE_DDL_AUTO | Schema generation strategy | update |

## Production Considerations

For a production deployment:

1. **Change default passwords** in docker-compose.yml
2. **Set up a reverse proxy** (e.g., Nginx) with SSL
3. **Configure regular database backups**
4. **Set up monitoring** for both app and database containers
5. **Use Docker Swarm or Kubernetes** for orchestration in large deployments