# OVIE en Docker

Levanta los tres componentes de OVIE sin instalar Java ni Maven en Windows:

| Servicio        | Contenedor      | URL                            |
| --------------- | --------------- | ------------------------------ |
| Cliente (nginx) | `ovie-client`   | http://localhost               |
| Backend         | `ovie-services` | http://localhost:8080/ovie     |
| API vía cliente | —               | http://localhost/ovie          |
| PostgreSQL      | `ovie-postgres` | localhost:5432                 |

## 1. Estructura de carpetas

```text
D:\ws\ovie\
├── ovie-client\      git clone https://git.inegi.org.mx/ovie/ovie-client.git
├── ovie-services\    git clone https://git.inegi.org.mx/ovie/ovie-services.git
└── ovie-docker\      (esta carpeta)
```

Los repositorios **no se modifican**: la compilación, la configuración y el
servidor web viven aquí.

## 2. Preparar

```cmd
cd /d D:\ws\ovie\ovie-docker
copy .env.example .env
notepad .env
```

- Cambie `POSTGRES_PASSWORD` (y SMTP si se usa).
- Copie los scripts SQL de la base OVIE a `db\init\` (ver `db\init\LEEME.txt`).
- Si está en la red institucional con inspección HTTPS, copie el certificado
  raíz a `certs\` (ver `certs\LEEME.txt`).

## 3. Levantar

```cmd
docker compose up -d --build
docker compose ps
docker compose logs -f ovie-services
```

La primera compilación descarga las dependencias de Maven (tarda varios
minutos); las siguientes usan caché.

## 4. Configurar la URL del backend en el cliente

nginx reenvía `http://localhost/ovie/...` al backend. Busque en `ovie-client`
dónde está definida la URL de los servicios:

```cmd
findstr /s /i /n "8080 /ovie localhost" D:\ws\ovie\ovie-client\*.js
```

y déjela como ruta relativa `/ovie` (o `http://localhost/ovie`). Así cliente y
API comparten origen y no hay problemas de CORS. Como el cliente se monta como
volumen, basta recargar el navegador tras editarlo.

## 5. Operación diaria

```cmd
docker compose stop                       :: detener sin borrar datos
docker compose start                      :: volver a iniciar
docker compose up -d --build ovie-services  :: recompilar tras git pull
docker compose logs --tail 100 ovie-services
docker exec -it ovie-postgres psql -U ovie -d ovie
docker compose down                       :: eliminar contenedores (conserva la base)
docker compose down -v                    :: ¡BORRA también la base!
```

## 6. Problemas comunes

| Síntoma | Causa / solución |
| --- | --- |
| `PKIX path building failed` al compilar | Inspección TLS institucional: poner el certificado en `certs\` y `docker compose build --no-cache ovie-services`, o compilar desde otra red. |
| Backend se reinicia en bucle | `docker compose logs ovie-services`. Suele ser la base vacía o credenciales distintas a `.env`. |
| Los scripts de `db\init` no se ejecutaron | Solo corren con el volumen vacío: `docker compose down -v` y volver a levantar. |
| Puerto 80 / 5432 / 8080 ocupado | Cambiar `CLIENT_PORT`, `POSTGRES_PORT` o `BACKEND_PORT` en `.env`. |
| Error de CORS en el navegador | Usar la URL relativa `/ovie` en el cliente, o ajustar `CORS_ORIGIN` en `.env`. |
| `extension "postgis" is not available` | Ya se usa la imagen `postgis/postgis`; si no se requiere PostGIS puede cambiarse a `postgres:17`. |

## 7. Archivos

```text
ovie-docker/
├── docker-compose.yml            orquestación de los 3 servicios
├── .env.example                  variables (copiar a .env)
├── config/application-docker.yml perfil Spring Boot montado en el contenedor
├── docker/backend/Dockerfile     compilación multi-etapa (Maven → JRE 21)
├── docker/client/nginx.conf      sitio estático + proxy /ovie → backend
├── db/init/                      scripts SQL de inicialización
└── certs/                        certificados institucionales opcionales
```
