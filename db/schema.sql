-- Q-Link Veritabanı Şeması v2.0
-- MySQL 8.0 uyumlu

CREATE DATABASE IF NOT EXISTS qlink CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;
USE qlink;

CREATE TABLE IF NOT EXISTS tables (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  table_number  INT NOT NULL UNIQUE,
  qr_code       TEXT,
  capacity      INT NOT NULL DEFAULT 4,
  status        ENUM('bos','bekliyor','hazirlaniyor','hazir','teslim') NOT NULL DEFAULT 'bos',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id    INT PRIMARY KEY AUTO_INCREMENT,
  name  VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS menu_items (
  id                                  INT PRIMARY KEY AUTO_INCREMENT,
  category_id                         INT NOT NULL,
  name                                VARCHAR(200) NOT NULL,
  price                               DECIMAL(10,2) NOT NULL,
  description                         TEXT,
  image_url                           VARCHAR(500),
  estimated_service_minutes           INT,
  dynamic_estimated_service_minutes   INT,
  is_active                           TINYINT(1) NOT NULL DEFAULT 1,
  created_at                          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS users (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  name          VARCHAR(100) NOT NULL,
  role          ENUM('admin','waiter') NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone         VARCHAR(30),
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id                    INT PRIMARY KEY AUTO_INCREMENT,
  table_id              INT NOT NULL,
  order_no              INT NOT NULL,
  status                ENUM('alindi','hazirlaniyor','hazir','teslim') NOT NULL DEFAULT 'alindi',
  note                  TEXT,
  total_price           DECIMAL(10,2) NOT NULL,
  estimated_service_minutes INT,
  created_at            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  hazirlaniyor_at       TIMESTAMP NULL,
  hazir_at              TIMESTAMP NULL,
  teslim_at             TIMESTAMP NULL,
  payment_received      TINYINT(1) NOT NULL DEFAULT 0,
  payment_received_at   TIMESTAMP NULL,
  delivered_by_user_id  INT NULL,
  FOREIGN KEY (table_id) REFERENCES tables(id),
  FOREIGN KEY (delivered_by_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  order_id      INT NOT NULL,
  menu_item_id  INT NOT NULL,
  quantity      INT NOT NULL DEFAULT 1,
  unit_price    DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

CREATE TABLE IF NOT EXISTS waiter_calls (
  id                INT PRIMARY KEY AUTO_INCREMENT,
  table_id          INT NOT NULL,
  called_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  acknowledged_by   INT NULL,
  acknowledged_at   TIMESTAMP NULL,
  FOREIGN KEY (table_id) REFERENCES tables(id),
  FOREIGN KEY (acknowledged_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  order_id    INT NULL,
  type        VARCHAR(50) NOT NULL,
  target_role ENUM('admin','waiter','kitchen','customer') NOT NULL,
  is_read     TINYINT(1) NOT NULL DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);
