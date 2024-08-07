# ASISBIOM 
## Escuela: EETP N°612 "Eudocio de los Santos Giménez"
### Autor: Joaquín Gómez
### Participantes del proyecto: Constanzo Tironi, Máximo Tironi, Joaquín Gómez.

Este es el repositorio oficial del proyecto "ASISBIOM" (Asistencia Biométrica).

Consulta la [documentación oficial](https://github.com/Joagz/eetp612-asisbiom/tree/dev/docs/pdf) en formato PDF.

# Guía de ejecución

Para ejecutar el proyecto necesitarás:
- [NodeJS](https://nodejs.org/en/download/package-manager)
- [JDK 17](https://openjdk.org/projects/jdk/17/) (u otro que soporte Java 17)
- [Mosquitto](https://mosquitto.org/)
- MySQL o Docker para la base de datos (opcional)

## Primeros pasos
Antes de empezar asegurate de tener instalado React y Next:
```shell
npm install next@latest react@latest react-dom@latest

```
A continuación, ejecute el siguiente comando dentro de la carpeta raíz:
```shell
cd ./asisbiom_frontend \
npm install \
cd ./asisbiom_admin_front \
npm install
```
En ```asisbiom_backend/src/main/resources/application.properties``` encontrarás lo siguiente:
```properties
spring.application.name=asisbiom
server.port=8089
springdoc.api-docs.path=/api-docs

# Esto ejecuta un script ("schema.sql") automáticamente
# spring.sql.init.mode=always
# spring.jpa.defer-datasource-initialization=true

# spring.jpa.hibernate.ddl-auto=create # Crear las tablas automáticamente

# Configuración local (cambiala para ajustarse a tu base de datos)
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.datasource.url=jdbc:mysql://localhost:3306/asisbiom_db
spring.datasource.username=root
spring.datasource.password=1234

# Base de datos en memoria (si no tenés MySQL o Docker)
# spring.datasource.url=jdbc:h2:mem:asisbiom_db
# spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
# spring.datasource.username=root
# spring.datasource.password=1234
# spring.datasource.driver-class-name=org.h2.Driver

asisbiom.hostnames.mqtt=tcp://localhost:1887 #Host del brocker MQTT (puerto 1887 por defecto)
```

Si tenés Docker instalado podés ejecutar ```docker-compose up -d``` en la carpeta raíz, esto ejecutará el archivo ```docker-compose.yaml```.
Si no tenés Docker, podes remover los comentarios debajo de ```# Base de datos en memoria (si no tenés MySQL o Docker)``` en ```application.properties```, y comentar
Para correr el broker MQTT tenés que abrir una terminal y ejecutar ```mosquitto -c ./fingerprint_utils_cfg.conf``` (se encuentra en la raíz del proyecto).

## Ejecutar aplicaciones
Para compilar el BackEnd (asegurate de tener Maven instalado):
```shell
mvn install && mvn compile && mvn package
```
Para la interfaz del sensor:
```shell
cd ./asisbiom_frontend \
npm run build \
npm start
```
para la interfaz de administración:
```shell
cd ./asisbiom_admin_front \
npm run build \
npm start
```


