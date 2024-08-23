# ************************************************************
# Antares - SQL Client
# Version 0.7.28
# 
# https://antares-sql.app/
# https://github.com/antares-sql/antares
# 
# Host: 127.0.0.1 (MySQL Community Server - GPL 9.0.0)
# Database: asisbiom_test_db
# Generation time: 2024-08-23T16:09:23-03:00
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table alumnos
# ------------------------------------------------------------

DROP TABLE IF EXISTS `alumnos`;

CREATE TABLE `alumnos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_curso` int DEFAULT NULL,
  `correo_electronico` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `dni` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `nombre_completo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `telefono` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `finger_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `finger_id` (`finger_id`),
  KEY `FKn11wuqlj5kvp82j7t0bxj1rg5` (`id_curso`),
  CONSTRAINT `FKn11wuqlj5kvp82j7t0bxj1rg5` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;





# Dump of table asistencias
# ------------------------------------------------------------

DROP TABLE IF EXISTS `asistencias`;

CREATE TABLE `asistencias` (
  `alumno_id` int DEFAULT NULL,
  `asistencia` bit(1) DEFAULT NULL,
  `dia` tinyint DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `horario_entrada` time(6) DEFAULT NULL,
  `horario_retiro` time(6) DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `retirado` bit(1) DEFAULT b'0',
  `tardanza` bit(1) DEFAULT b'0',
  `razon_retiro` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `FK_ASISTENCIA_ALUMNO` (`alumno_id`),
  CONSTRAINT `FK_ASISTENCIA_ALUMNO` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `asistencias_chk_1` CHECK ((`dia` between 0 and 6))
) ENGINE=InnoDB AUTO_INCREMENT=40503 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;





# Dump of table conteo_asistencia
# ------------------------------------------------------------

DROP TABLE IF EXISTS `conteo_asistencia`;

