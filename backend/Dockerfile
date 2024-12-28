# Étape 1 : Construire l'application avec Maven
FROM maven:3.8.1-openjdk-17 AS builder
# Définir le répertoire de travail
WORKDIR /app
# Copier les fichiers nécessaires pour la construction
COPY pom.xml ./
COPY src ./src
# Télécharger les dépendances et construire le projet
RUN mvn clean package -DskipTests
# Étape 2 : Créer l'image finale
FROM openjdk:17-jdk-alpine
# Monter un volume pour les fichiers temporaires (optionnel)
VOLUME /tmp
# Définir un argument pour localiser le fichier JAR généré
ARG JAR_FILE=target/*.jar
# Copier le fichier JAR généré depuis l'étape précédente
COPY --from=builder /app/${JAR_FILE} app.jar
# Définir le point d'entrée pour lancer l'application
ENTRYPOINT ["java", "-jar", "/app.jar"]