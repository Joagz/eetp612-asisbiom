# ************************************************************
# Antares - SQL Client
# Version 0.7.29
# 
# https://antares-sql.app/
# https://github.com/antares-sql/antares
# 
# Host: 127.0.0.1 (MySQL Community Server - GPL 9.0.0)
# Database: asisbiom_db
# Generation time: 2024-10-20T08:48:47-03:00
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
) ENGINE=InnoDB AUTO_INCREMENT=514 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# Dump of table asistencias
# ------------------------------------------------------------

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
  `enabled` tinyint(1) DEFAULT '1',
  `clase` tinyint DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_ASISTENCIA_ALUMNO` (`alumno_id`),
  CONSTRAINT `FK_ASISTENCIA_ALUMNO` FOREIGN KEY (`alumno_id`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `asistencias_chk_1` CHECK ((`dia` between 0 and 6))
) ENGINE=InnoDB AUTO_INCREMENT=23682 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# Dump of table conteo_asistencia
# ------------------------------------------------------------

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
) ENGINE=InnoDB AUTO_INCREMENT=1048 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# Dump of table cursos
# ------------------------------------------------------------

CREATE TABLE `cursos` (
  `curso` int DEFAULT NULL,
  `division` char(1) DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `turno` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# Dump of table faltas_justificadas
# ------------------------------------------------------------

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



# Dump of table horarios
# ------------------------------------------------------------

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



# Dump of table materia_curso
# ------------------------------------------------------------

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

CREATE TABLE `materias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# Dump of table notas
# ------------------------------------------------------------

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# Dump of table notification
# ------------------------------------------------------------

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



# Dump of table pdfs
# ------------------------------------------------------------

CREATE TABLE `pdfs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# Dump of table planillas
# ------------------------------------------------------------

CREATE TABLE `planillas` (
  `id_curso` int NOT NULL,
  `mes` tinyint NOT NULL,
  `filename_full` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `filename` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `curso` (`id_curso`)
) ENGINE=InnoDB AUTO_INCREMENT=156 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# Dump of table reportes
# ------------------------------------------------------------

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



# Dump of table retirados
# ------------------------------------------------------------

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

CREATE TABLE `sensor_registry` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ubicacion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# Dump of table stats
# ------------------------------------------------------------

CREATE TABLE `stats` (
  `valor` int DEFAULT NULL,
  `tipo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`tipo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



# Dump of table users
# ------------------------------------------------------------

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



# Dump of views
# ------------------------------------------------------------

# Creating temporary tables to overcome VIEW dependency errors


/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

# Dump completed on 2024-10-20T08:48:47-03:00