CREATE TABLE `conteo_asistencia` (
  `alumno_id` int DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `inasistencias_1` float DEFAULT NULL,
  `inasistencias_2` float DEFAULT NULL,
  `inasistencias_3` float DEFAULT NULL,
  `retiros` int DEFAULT NULL,
  `tardanzas` int DEFAULT NULL,
  `dias_habiles` bigint DEFAULT NULL,
  `inasistencias_streak` tinyint(1) NOT NULL DEFAULT '0',
  `racha` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_ALUMNOS_CONTEO` (`alumno_id`),
  CONSTRAINT `FK_ALUMNOS_CONTEO` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;





# Dump of table cursos
# ------------------------------------------------------------

DROP TABLE IF EXISTS `cursos`;

CREATE TABLE `cursos` (
  `curso` int DEFAULT NULL,
  `division` char(1) DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `turno` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `cursos` WRITE;
/*!40000 ALTER TABLE `cursos` DISABLE KEYS */;

INSERT INTO `cursos` (`curso`, `division`, `id`, `turno`) VALUES
	(1, "A", 1, 2),
	(1, "B", 2, 2),
	(1, "C", 3, 2),
	(1, "D", 4, 2),
	(1, "E", 5, 2),
	(2, "A", 6, 2),
	(2, "B", 7, 2),
	(2, "C", 8, 2),
	(2, "D", 9, 2),
	(3, "C", 10, 2),
	(3, "D", 11, 2),
	(4, "C", 12, 2),
	(4, "D", 13, 2),
	(5, "B", 14, 2),
	(6, "B", 15, 2),
	(3, "A", 16, 1),
	(3, "B", 17, 1),
	(4, "A", 18, 1),
	(4, "B", 19, 1),
	(5, "A", 20, 1),
	(6, "A", 21, 1);

/*!40000 ALTER TABLE `cursos` ENABLE KEYS */;
UNLOCK TABLES;



# Dump of table horarios
# ------------------------------------------------------------

DROP TABLE IF EXISTS `horarios`;

CREATE TABLE `horarios` (
  `dia` tinyint DEFAULT NULL,
  `horario_entrada` time(6) DEFAULT NULL,
  `horario_salida` time(6) DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `id_curso` int DEFAULT NULL,
  `valor_inasistencia` float DEFAULT NULL,
  `clase` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `HORARIO_CURSO_FK` (`id_curso`),
  CONSTRAINT `HORARIO_CURSO_FK` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `horarios_chk_1` CHECK ((`dia` between 0 and 6))
) ENGINE=InnoDB AUTO_INCREMENT=250 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `horarios` WRITE;
/*!40000 ALTER TABLE `horarios` DISABLE KEYS */;

INSERT INTO `horarios` (`dia`, `horario_entrada`, `horario_salida`, `id`, `id_curso`, `valor_inasistencia`, `clase`) VALUES
	(0, "07:30:00.000000", "12:30:00.000000", 1, 16, 0.5, "CATEDRA"),
	(0, "07:30:00.000000", "12:30:00.000000", 2, 17, 0.5, "CATEDRA"),
	(0, "07:30:00.000000", "12:30:00.000000", 3, 18, 0.5, "CATEDRA"),
	(0, "07:30:00.000000", "12:30:00.000000", 4, 19, 0.5, "CATEDRA"),
	(0, "07:30:00.000000", "12:30:00.000000", 5, 20, 0.5, "CATEDRA"),
	(0, "07:30:00.000000", "12:30:00.000000", 6, 21, 0.5, "CATEDRA"),
	(1, "07:30:00.000000", "12:30:00.000000", 7, 16, 0.5, "CATEDRA"),
	(1, "07:30:00.000000", "12:30:00.000000", 8, 17, 0.5, "CATEDRA"),
	(1, "07:30:00.000000", "12:30:00.000000", 9, 18, 0.5, "CATEDRA"),
	(1, "07:30:00.000000", "12:30:00.000000", 10, 19, 0.5, "CATEDRA"),
	(1, "07:30:00.000000", "12:30:00.000000", 11, 20, 0.5, "CATEDRA"),
	(1, "07:30:00.000000", "12:30:00.000000", 12, 21, 0.5, "CATEDRA"),
	(2, "07:30:00.000000", "12:30:00.000000", 13, 16, 1, "CATEDRA"),
	(2, "07:30:00.000000", "12:30:00.000000", 14, 17, 1, "CATEDRA"),
	(2, "07:30:00.000000", "12:30:00.000000", 15, 18, 1, "CATEDRA"),
	(2, "07:30:00.000000", "12:30:00.000000", 16, 19, 1, "CATEDRA"),
	(2, "07:30:00.000000", "12:30:00.000000", 17, 20, 1, "CATEDRA"),
	(2, "07:30:00.000000", "12:30:00.000000", 18, 21, 1, "CATEDRA"),
	(3, "07:30:00.000000", "12:30:00.000000", 19, 16, 1, "CATEDRA"),
	(3, "07:30:00.000000", "12:30:00.000000", 20, 17, 1, "CATEDRA"),
	(3, "07:30:00.000000", "12:30:00.000000", 21, 18, 1, "CATEDRA"),
	(3, "07:30:00.000000", "12:30:00.000000", 22, 19, 1, "CATEDRA"),
	(3, "07:30:00.000000", "12:30:00.000000", 23, 20, 1, "CATEDRA"),
	(3, "07:30:00.000000", "12:30:00.000000", 24, 21, 1, "CATEDRA"),
	(4, "07:30:00.000000", "12:30:00.000000", 25, 16, 1, "CATEDRA"),
	(4, "07:30:00.000000", "12:30:00.000000", 26, 17, 1, "CATEDRA"),
	(4, "07:30:00.000000", "12:30:00.000000", 27, 18, 1, "CATEDRA"),
	(4, "07:30:00.000000", "12:30:00.000000", 28, 19, 1, "CATEDRA"),
	(4, "07:30:00.000000", "12:30:00.000000", 29, 20, 1, "CATEDRA"),
	(4, "07:30:00.000000", "12:30:00.000000", 30, 21, 1, "CATEDRA"),
	(0, "07:30:00.000000", "12:30:00.000000", 31, 16, 0.5, "TALLERES"),
	(0, "07:30:00.000000", "12:30:00.000000", 32, 17, 0.5, "TALLERES"),
	(0, "07:30:00.000000", "12:30:00.000000", 33, 18, 0.5, "TALLERES"),
	(0, "07:30:00.000000", "12:30:00.000000", 34, 19, 0.5, "TALLERES"),
	(0, "07:30:00.000000", "12:30:00.000000", 35, 20, 0.5, "TALLERES"),
	(0, "07:30:00.000000", "12:30:00.000000", 36, 21, 0.5, "TALLERES"),
	(1, "07:30:00.000000", "12:30:00.000000", 37, 16, 0.5, "TALLERES"),
	(1, "07:30:00.000000", "12:30:00.000000", 38, 17, 0.5, "TALLERES"),
	(1, "07:30:00.000000", "12:30:00.000000", 39, 18, 0.5, "TALLERES"),
	(1, "07:30:00.000000", "12:30:00.000000", 40, 19, 0.5, "TALLERES"),
	(1, "07:30:00.000000", "12:30:00.000000", 41, 20, 0.5, "TALLERES"),
	(1, "07:30:00.000000", "12:30:00.000000", 42, 21, 0.5, "TALLERES"),
	(3, "07:30:00.000000", "12:30:00.000000", 43, 16, 0.25, "EDFISICA"),
	(3, "07:30:00.000000", "12:30:00.000000", 44, 17, 0.25, "EDFISICA"),
	(3, "07:30:00.000000", "12:30:00.000000", 45, 18, 0.25, "EDFISICA"),
	(3, "07:30:00.000000", "12:30:00.000000", 46, 19, 0.25, "EDFISICA"),
	(3, "07:30:00.000000", "12:30:00.000000", 47, 20, 0.25, "EDFISICA"),
	(3, "07:30:00.000000", "12:30:00.000000", 48, 21, 0.25, "EDFISICA"),
	(4, "07:30:00.000000", "12:30:00.000000", 49, 16, 0.25, "EDFISICA"),
	(4, "07:30:00.000000", "12:30:00.000000", 50, 17, 0.25, "EDFISICA"),
	(4, "07:30:00.000000", "12:30:00.000000", 51, 18, 0.25, "EDFISICA"),
	(4, "07:30:00.000000", "12:30:00.000000", 52, 19, 0.25, "EDFISICA"),
	(4, "07:30:00.000000", "12:30:00.000000", 53, 20, 0.25, "EDFISICA"),
	(4, "07:30:00.000000", "12:30:00.000000", 54, 21, 0.25, "EDFISICA"),
	(4, "13:00:00.000000", "17:00:00.000000", 205, 1, 1, "CATEDRA"),
	(4, "13:00:00.000000", "17:00:00.000000", 206, 2, 1, "CATEDRA"),
	(4, "13:00:00.000000", "17:00:00.000000", 207, 3, 1, "CATEDRA"),
	(4, "13:00:00.000000", "17:00:00.000000", 208, 4, 1, "CATEDRA"),
	(4, "13:00:00.000000", "17:00:00.000000", 209, 5, 1, "CATEDRA"),
	(4, "13:00:00.000000", "17:00:00.000000", 210, 6, 1, "CATEDRA"),
	(4, "13:00:00.000000", "17:00:00.000000", 211, 7, 1, "CATEDRA"),
	(4, "13:00:00.000000", "17:00:00.000000", 212, 8, 1, "CATEDRA"),
	(4, "13:00:00.000000", "17:00:00.000000", 213, 9, 1, "CATEDRA"),
	(4, "13:00:00.000000", "17:00:00.000000", 214, 10, 1, "CATEDRA"),
	(4, "13:00:00.000000", "17:00:00.000000", 215, 11, 1, "CATEDRA"),
	(4, "13:00:00.000000", "17:00:00.000000", 216, 12, 1, "CATEDRA"),
	(4, "13:00:00.000000", "17:00:00.000000", 217, 13, 1, "CATEDRA"),
	(4, "13:00:00.000000", "17:00:00.000000", 218, 14, 1, "CATEDRA"),
	(4, "13:00:00.000000", "17:00:00.000000", 219, 15, 1, "CATEDRA"),
	(3, "13:00:00.000000", "17:00:00.000000", 220, 1, 0.25, "EDFISICA"),
	(3, "13:00:00.000000", "17:00:00.000000", 221, 2, 0.25, "EDFISICA"),
	(3, "13:00:00.000000", "17:00:00.000000", 222, 3, 0.25, "EDFISICA"),
	(3, "13:00:00.000000", "17:00:00.000000", 223, 4, 0.25, "EDFISICA"),
	(3, "13:00:00.000000", "17:00:00.000000", 224, 5, 0.25, "EDFISICA"),
	(3, "13:00:00.000000", "17:00:00.000000", 225, 6, 0.25, "EDFISICA"),
	(3, "13:00:00.000000", "17:00:00.000000", 226, 7, 0.25, "EDFISICA"),
	(3, "13:00:00.000000", "17:00:00.000000", 227, 8, 0.25, "EDFISICA"),
	(3, "13:00:00.000000", "17:00:00.000000", 228, 9, 0.25, "EDFISICA"),
	(3, "13:00:00.000000", "17:00:00.000000", 229, 10, 0.25, "EDFISICA"),
	(3, "13:00:00.000000", "17:00:00.000000", 230, 11, 0.25, "EDFISICA"),
	(3, "13:00:00.000000", "17:00:00.000000", 231, 12, 0.25, "EDFISICA"),
	(3, "13:00:00.000000", "17:00:00.000000", 232, 13, 0.25, "EDFISICA"),
	(3, "13:00:00.000000", "17:00:00.000000", 233, 14, 0.25, "EDFISICA"),
	(3, "13:00:00.000000", "17:00:00.000000", 234, 15, 0.25, "EDFISICA"),
	(1, "13:00:00.000000", "17:00:00.000000", 235, 1, 0.5, "TALLERES"),
	(1, "13:00:00.000000", "17:00:00.000000", 236, 2, 0.5, "TALLERES"),
	(1, "13:00:00.000000", "17:00:00.000000", 237, 3, 0.5, "TALLERES"),
	(1, "13:00:00.000000", "17:00:00.000000", 238, 4, 0.5, "TALLERES"),
	(1, "13:00:00.000000", "17:00:00.000000", 239, 5, 0.5, "TALLERES"),
	(1, "13:00:00.000000", "17:00:00.000000", 240, 6, 0.5, "TALLERES"),
	(1, "13:00:00.000000", "17:00:00.000000", 241, 7, 0.5, "TALLERES"),
	(1, "13:00:00.000000", "17:00:00.000000", 242, 8, 0.5, "TALLERES"),
	(1, "13:00:00.000000", "17:00:00.000000", 243, 9, 0.5, "TALLERES"),
	(1, "13:00:00.000000", "17:00:00.000000", 244, 10, 0.5, "TALLERES"),
	(1, "13:00:00.000000", "17:00:00.000000", 245, 11, 0.5, "TALLERES"),
	(1, "13:00:00.000000", "17:00:00.000000", 246, 12, 0.5, "TALLERES"),
	(1, "13:00:00.000000", "17:00:00.000000", 247, 13, 0.5, "TALLERES"),
	(1, "13:00:00.000000", "17:00:00.000000", 248, 14, 0.5, "TALLERES"),
	(1, "13:00:00.000000", "17:00:00.000000", 249, 15, 0.5, "TALLERES");

/*!40000 ALTER TABLE `horarios` ENABLE KEYS */;
UNLOCK TABLES;



# Dump of table materia_curso
# ------------------------------------------------------------

DROP TABLE IF EXISTS `materia_curso`;

CREATE TABLE `materia_curso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_curso` int NOT NULL,
  `id_materia` int NOT NULL,
  `hora_inicio` tinyint NOT NULL,
  `hora_fin` tinyint NOT NULL,
  `dia` tinyint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_curso` (`id_curso`),
  KEY `id_materia` (`id_materia`),
  CONSTRAINT `FK_CURSO` FOREIGN KEY (`id_curso`) REFERENCES `cursos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_MATERIA` FOREIGN KEY (`id_materia`) REFERENCES `materias` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;





# Dump of table materias
# ------------------------------------------------------------

DROP TABLE IF EXISTS `materias`;

CREATE TABLE `materias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;





# Dump of table notas
# ------------------------------------------------------------

DROP TABLE IF EXISTS `notas`;

CREATE TABLE `notas` (
  `alumno_id` int DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `nivel_urgencia` int DEFAULT NULL,
  `vencimiento` date DEFAULT NULL,
  `asunto` varchar(255) DEFAULT NULL,
  `contenido` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKa9lly8ij9aui59h8x6sk3b9yr` (`alumno_id`),
  CONSTRAINT `FKa9lly8ij9aui59h8x6sk3b9yr` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;





# Dump of table notification
# ------------------------------------------------------------

DROP TABLE IF EXISTS `notification`;

CREATE TABLE `notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `receiver_id` int NOT NULL,
  `date` date NOT NULL,
  `urgencia` tinyint NOT NULL DEFAULT '0',
  `sent` tinyint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `receiver_id` (`receiver_id`),
  CONSTRAINT `FK_NOTIFICATION_USER` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;





# Dump of table pdfs
# ------------------------------------------------------------

DROP TABLE IF EXISTS `pdfs`;

CREATE TABLE `pdfs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;





# Dump of table reportes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `reportes`;

CREATE TABLE `reportes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_completo` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `telefono` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `situacion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `titulo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `fecha` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `reportes` WRITE;
/*!40000 ALTER TABLE `reportes` DISABLE KEYS */;

INSERT INTO `reportes` (`id`, `nombre_completo`, `email`, `telefono`, `situacion`, `titulo`, `fecha`) VALUES
	(1, "Joaquin Gomez", NULL, NULL, "Probando reportes", "Hola mundo", "2024-12-04");

/*!40000 ALTER TABLE `reportes` ENABLE KEYS */;
UNLOCK TABLES;



# Dump of table retirados
# ------------------------------------------------------------

DROP TABLE IF EXISTS `retirados`;

CREATE TABLE `retirados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime NOT NULL,
  `razon` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `alumno` int NOT NULL,
  `profesor` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `alumno` (`alumno`),
  KEY `profesor` (`profesor`),
  CONSTRAINT `FK_HJR6` FOREIGN KEY (`alumno`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_V1K5` FOREIGN KEY (`profesor`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;





# Dump of table sensor_registry
# ------------------------------------------------------------

DROP TABLE IF EXISTS `sensor_registry`;

CREATE TABLE `sensor_registry` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ubicacion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `sensor_registry` WRITE;
/*!40000 ALTER TABLE `sensor_registry` DISABLE KEYS */;

INSERT INTO `sensor_registry` (`id`, `ip`, `ubicacion`) VALUES
	(1, "0.0.0.0", "Entrada");

/*!40000 ALTER TABLE `sensor_registry` ENABLE KEYS */;
UNLOCK TABLES;



# Dump of table stats
# ------------------------------------------------------------

DROP TABLE IF EXISTS `stats`;

CREATE TABLE `stats` (
  `valor` int DEFAULT NULL,
  `tipo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`tipo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `stats` WRITE;
/*!40000 ALTER TABLE `stats` DISABLE KEYS */;

INSERT INTO `stats` (`valor`, `tipo`) VALUES
	(0, "CANTIDAD_ALUMNOS"),
	(0, "CANTIDAD_ALUMNOS_PRESENTES"),
	(0, "CANTIDAD_PERSONAL"),
	(0, "CANTIDAD_PERSONAL_PRESENTES"),
	(0, "DIAS_HABILES"),
	(0, "NEXT_FINGER");

/*!40000 ALTER TABLE `stats` ENABLE KEYS */;
UNLOCK TABLES;



# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dni` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `nombre_completo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `pwd` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `role` enum('USUARIO','PROFESOR','PRECEPTOR','SECRETARIO','DIRECTIVO','DEVELOPER','SENSOR') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `finger_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `dni`, `email`, `nombre_completo`, `phone`, `pwd`, `role`, `finger_id`) VALUES
	(1, NULL, "ejemplo@gmail.com", "Administrador", NULL, "$2a$12$Noe00en.fHszPG6I7Tor7uRMDP203a.nhuODfQiPSMdWyaXfmmkqe", "DEVELOPER", NULL),
	(2, "48067866", "joagomez.dev@gmail.com", "Joaquín Gómez", "3424680690", "$2a$10$JrZKzRq7HH6uOCRMExL9deQwF60F7wct4HaQiZfxO/UYCAAJh6ude", "DIRECTIVO", NULL),
	(3, NULL, "sensor", NULL, NULL, "$2a$12$Noe00en.fHszPG6I7Tor7uRMDP203a.nhuODfQiPSMdWyaXfmmkqe", "SENSOR", NULL);

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



# Dump of views
# ------------------------------------------------------------

# Creating temporary tables to overcome VIEW dependency errors


/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

# Dump completed on 2024-08-23T16:09:23-03:00
