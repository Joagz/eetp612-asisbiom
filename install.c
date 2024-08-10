#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include <stdlib.h>

const static char *files[] = {"./asisbiom_frontend/.env", "./asisbiom_admin_front/.env"};
const static char *application_properties = "./asisbiom_backend/src/main/resources/application.properties";

int main(int argc, char *argv[])
{
  if (argc < 2)
  {
    printf("Por favor introduzca la IP o Hostname para configurarlo\n");
    return -1;
  }

  char *arg = argv[1];
  size_t files_size = sizeof(files) / sizeof(*files);

  printf("INICIANDO ARCHIVOS .env\n");
  printf("HOST: %s\n", arg);

  int i = 0;
  while (i < files_size)
  {
    const char *file = files[i];
    i++;

    printf("Escribiendo %s...\n", file);

    FILE *fp = NULL;
    fp = fopen(file, "w+");

    char *buffer = "NEXT_PUBLIC_API_URL=http://%s:8089\nNEXT_PUBLIC_MQTT_SERVER_URI=http://%s:8084/\nNEXT_PUBLIC_MQTT_CLIENT_ID=asisbiom_front_admin\nNEXT_PUBLIC_MQTT_TOPICS_SENSOR_IN=mqtt_sensor_in\nNEXT_PUBLIC_MQTT_TOPICS_SENSOR_OUT=mqtt_sensor_out\nNEXT_PUBLIC_JWT_COOKIE=jwt-cookie\nNEXT_PUBLIC_AUTH_PATH=/signin\n\0";
    char *new_buffer = (char *) calloc(sizeof(char), 512);

    int k = sprintf(new_buffer, buffer, arg, arg);

    fwrite(new_buffer, sizeof(char), k, fp);

    free(new_buffer);

    fclose(fp);
  }

  // Write application.properties
  FILE *fp = NULL;
  fp = fopen(application_properties, "w+");

  printf("Escribiendo %s...\n", application_properties);

  const char *buffer = "spring.application.name=asisbiom\nserver.port=8089\nspringdoc.api-docs.path=/api-docs\n# spring.sql.init.mode=always\n# spring.jpa.defer-datasource-initialization=true\n# spring.jpa.hibernate.ddl-auto=create\nspring.datasource.driver-class-name=com.mysql.jdbc.Driver\nspring.jpa.database-platform=org.hibernate.dialect.MySQLDialect\nspring.datasource.url=jdbc:mysql://localhost:3306/asisbiom_db\nspring.datasource.username=root\nspring.datasource.password=1234\n# spring.jpa.show-sql: true\n# spring.datasource.url=jdbc:h2:mem:asisbiom_db\n# spring.jpa.database-platform=org.hibernate.dialect.H2Dialect\n# spring.datasource.username=root\n# spring.datasource.password=1234\n# spring.datasource.driver-class-name=org.h2.Driver\nasisbiom.hostnames.mqtt=tcp://localhost:1887\nasisbiom.hostname.adminapp=http://%s:3001\nasisbiom.hostname.sensorapp=http://%s:3000";
 
  char *new_buffer = (char *)calloc(sizeof(char), 1024);

  int k = sprintf(new_buffer, buffer, arg, arg);
  fwrite(new_buffer, sizeof(char), k, fp);

  free(new_buffer);

  fclose(fp);
  return 0;
}
