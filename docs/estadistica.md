# Extracción de estadísticas ASISBIOM

En el proyecto proponemos un sistema de asistencia electrónico, lo que presenta las siguientes ventajas:

* Conteo exacto de asistencias
* Horario de entrada y salida exactos de los alumnos
* Información de tardanzas
* ... etc.

Aprovechamos esto haciendo un recuento de estadísticas para visualizar más fácilmente la información tomada por el sensor.

## Porcentaje de asistencias

El total de inasistencias de $$\( n \)$$ alumnos es la suma de las inasistencias $$\( I_n = \sum_{k=1}^{n} I_k \)$$, donde $$\( I_k \)$$ es la inasistencia del alumno $$\( k \)$$. Un ciclo lectivo tiene (aproximadamente) 190 días de clase. Definimos $$\( C \)$$ como la cantidad de días hábiles. La cantidad de asistencias es $$\( K_a = n \cdot C - I_n \)$$, que sería la cantidad total de días hábiles por cada alumno, menos la suma de inasistencias. Entonces, el porcentaje de asistencias es

$$
\%A = \left( \frac{K_a \cdot 100}{n \cdot C} \right)
$$

Suponiendo que cada alumno tiene 10 inasistencias en la escuela, si un ciclo lectivo tiene 190 días hábiles y hay 500 alumnos, entonces:

$$
K_a = n \cdot C - I_n = 500 \cdot 190 - 500 \cdot 10 = 90,000
$$

$$
\%A = \left( \frac{90,000 \cdot 100}{95,000} \right) \approx 94.736842105
$$

## Porcentaje de tardanzas

De la misma manera, podemos calcular el porcentaje de tardanzas. Deje que $$\( T_n = \sum_{k=1}^{n} T_k \)$$ sea la suma de todas las tardanzas. Análogamente podemos definir $$\( K_t = K_a - T_n \)$$ como la cantidad de asistencias puntuales sobre el total de asistencias. Entonces, el porcentaje de *puntualidad* es:

$$
\%P = \frac{K_t \cdot 100\%}{K_a}
$$

Para una escuela con 500 alumnos, suponiendo que cada alumno tiene 15 tardanzas, y la cantidad de asistencias total es la del ejemplo anterior (90,000) entonces:

$$
K_t = 90,000 - 15 \cdot 500 = 82,500
$$

$$
\%P = \frac{82,500 \cdot 100\%}{90,000} \approx 91.666666667
$$

Este resultado quiere decir que los alumnos son 91.7\% puntuales.

## Horario de llegada promedio
Para extraer el horario de llegada promedio, suponemos que tenemos un conjunto $$\( H = \{h_{prom_1}, h_{prom_1}, h_{prom_3}, ... , h_{prom_n}\} \)$$ donde $$\( h_{prom_n} \)$$ es el horario de llegada promedio del alumno $$\( n \)$$. Suponiendo que $$\( h_{prom_n} =  \sum_{k=1}^{K_{a_n}} h_k \)$$, donde $$\( h_k \)$$ es el horario de llegada del alumno $$\(n\)$$ y $$\(K_{a_n}\)$$ es la cantidad de asistencias del alumno.

Si nosotros tomamos los elementos del conjunto $$\(H\)$$ y tomamos la media de ese conjunto (si suponemos que el conjunto está ordenado) entonces el horario de llegada medio es $$\(\overline{\rm h}\)$$ y está ubicado en $$\(H[\frac{t}{2}]\)$$ donde $$\(t\)$$ es el total de elementos en el conjunto $$\(H\)$$.

El promedio de los horarios de llegada es

$$\(h_{prom} = \frac{\sum_{n=1}^{t} h_{prom_n}}{t}\)$$

Esto nos daría el horario de llegada promedio (hay que tener en cuenta que el horario debe estar en un formato de número entero).