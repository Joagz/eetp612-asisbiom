-- Insertar cursos por defecto
insert into cursos (division, curso, turno) values ('A', 1, 2);
insert into cursos (division, curso, turno) values ('B', 1, 2);
insert into cursos (division, curso, turno) values ('C', 1, 2);
insert into cursos (division, curso, turno) values ('D', 1, 2);
insert into cursos (division, curso, turno) values ('E', 1, 2);

insert into cursos (division, curso, turno) values ('A', 2, 2);
insert into cursos (division, curso, turno) values ('B', 2, 2);
insert into cursos (division, curso, turno) values ('C', 2, 2);
insert into cursos (division, curso, turno) values ('D', 2, 2);

insert into cursos (division, curso, turno) values ('A', 3, 1);
insert into cursos (division, curso, turno) values ('B', 3, 1);
insert into cursos (division, curso, turno) values ('C', 3, 2);
insert into cursos (division, curso, turno) values ('D', 3, 2);

insert into cursos (division, curso, turno) values ('A', 4, 1);
insert into cursos (division, curso, turno) values ('B', 4, 1);
insert into cursos (division, curso, turno) values ('C', 4, 2);
insert into cursos (division, curso, turno) values ('D', 4, 2);

insert into cursos (division, curso, turno) values ('A', 5, 1);
insert into cursos (division, curso, turno) values ('B', 5, 1);
insert into cursos (division, curso, turno) values ('C', 5, 2);
insert into cursos (division, curso, turno) values ('D', 5, 2);

insert into cursos (division, curso, turno) values ('A', 6, 1);
insert into cursos (division, curso, turno) values ('B', 6, 2);

-- test data
insert into sensor_registry (id, ip, id_sensor, ubicacion) values (1, '0.0.0.0','ABC123','entrada');
insert into stats (cant_alumnos, cant_personal, tipo) values (0,0,'INFO_CANTIDADES');
insert into stats (cant_alumnos, cant_personal, tipo) values (0,0,'INFO_DIARIA');

insert into alumnos (id_curso, nombre_completo, telefono, correo_electronico, dni) values (1, 'Cesar', '1234567900', 'cesar@gmail.com', '12345678');

insert into conteo_asistencia(alumno_id, tardanzas, retiros, dias_habiles, inasistencias_1, inasistencias_2, inasistencias_3)
values (1,0,0,0,0,0,0);