CREATE TABLE `comicstore`.`comics` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `description` VARCHAR(3000) NULL,
  `price` DECIMAL(30,10) NULL,
  `img` VARCHAR(200) NULL DEFAULT './img/comics/comic-sample.jpg',
  PRIMARY KEY (`id`, `title`));

CREATE TABLE `comicstore`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `hash` VARCHAR(100) NULL DEFAULT NULL,
  `expires` DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (`id`, `username`));

CREATE TABLE `comicstore`.`pages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(100) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `content` TEXT(50000) NOT NULL,
  PRIMARY KEY (`id`, `slug`));