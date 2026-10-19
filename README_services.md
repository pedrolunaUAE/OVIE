# Ovie Web

## Descripción
Sistema web correspondiente a la plataforma Ovie.

---

# Requerimientos del sistema

Antes de iniciar, validar que el equipo cuente con las siguientes herramientas instaladas:

- Java 21
- Maven 3.9.11
- Eclipse IDE for Enterprise Java and Web Developers
- Git

---

# Configuración inicial

## 1. Clonar el proyecto

```bash
git clone https://git.inegi.org.mx/ovie/ovie-services.git
````

---

## 2. Importar proyecto en Eclipse

1. Abrir Eclipse
2. Seleccionar:

```text
File > Import > Existing Maven Projects
```

3. Seleccionar la carpeta raíz del proyecto
4. Finalizar la importación

---

## 3. Construir el proyecto

Abrir una terminal en la raíz del proyecto y ejecutar:

```bash
mvn clean install
```

Este comando descargará las dependencias necesarias y construirá el proyecto.

---

# Configuración de perfiles

Agregar el perfil correspondiente del ambiente a ejecutar (por ejemplo: dev, qa o prod).

Ejemplo:

```bash
-Dspring.profiles.active=profile
```

O bien configurarlo desde Eclipse en:

```text
Run Configurations > Arguments
```

---

# Ejecución del proyecto

Ejecutar la clase principal del proyecto como:

```text
Java Application
```

o mediante:

```bash
mvn spring-boot:run
```

---

# Variables de entorno / configuración

Antes de ejecutar el proyecto es necesario configurar el archivo:

```text
src/main/resources/application-profile.yml
```

Completar los siguientes valores según el ambiente correspondiente.

---

## Configuración de base de datos

```yaml
spring:
  datasource:
    url: jdbc:postgresql://HOST:PUERTO/BASE_DATOS
    username: USUARIO_BD
    password: PASSWORD_BD
```

### Descripción

| Propiedad  | Descripción                    |
| ---------- | ------------------------------ |
| `url`      | URL de conexión a PostgreSQL   |
| `username` | Usuario de la base de datos    |
| `password` | Contraseña de la base de datos |

### Ejemplo

```yaml
url: jdbc:postgresql://localhost:5432/ovie
username: postgres
password: admin
```

---

## Configuración de correo electrónico

```yaml
mail:
  protocol: smtps
  starttls: true
  host: HOST_SMTP
  port: PUERTO_SMTP
  auth: true
  from: CORREO_REMITENTE
  pass: PASSWORD_CORREO
```

### Descripción

| Propiedad | Descripción                   |
| --------- | ----------------------------- |
| `host`    | Host del servidor SMTP        |
| `port`    | Puerto del servidor SMTP      |
| `from`    | Correo remitente              |
| `pass`    | Contraseña o token del correo |

---

## Configuración de orígenes permitidos (CORS)

```yaml
planeacion:
  allowed-origins:
```

Agregar la lista de orígenes permitidos para consumir los servicios REST.

### Ejemplo

```yaml
planeacion:
  allowed-origins:
    - "http://localhost:4200"
```

---

## Configuración de logging

El proyecto utiliza la configuración definida en:

```text
src/main/resources/log4j2-profile.xml
```

No modificar este archivo salvo que se requiera cambiar el nivel de logs o la salida de archivos.

---

# Recomendaciones de seguridad

* No subir usuarios, contraseñas o tokens al repositorio
* Utilizar valores locales para desarrollo
* Mantener el archivo `application-profile.yml` fuera del control de versiones si contiene credenciales sensibles

---

# Problemas comunes

## Error de versión de Java

Validar que Eclipse esté utilizando Java 21:

```text
Project > Properties > Java Compiler
```

---

## Dependencias no descargadas

Actualizar dependencias Maven:

```text
clic derecho project > Maven > Update Project
```

---

# Tecnologías utilizadas

* Java 21
* Spring Boot
* Maven
* PostgreSQL

---

# Notas adicionales

* Verificar permisos de acceso a base de datos
* Verificar acceso a VPN institucional en caso de requerir conexión a recursos internos

```
```
