-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema barguni
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema barguni
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `barguni` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `barguni` ;

-- -----------------------------------------------------
-- Table `barguni`.`picture`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `barguni`.`picture` (
  `pic_id` BIGINT NOT NULL,
  `created_at` DATETIME(6) NULL DEFAULT NULL,
  `pic_url` VARCHAR(255) NULL DEFAULT NULL,
  `title` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`pic_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `barguni`.`basket`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `barguni`.`basket` (
  `bkt_id` BIGINT NOT NULL,
  `join_code` VARCHAR(255) NULL DEFAULT NULL,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `pic_id` BIGINT NULL DEFAULT NULL,
  PRIMARY KEY (`bkt_id`),
  UNIQUE INDEX `UK_981a2t81rmlic4o2c4wiv4jn9` (`join_code` ASC) VISIBLE,
  INDEX `FK62yqrjholfqlpa515398kb3oc` (`pic_id` ASC) VISIBLE,
  CONSTRAINT `FK62yqrjholfqlpa515398kb3oc`
    FOREIGN KEY (`pic_id`)
    REFERENCES `barguni`.`picture` (`pic_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `barguni`.`categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `barguni`.`categories` (
  `cate_id` BIGINT NOT NULL,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `bkt_id` BIGINT NULL DEFAULT NULL,
  PRIMARY KEY (`cate_id`),
  INDEX `FK2vbx773pw0psmm0aqts5earut` (`bkt_id` ASC) VISIBLE,
  CONSTRAINT `FK2vbx773pw0psmm0aqts5earut`
    FOREIGN KEY (`bkt_id`)
    REFERENCES `barguni`.`basket` (`bkt_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `barguni`.`item`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `barguni`.`item` (
  `item_id` BIGINT NOT NULL,
  `dday` BIGINT NULL DEFAULT NULL,
  `alert_by` VARCHAR(255) NULL DEFAULT NULL,
  `content` VARCHAR(255) NULL DEFAULT NULL,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `reg_date` DATE NULL DEFAULT NULL,
  `shelf_life` DATE NULL DEFAULT NULL,
  `used` BIT(1) NULL DEFAULT NULL,
  `used_date` DATE NULL DEFAULT NULL,
  `bkt_id` BIGINT NULL DEFAULT NULL,
  `cate_id` BIGINT NULL DEFAULT NULL,
  `pic_id` BIGINT NULL DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  INDEX `FK7s5jhoh6h967limcavj1ih0tp` (`bkt_id` ASC) VISIBLE,
  INDEX `FKoc1jdh0nclaqe5jkh2i0p7co3` (`cate_id` ASC) VISIBLE,
  INDEX `FKqhlqwtduhw0lrd9ugd511abaf` (`pic_id` ASC) VISIBLE,
  CONSTRAINT `FK7s5jhoh6h967limcavj1ih0tp`
    FOREIGN KEY (`bkt_id`)
    REFERENCES `barguni`.`basket` (`bkt_id`),
  CONSTRAINT `FKoc1jdh0nclaqe5jkh2i0p7co3`
    FOREIGN KEY (`cate_id`)
    REFERENCES `barguni`.`categories` (`cate_id`),
  CONSTRAINT `FKqhlqwtduhw0lrd9ugd511abaf`
    FOREIGN KEY (`pic_id`)
    REFERENCES `barguni`.`picture` (`pic_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `barguni`.`alert`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `barguni`.`alert` (
  `alert_id` BIGINT NOT NULL,
  `content` VARCHAR(255) NULL DEFAULT NULL,
  `status` VARCHAR(255) NULL DEFAULT NULL,
  `title` VARCHAR(255) NULL DEFAULT NULL,
  `bkt_id` BIGINT NULL DEFAULT NULL,
  `item_id` BIGINT NULL DEFAULT NULL,
  `created_at` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`alert_id`),
  INDEX `FKna63yfckkvfld4r3tqud0f24r` (`bkt_id` ASC) VISIBLE,
  INDEX `FK5211b1x58vl07em22lq56ijkb` (`item_id` ASC) VISIBLE,
  CONSTRAINT `FK5211b1x58vl07em22lq56ijkb`
    FOREIGN KEY (`item_id`)
    REFERENCES `barguni`.`item` (`item_id`),
  CONSTRAINT `FKna63yfckkvfld4r3tqud0f24r`
    FOREIGN KEY (`bkt_id`)
    REFERENCES `barguni`.`basket` (`bkt_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `barguni`.`alter_seq`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `barguni`.`alter_seq` (
  `next_val` BIGINT NULL DEFAULT NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `barguni`.`hibernate_sequence`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `barguni`.`hibernate_sequence` (
  `next_val` BIGINT NULL DEFAULT NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `barguni`.`product`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `barguni`.`product` (
  `prod_id` BIGINT NOT NULL,
  `barcode` VARCHAR(255) NULL DEFAULT NULL,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `pic_id` BIGINT NULL DEFAULT NULL,
  PRIMARY KEY (`prod_id`),
  INDEX `FK52q563iiigu14652ra4hk1gql` (`pic_id` ASC) VISIBLE,
  CONSTRAINT `FK52q563iiigu14652ra4hk1gql`
    FOREIGN KEY (`pic_id`)
    REFERENCES `barguni`.`picture` (`pic_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `barguni`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `barguni`.`users` (
  `user_id` BIGINT NOT NULL,
  `email` VARCHAR(255) NULL DEFAULT NULL,
  `name` VARCHAR(255) NULL DEFAULT NULL,
  `default_bkt` BIGINT NULL DEFAULT NULL,
  `alert_api_key` VARCHAR(255) NULL DEFAULT NULL,
  `alert_time` INT NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `UK_6dotkott2kjsp8vw4d0m25fb7` (`email` ASC) VISIBLE,
  INDEX `FK27se994uwn3unvsibivvrsvqb` (`default_bkt` ASC) VISIBLE,
  CONSTRAINT `FK27se994uwn3unvsibivvrsvqb`
    FOREIGN KEY (`default_bkt`)
    REFERENCES `barguni`.`basket` (`bkt_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `barguni`.`user_basket`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `barguni`.`user_basket` (
  `u_b_id` BIGINT NOT NULL,
  `authority` VARCHAR(255) NULL DEFAULT NULL,
  `bkt_id` BIGINT NULL DEFAULT NULL,
  `user_id` BIGINT NULL DEFAULT NULL,
  PRIMARY KEY (`u_b_id`),
  INDEX `FKp45avj7yxkcfcyly56skll8kv` (`bkt_id` ASC) VISIBLE,
  INDEX `FK57mo0u8spgw103aio13weadbv` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FK57mo0u8spgw103aio13weadbv`
    FOREIGN KEY (`user_id`)
    REFERENCES `barguni`.`users` (`user_id`),
  CONSTRAINT `FKp45avj7yxkcfcyly56skll8kv`
    FOREIGN KEY (`bkt_id`)
    REFERENCES `barguni`.`basket` (`bkt_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
