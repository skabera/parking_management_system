-- Create database if not exists (this is handled by Docker environment variables)

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create initial tables if they don't exist
-- (Note: Spring Hibernate will handle most of the schema, this is just for initial setup)

-- Create default admin and staff users if they don't exist
DO $$
BEGIN
    -- Check if users table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        -- Check if admin user exists
        IF NOT EXISTS (SELECT FROM users WHERE username = 'admin') THEN
            -- Create admin user with bcrypt hashed password 'admin123'
            INSERT INTO users (username, password, role) 
            VALUES ('admin', '$2a$10$rJS8KKYqzQGxx6CpXgY64eDTdvxpv6UtVEqUkWYKtXnoDN6C3JxUu', 'ADMIN');
        END IF;
        
        -- Check if staff user exists
        IF NOT EXISTS (SELECT FROM users WHERE username = 'staff') THEN
            -- Create staff user with bcrypt hashed password 'staff123'
            INSERT INTO users (username, password, role) 
            VALUES ('staff', '$2a$10$z9nGt5iAKPlA62p5nIcXROptpkrUlu5zY5Ci4Y7zZPGrU5p/sRAB2', 'STAFF');
        END IF;
    END IF;
END;
$$;

-- Create some initial parking spots if they don't exist
DO $$
BEGIN
    -- Check if parking_spots table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'parking_spots') THEN
        -- Add initial parking spots if the table is empty
        IF NOT EXISTS (SELECT FROM parking_spots LIMIT 1) THEN
            INSERT INTO parking_spots (spot_number, floor, section, status, spot_type, price_per_hour)
            VALUES 
                ('A-01', 1, 'A', 'AVAILABLE', 'STANDARD', 5.00),
                ('A-02', 1, 'A', 'AVAILABLE', 'STANDARD', 5.00),
                ('A-03', 1, 'A', 'AVAILABLE', 'STANDARD', 5.00),
                ('B-01', 1, 'B', 'AVAILABLE', 'COMPACT', 3.50),
                ('B-02', 1, 'B', 'AVAILABLE', 'COMPACT', 3.50),
                ('C-01', 2, 'C', 'AVAILABLE', 'PREMIUM', 8.00),
                ('C-02', 2, 'C', 'AVAILABLE', 'PREMIUM', 8.00),
                ('D-01', 2, 'D', 'AVAILABLE', 'HANDICAP', 5.00),
                ('D-02', 2, 'D', 'AVAILABLE', 'ELECTRIC', 7.50);
        END IF;
    END IF;
END;
$$;

-- Create demonstration data
DO $$
BEGIN
    -- Check if drivers table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'drivers') THEN
        -- Add demonstration drivers if table is empty
        IF NOT EXISTS (SELECT FROM drivers LIMIT 1) THEN
            INSERT INTO drivers (name, license_plate, phone_number, email, active)
            VALUES 
                ('John Doe', 'ABC123', '+1-555-123-4567', 'john.doe@example.com', true),
                ('Jane Smith', 'XYZ789', '+1-555-987-6543', 'jane.smith@example.com', true),
                ('Bob Johnson', 'DEF456', '+1-555-456-7890', 'bob.johnson@example.com', true);
        END IF;
    END IF;
END;
$$;