CREATE DATABASE IF NOT EXISTS `TransportHub_Complete`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `TransportHub_Complete`;

CREATE TABLE IF NOT EXISTS roles (
  role_id CHAR(36) NOT NULL PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
  user_id CHAR(36) NOT NULL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  account_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS role_assign (
  user_id CHAR(36) NOT NULL,
  role_id CHAR(36) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_role_assign_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_role_assign_role FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS customers (
  customer_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  mobile_number VARCHAR(20) NOT NULL,
  password VARCHAR(255) NULL,
  city VARCHAR(100) NULL,
  address VARCHAR(255) NULL,
  account_status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS transporters (
  transporter_id CHAR(36) NOT NULL PRIMARY KEY,
  transporter_name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  mobile_number VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'TRANSPORTER',
  business_name VARCHAR(150) NULL,
  business_address VARCHAR(255) NULL,
  city VARCHAR(100) NULL,
  account_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS vehicles (
  vehicle_id CHAR(36) NOT NULL PRIMARY KEY,
  transporter_id CHAR(36) NOT NULL,
  vehicle_number VARCHAR(20) NOT NULL UNIQUE,
  vehicle_type VARCHAR(50) NOT NULL,
  capacity DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_vehicle_transporter FOREIGN KEY (transporter_id) REFERENCES transporters(transporter_id) ON DELETE RESTRICT,
  INDEX idx_vehicles_transporter_status (transporter_id, status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS drivers (
  driver_id CHAR(36) NOT NULL PRIMARY KEY,
  transporter_id CHAR(36) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  license_number VARCHAR(50) NOT NULL,
  vehicle_id CHAR(36) NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_driver_transporter FOREIGN KEY (transporter_id) REFERENCES transporters(transporter_id) ON DELETE CASCADE,
  CONSTRAINT fk_driver_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE SET NULL,
  UNIQUE KEY uq_driver_license_per_transporter (transporter_id, license_number),
  INDEX idx_drivers_transporter_status (transporter_id, status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bookings (
  booking_id CHAR(36) NOT NULL PRIMARY KEY,
  booking_number VARCHAR(30) NOT NULL UNIQUE,
  customer_id BIGINT UNSIGNED NOT NULL,
  transporter_id CHAR(36) NULL,
  vehicle_id CHAR(36) NULL,
  driver_id CHAR(36) NULL,
  pickup_location VARCHAR(255) NOT NULL,
  delivery_location VARCHAR(255) NOT NULL,
  goods_type VARCHAR(100) NOT NULL,
  weight_tonnes DECIMAL(10,2) NOT NULL,
  vehicle_type VARCHAR(50) NOT NULL,
  pickup_date DATE NOT NULL,
  amount DECIMAL(12,2) NULL,
  status ENUM('PENDING','ACCEPTED','REJECTED','CONFIRMED','IN_TRANSIT','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  customer_note TEXT NULL,
  cancellation_reason VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_booking_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE RESTRICT,
  CONSTRAINT fk_booking_transporter FOREIGN KEY (transporter_id) REFERENCES transporters(transporter_id) ON DELETE SET NULL,
  CONSTRAINT fk_booking_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id) ON DELETE SET NULL,
  CONSTRAINT fk_booking_driver FOREIGN KEY (driver_id) REFERENCES drivers(driver_id) ON DELETE SET NULL,
  INDEX idx_booking_customer_created (customer_id, created_at),
  INDEX idx_booking_transporter_status (transporter_id, status),
  INDEX idx_booking_status_date (status, pickup_date)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS booking_status_history (
  history_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  booking_id CHAR(36) NOT NULL,
  changed_by_type ENUM('CUSTOMER','TRANSPORTER','ADMIN','SYSTEM') NOT NULL,
  changed_by_id VARCHAR(64) NULL,
  old_status VARCHAR(20) NULL,
  new_status VARCHAR(20) NOT NULL,
  note VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_booking_history_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
  INDEX idx_booking_history_booking_date (booking_id, created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS booking_offers (
  offer_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  booking_id CHAR(36) NOT NULL,
  transporter_id CHAR(36) NOT NULL,
  status ENUM('ACCEPTED','REJECTED') NOT NULL,
  response_note VARCHAR(255) NULL,
  responded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_offer_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
  CONSTRAINT fk_offer_transporter FOREIGN KEY (transporter_id) REFERENCES transporters(transporter_id) ON DELETE CASCADE,
  UNIQUE KEY uq_offer_transporter_booking (booking_id, transporter_id),
  INDEX idx_offer_transporter_status (transporter_id, status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reviews (
  review_id CHAR(36) NOT NULL PRIMARY KEY,
  booking_id CHAR(36) NOT NULL,
  customer_id BIGINT UNSIGNED NOT NULL,
  transporter_id CHAR(36) NOT NULL,
  rating TINYINT UNSIGNED NOT NULL,
  review_text VARCHAR(1000) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_review_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE CASCADE,
  CONSTRAINT fk_review_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE RESTRICT,
  CONSTRAINT fk_review_transporter FOREIGN KEY (transporter_id) REFERENCES transporters(transporter_id) ON DELETE RESTRICT,
  CONSTRAINT uq_review_one_per_booking UNIQUE (booking_id),
  CONSTRAINT chk_review_rating CHECK (rating BETWEEN 1 AND 5),
  INDEX idx_reviews_transporter_date (transporter_id, created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payments (
  payment_id CHAR(36) NOT NULL PRIMARY KEY,
  booking_id CHAR(36) NOT NULL,
  customer_id BIGINT UNSIGNED NOT NULL,
  transporter_id CHAR(36) NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'INR',
  payment_method VARCHAR(30) NULL,
  transaction_reference VARCHAR(100) NULL,
  status ENUM('PENDING','PROCESSING','PAID','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE RESTRICT,
  CONSTRAINT fk_payment_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE RESTRICT,
  CONSTRAINT fk_payment_transporter FOREIGN KEY (transporter_id) REFERENCES transporters(transporter_id) ON DELETE SET NULL,
  UNIQUE KEY uq_payment_reference (transaction_reference),
  INDEX idx_payments_transporter_status (transporter_id, status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS transporter_documents (
  document_id CHAR(36) NOT NULL PRIMARY KEY,
  transporter_id CHAR(36) NOT NULL,
  document_type VARCHAR(50) NOT NULL,
  document_number VARCHAR(100) NOT NULL,
  file_url VARCHAR(500) NULL,
  status ENUM('PENDING','VERIFIED','REJECTED') NOT NULL DEFAULT 'PENDING',
  rejection_note VARCHAR(255) NULL,
  uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  CONSTRAINT fk_document_transporter FOREIGN KEY (transporter_id) REFERENCES transporters(transporter_id) ON DELETE CASCADE,
  INDEX idx_documents_transporter_status (transporter_id, status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS app_settings (
  setting_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  owner_type ENUM('ADMIN','CUSTOMER','TRANSPORTER') NOT NULL,
  owner_id VARCHAR(64) NOT NULL,
  setting_key VARCHAR(80) NOT NULL,
  setting_value JSON NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_settings_owner_key (owner_type, owner_id, setting_key)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS inventory_items (
  item_id CHAR(36) NOT NULL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  category VARCHAR(100) NOT NULL,
  quantity DECIMAL(12,2) NOT NULL DEFAULT 0,
  unit VARCHAR(30) NOT NULL,
  location VARCHAR(150) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_inventory_name (name), INDEX idx_inventory_category (category)
) ENGINE=InnoDB;

INSERT IGNORE INTO roles (role_id, role_name) VALUES
  ('00000000-0000-4000-8000-000000000001', 'SUPER_ADMIN'),
  ('00000000-0000-4000-8000-000000000002', 'ADMIN'),
  ('00000000-0000-4000-8000-000000000003', 'OPERATIONS');
