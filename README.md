# NetPerfAnalyzer: Network Performance Analyzer
C'est est une plateforme complète pour tester et analyser la performance réseau. Ce projet utilise React pour le frontend, Maven et Spring Boot pour le backend, et une base de données MySQL dédiée appelée netperf.
# Table des Matières
- [Architecture Logicielle](#architecture-logicielle)
- [Docker Image](#Docker-Image)
- [Frontend](#frontend)
- [Backend](#backend)
- [Configuration locale et exécution de l'application](#Configuration-locale-et-exécution-de-l'application)
- [ Démonstration Vidéo](#Démonstration-Vidéo)
- [Contributeurs](#contributeurs)
# Architecture Logicielle
![Spring Boot React](https://1.bp.blogspot.com/-IZ0RDJSbTmI/X4rfXCU9XdI/AAAAAAAAAj4/SPOQCM4MZkML4SF7fTTz7WfmD0mnKS6JACLcBGAsYHQ/s824/springboot_react.png)


Le projet utilise React pour le frontend et Spring Boot pour le backend. La communication entre les deux se fait via des API REST sécurisées avec JWT

## Docker Image
```sh

https://github.com/user-attachments/assets/e39e9799-0226-4c39-ad81-cbc5e4cceba5






services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: netperf
    ports:
      - "3306:3306"
    healthcheck:
      test: "/usr/bin/mysql --user=root --password=root --execute 'SHOW DATABASES;'"
      interval: 5s
      timeout: 2s
      retries: 10

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: backend-container
    ports:
      - "8080:8080"
    depends_on:
      mysql:
        condition: service_healthy
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/netperf?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: root
      SPRING_JPA_HIBERNATE_DDL_AUTO: update
      SPRING_JPA_SHOW_SQL: true
      SPRING_JPA_PROPERTIES_HIBERNATE_FORMAT_SQL: true
      KNF_APP_JWT_EXPIRATION_MS: 76300000
      KNF_APP_JWT_SECRET: knowledgeFactory
    healthcheck:
      test: "/usr/bin/mysql --user=root --password=root --password=root --execute 'SHOW DATABASES;'"
      interval: 5s
      timeout: 2s
      retries: 10

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: frontend-container
    ports:
      - "3000:80"
    depends_on:
      backend:
        condition: service_started

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    environment:
      PMA_HOST: mysql
      PMA_PORT: 3306
      MYSQL_ROOT_PASSWORD: root  # Définir un mot de passe pour phpMyAdmin
    ports:
      - "8081:80"
    depends_on:
      - mysql


```
## Frontend

### Technologies Utilisées

- React
- Redux 
- React Router
- Bootstrap
- Chart.js
- Axios
- jsPDF
- html2canvas
- Jest & Testing Library
  
Le frontend est construit avec React pour fournir une interface utilisateur réactive et moderne. Il communique avec le backend via des API sécurisées par JWT.
## Backend

### Technologies Utilisées
- Spring Boot 2.7.0
- Spring Security 
- Spring Data JPA
- Spring Web
- JWT (JSON Web Tokens) 
- Spring Boot
- MySQL
### Structure du Projet Backend
Le backend est structuré de manière claire et modulaire, en exploitant les fonctionnalités de Spring Boot pour construire une application sécurisée, robuste et évolutive.
### 1. com.example.netperf.application
La classe *Application.java* constitue le point d'entrée de l'application Spring Boot. Elle contient la méthode main, qui initialise et démarre l'ensemble des composants de l'application.
### 2. com.example.netperf.controllers
Ce package contient des classes dédiées à la gestion des requêtes HTTP entrantes via des endpoints RESTful. Chaque contrôleur est spécialisé dans une fonctionnalité ou une entité spécifique et interagit avec les services pour exécuter les traitements métier. Ces contrôleurs assurent également une sécurité accrue grâce à l'intégration de Spring Boot Security, qui protège les endpoints sensibles en nécessitant une authentification et des autorisations appropriées.
### 3. com.example.netperf.models
Ce package regroupe les classes représentant les entités de données de l'application. Annotées avec JPA, ces classes définissent la structure des tables de la base de données MySQL. Elles sont utilisées pour mapper les données entre la base de données et l'application.
### 4. com.example.netperf.repository
Les interfaces de ce package héritent des repositories de Spring Data JPA et permettent d'exécuter des opérations de base comme la création, la mise à jour, la suppression et la recherche. Ces repositories jouent un rôle clé dans l'interaction avec la base de données.
### 5. com.example.netperf.service
Ce package contient les classes qui implémentent la logique métier de l'application. Les services agissent comme une couche intermédiaire entre les contrôleurs et les repositories.
### 6. com.example.netperf.request
Les classes de ce package encapsulent les données envoyées par le client au serveur via les endpoints REST. Ces objets facilitent la validation et le traitement des données entrantes.
### 7. com.example.netperf.response
Ce package regroupe les classes utilisées pour envoyer les réponses au client après le traitement des requêtes. Ces classes permettent d'organiser et de structurer les données sortantes.
### 8. com.example.netperf.security
Ce package est dédié à l'intégration de Spring Boot Security pour sécuriser l'application.
### Dependances
1. *Spring Data JPA:*
   Fournit une API simple pour gérer les bases de données relationnelles via JPA avec une implémentation prête à l'emploi
3. *spring-boot-starter-security*
   Fournit des outils intégrés pour l'authentification, l'autorisation et la protection des endpoints REST.
5. *spring-boot-starter-web*
   Simplifie la création d'applications web RESTful avec un serveur intégré et des outils HTTP
7. *spring-boot-starter-websocket*
   Permet la création de communications WebSocket bidirectionnelles en temps réel entre les clients et le serveur.
   
  ## Configuration locale et exécution de l'application
 ### Prérequis
 1.*Git* :
Assurez-vous d'avoir Git installé. Si ce n'est pas le cas, téléchargez et installez-le depuis git-scm.com.
XAMPP :

2.*Installez XAMPP depuis [apachefriends.org](https://www.apachefriends.org/).:*
- Démarrez les serveurs Apache et MySQL dans XAMPP.
- Vérifiez que MySQL utilise le port 3306.

3.*Node Version Manager (NVM):*
- Installez NVM depuis [github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm).
- Utilisez NVM pour installer la version 18 de Node.js avec la commande ```nvm install 18```
### Configuration Backend
1.*Clonez le projet:*
2.*Installez les dépendances du backend:*
 ```mvn clean install```
3.*Lancez le backend* 
### Configuration Frontend
1.*Installez Node.js et les outils nécessaires*
- ```nvm use 18```
- ```npm install react react-dom redux react-redux react-router-dom bootstrap chart.js axios jspdf html2canvas jest @testing-library/react @testing-library/jest-dom```
- ```npm install react react-dom redux react-redux react-router-dom bootstrap chart.js axios jspdf html2canvas jest @testing-library/react @testing-library/jest-dom```
- ```npm install --save --legacy-peer-deps```
  

# Accédez au frontend en visitant http://localhost:3000 dans votre navigateur.

# Démonstration Vidéo
https://github.com/user-attachments/assets/484b6ade-512a-4c6b-bf89-61795ed969b6
# Contributeurs
- El Kak Basma ([GitHub]())
- Saad Oumaima ([GitHub](https://github.com/oumaimasaad-debug))
- Mohamed Lachgar ([Researchgate](https://www.researchgate.net/profile/Mohamed-Lachgar))








