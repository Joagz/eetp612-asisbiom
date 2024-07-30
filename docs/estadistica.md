# Extracción de estadísticas ASISBIOM

En el proyecto proponemos un sistema de asistencia electrónico, lo que presenta las siguientes ventajas:

* Conteo exacto de asistencias
* Horario de entrada y salida exactos de los alumnos
* Información de tardanzas
* Entre otros

Aprovechamos esto haciendo un recuento de estadísticas para visualizar más fácilmente la información tomada por el sensor.

## Porcentaje de asistencias

El total de inasistencias de $n$ alumnos es la suma de las inasistencias 

$$
I_n = \sum_{k=1}^{n} I_k 
$$

donde $I_k$ es la inasistencia del alumno $k$. Un ciclo lectivo tiene (aproximadamente) 190 días de clase. Definimos $C$ como la cantidad de días hábiles. La cantidad de asistencias es 

$$
K_a = n \cdot C - I_n
$$

que sería la cantidad total de días hábiles por cada alumno, menos la suma de inasistencias. Entonces, el porcentaje de asistencias es

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

De la misma manera, podemos calcular el porcentaje de tardanzas. Deje que 

$$
T_n = \sum_{k=1}^{n} T_k 
$$

sea la suma de todas las tardanzas. Análogamente podemos definir 

$$
K_t = K_a - T_n
$$

como la cantidad de asistencias puntuales sobre el total de asistencias. Entonces, el porcentaje de *puntualidad* es:

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

Esto quiere decir que del total de asistencias, en el 91.7% los alumnos fueron puntuales. 

## Horario de llegada promedio
Para extraer el horario de llegada promedio, suponemos que tenemos un conjunto 

$$
H = \{h_{prom_1}, h_{prom_1}, h_{prom_3}, ... , h_{prom_n}\}
$$

donde $h_{prom_n}$ es el horario de llegada promedio del alumno $n$. Suponiendo que 

$$
h_{prom_n} =  \sum_{k=1}^{K_{a_n}} h_k
$$

donde $h_k$ es el horario de llegada del alumno $n$ y $K_{a_n}$ es la cantidad de asistencias del alumno. El promedio de los horarios de llegada es

$$h_{prom} = \frac{\sum_{n=1}^{t} h_{prom_n}}{t}$$

Esto nos daría el horario de llegada promedio (hay que tener en cuenta que el horario debe estar en un formato de número entero, por ejemplo, minutos $[m]$ desde las 00:00$[hs]$).

## Ordenamiento de alumnos por horario de llegada

Si definimos una función definida como la diferencia en el horario de llegada del alumno en el día respecto del horario de llegada esperado, llamémosla $h(t)$, donde $t$ se mide en días. La función nos da como salida la diferencia entre el horario de llegada esperado, y el horario de llegada real del alumno

$$
h(t) = H_{t} - H_{llegada}
$$

donde $H_t$ es el horario esperado de llegada en el día $t$. De esta manera, si el alumno llega tarde $h_ns(t) < 0$, si el alumno es puntual $h_ns(t)\approx0$ y si llega temprano $h_ns(t) > 0$.

Si suponemos que $h_ns(t)$ es continua y es derivable en $0 \leq t \leq K_{a_n}$, donde $K_{a_n}$ es el total de asistencias del alumno $n$. Entonces 

$$
I_h=\int_{0}^{K_{a_n}}{h_n(t)}dt
$$

es el índice de puntualidad del alumno. Para visualizar esto, podemos graficar una función cualquiera, entonces el área bajo la curva será positiva si el alumno llega temprano; si el alumno llega temprano la mitad de los días y el resto de los días llega tarde, entonces $I_h\approx0$; si el alumno llega tarde siempre, entones $I_h < 0$.

Como los datos que nosotros obtendremos no nos dan funciones continuas, y hacer una aproximación polinómica es incorrecto ya que la distribución de los horarios de llegada no es uniforme; optaremos por una suma que aproxime este valor:

$$
I_n \approx \Delta x \cdot \sum_{k=1}^{K_{a_n}}{h_n(k)}
$$

Donde $\Delta x = \frac{K_{a_n}}{C}$ donde $C$ es la cantidad de días hábiles en el ciclo lectivo.

La definición de $\Delta x$ es necesaria ya que, suponga que un alumno $a_1$ tiene $180$ asistencias, entonces el puntaje de este alumno debe ser mayor al de un alumno $a_2$ con $170$ asistencias. Entonces:

$$
\Delta x_{a_1} > \Delta x_{a_2}
$$

suponiendo que ámbos alumnos son igual de puntuales, el puntaje $I_1$ > $I_2$. En otras palabras, la calificación no solo se dará por puntualidad, sino que además por el número de asistencias totales.

Para ordenarlos bastaría con hacer una tabla donde utilizamos el valor de $I_n$ como índice.

### Distribución de puntualidad

En base a esto podemos graficar una curva de Lorenz.

Suponemos que tenemos una lista de valores, con alumnos de $1$ al $n$, ordenados en base a $I_n$ de menor a mayor, esto quiere decir que el alumno con el puntaje más bajo es el alumno 1, y así.

Realizamos la sumatoria acumulada de los valores de $I_n$

$$
S_n = \sum_{k = 1}^{n}{I_k}
$$

si evaluamos la suma con $n = \{ 1, 2, 3, ..., n \}$ nos dará una lista $S$ de números corespondiente a la suma acumulada hasta el alumno $n$ de los valores de $I_n$

$S_1 = \sum_{k=1}^{1}I_k$

$S_2 = \sum_{k=1}^{2}I_k$

$S_3 = \sum_{k=1}^{3}I_k$

...

$S_n = \sum_{k=1}^{n}I_k$

luego dividimos la lista obtenida por el valor más alto de $I_n$. Si graficamos los puntos $\( n, \frac{S}{S_n} \)$  formarán la curva de Lorenz.
