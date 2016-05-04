CREATE TABLE `comicstore`.`comics` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `description` VARCHAR(3000) NULL,
  `price` DECIMAL(30,10) NULL,
  `img` VARCHAR(200) NULL DEFAULT './img/comics/comic-sample.jpg',
  PRIMARY KEY (`id`, `title`));