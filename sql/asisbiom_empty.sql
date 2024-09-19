# ************************************************************
# Antares - SQL Client
# Version 0.7.28
# 
# https://antares-sql.app/
# https://github.com/antares-sql/antares
# 
# Host: 127.0.0.1 (MySQL Community Server - GPL 9.0.0)
# Database: asisbiom_test_db
# Generation time: 2024-09-04T21:29:39-03:00
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;





# Dump of table asistencias
# ------------------------------------------------------------

DROP TABLE IF EXISTS `asistencias`;

CREATE TABLE `asistencias` (
  `alumno_id` int DEFAULT NULL,
  `asistencia` bit(1) DEFAULT b'0',
  `dia` tinyint DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `horario_entrada` time(6) DEFAULT NULL,
  `horario_retiro` time(6) DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `retirado` bit(1) DEFAULT b'0',
  `tardanza` bit(1) DEFAULT b'0',
  `razon_retiro` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  `clase` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_ASISTENCIA_ALUMNO` (`alumno_id`),
  CONSTRAINT `FK_ASISTENCIA_ALUMNO` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `asistencias_chk_1` CHECK ((`dia` between 0 and 6))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;





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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;





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



# Dump of table faltas_justificadas
# ------------------------------------------------------------

DROP TABLE IF EXISTS `faltas_justificadas`;

CREATE TABLE `faltas_justificadas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `alumno_id` int NOT NULL,
  `razon` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `fecha` date NOT NULL,
  `dia` tinyint(1) NOT NULL,
  `valor` float NOT NULL,
  PRIMARY KEY (`id`),
  KEY `alumno_id` (`alumno_id`),
  CONSTRAINT `FK_68IV` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `faltas_justificadas` WRITE;
/*!40000 ALTER TABLE `faltas_justificadas` DISABLE KEYS */;

INSERT INTO `faltas_justificadas` (`id`, `alumno_id`, `razon`, `fecha`, `dia`, `valor`) VALUES
	(1, 2, "Enfermo", "2024-06-25", 1, 1);

/*!40000 ALTER TABLE `faltas_justificadas` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=251 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
	(1, "07:30:00.000000", "12:30:00.000000", 9, 18, 1, "CATEDRA"),
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
	(0, "13:30:00.000000", "17:15:00.000000", 250, 18, 0.5, "TALLER");

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;

INSERT INTO `notification` (`id`, `content`, `receiver_id`, `date`, `urgencia`, `sent`) VALUES
	(1, "El alumno Joaquín Gómez tuvo 3 inasistencias estos últimos días", 1, "2024-08-23", 1, 1);

/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;



# Dump of table pdfs
# ------------------------------------------------------------

DROP TABLE IF EXISTS `pdfs`;

CREATE TABLE `pdfs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;





# Dump of table planillas
# ------------------------------------------------------------

DROP TABLE IF EXISTS `planillas`;

CREATE TABLE `planillas` (
  `id_curso` int NOT NULL,
  `mes` tinyint NOT NULL,
  `filename_full` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `filename` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `curso` (`id_curso`)
) ENGINE=InnoDB AUTO_INCREMENT=148 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `planillas` WRITE;
/*!40000 ALTER TABLE `planillas` DISABLE KEYS */;

INSERT INTO `planillas` (`id_curso`, `mes`, `filename_full`, `filename`, `id`, `fecha`) VALUES
	(18, 0, "/home/joagz/Documents/data_asisbiom/planilla_ENERO_2024_4A.csv", "planilla_ENERO_2024_4A.csv", 140, "2024-09-04"),
	(18, 1, "/home/joagz/Documents/data_asisbiom/planilla_FEBRERO_2024_4A.csv", "planilla_FEBRERO_2024_4A.csv", 141, "2024-09-04"),
	(18, 2, "/home/joagz/Documents/data_asisbiom/planilla_MARZO_2024_4A.csv", "planilla_MARZO_2024_4A.csv", 142, "2024-09-04"),
	(18, 3, "/home/joagz/Documents/data_asisbiom/planilla_ABRIL_2024_4A.csv", "planilla_ABRIL_2024_4A.csv", 143, "2024-09-04"),
	(18, 4, "/home/joagz/Documents/data_asisbiom/planilla_MAYO_2024_4A.csv", "planilla_MAYO_2024_4A.csv", 144, "2024-09-04"),
	(18, 5, "/home/joagz/Documents/data_asisbiom/planilla_JUNIO_2024_4A.csv", "planilla_JUNIO_2024_4A.csv", 145, "2024-09-04"),
	(18, 6, "/home/joagz/Documents/data_asisbiom/planilla_JULIO_2024_4A.csv", "planilla_JULIO_2024_4A.csv", 146, "2024-09-04"),
	(18, 7, "/home/joagz/Documents/data_asisbiom/planilla_AGOSTO_2024_4A.csv", "planilla_AGOSTO_2024_4A.csv", 147, "2024-09-04");

/*!40000 ALTER TABLE `planillas` ENABLE KEYS */;
UNLOCK TABLES;



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
	(1, "Joaquin Gomez", "Joagomez2007@gmail.com", "3424680690", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi nihil quod labore quos, velit tenetur, soluta quisquam perspiciatis nisi exercitationem ullam itaque repellat quibusdam eaque natus porro optio pariatur repellendus mollitia. Similique sunt nulla ex! Eum temporibus sequi sit fuga?\n", "Lorem ipsum dolor sit amet", "2024-12-02");

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;





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
	(504, "CANTIDAD_ALUMNOS"),
	(1, "CANTIDAD_ALUMNOS_PRESENTES"),
	(0, "CANTIDAD_PERSONAL"),
	(0, "CANTIDAD_PERSONAL_PRESENTES"),
	(90, "DIAS_HABILES"),
	(4, "NEXT_FINGER");

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `dni`, `email`, `nombre_completo`, `phone`, `pwd`, `role`, `finger_id`) VALUES
	(1, NULL, "ejemplo@gmail.com", "Administrador", NULL, "$2a$12$Noe00en.fHszPG6I7Tor7uRMDP203a.nhuODfQiPSMdWyaXfmmkqe", "DEVELOPER", NULL);

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

# Dump completed on 2024-09-04T21:29:39-03:00
