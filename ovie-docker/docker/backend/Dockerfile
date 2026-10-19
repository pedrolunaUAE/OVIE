# syntax=docker/dockerfile:1.7
# ============================================================
# OVIE - Backend (ovie-services / ovie-analisis)
# Compila dentro de Docker (multi-stage): no requiere Java ni
# Maven en Windows ni un "mvn package" previo.
# ============================================================

# ---------- Etapa 1: compilación ----------
FROM maven:3.9.11-eclipse-temurin-21 AS build

# Certificados institucionales opcionales (inspección TLS).
# Se toman de la carpeta ./certs (contexto adicional "certs").
COPY --from=certs . /tmp/certs/
RUN for c in /tmp/certs/*.crt /tmp/certs/*.cer /tmp/certs/*.pem; do \
      [ -f "$c" ] || continue; \
      echo "Importando certificado: $c"; \
      keytool -importcert -noprompt -cacerts -storepass changeit \
              -alias "$(basename "$c")" -file "$c"; \
    done

WORKDIR /workspace

# Primero solo los pom.xml para aprovechar la caché de dependencias
COPY pom.xml ./
COPY ovie-analisis/pom.xml ovie-analisis/
RUN --mount=type=cache,target=/root/.m2 \
    mvn -B -q dependency:go-offline || true

# Código fuente y empaquetado
COPY . .
RUN --mount=type=cache,target=/root/.m2 \
    mvn -B -DskipTests clean package \
 && cp ovie-analisis/target/ovie-analisis-*.jar /app.jar

# ---------- Etapa 2: ejecución ----------
FROM eclipse-temurin:21-jre

RUN groupadd -r ovie && useradd -r -g ovie -d /app ovie \
 && mkdir -p /app/config /app/logs \
 && chown -R ovie:ovie /app

WORKDIR /app
COPY --from=build --chown=ovie:ovie /app.jar app.jar

USER ovie
EXPOSE 8080

# Spring Boot lee automáticamente /app/config/application-<perfil>.yml
ENTRYPOINT ["java", "-jar", "app.jar"]
