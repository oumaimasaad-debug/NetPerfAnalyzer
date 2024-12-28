# NETPERFANALYZER: Network Performance Analyzer
C'est est une plateforme complète pour tester et analyser la performance réseau. Ce projet utilise React pour le frontend, Maven et Spring Boot pour le backend, et une base de données MySQL dédiée appelée netperf.
# Table des Matières
- [Architecture Logicielle](#architecture-logicielle)
- [Docker Image](#Docker-Image)
- [Frontend](#frontend)
- [Backend](#backend)
- [Getting Started](#getting-started)
- [Video Demonstration](#Video-Demonstration)
- [Contributing](#contributing)
# Architecture Logicielle
![Spring Boot React](https://1.bp.blogspot.com/-IZ0RDJSbTmI/X4rfXCU9XdI/AAAAAAAAAj4/SPOQCM4MZkML4SF7fTTz7WfmD0mnKS6JACLcBGAsYHQ/s824/springboot_react.png)


Le projet utilise React pour le frontend et Spring Boot pour le backend. La communication entre les deux se fait via des API REST sécurisées avec JWT

## Docker Image
```sh




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
# Structure du Projet Backend
Le backend est structuré de manière claire et modulaire, en exploitant les fonctionnalités de Spring Boot pour construire une application sécurisée, robuste et évolutive.


Step 2:  ```mvn clean install```

Step 3:  ```mvn spring-boot:run```

# Frontend

Step 4:  ```npm install or yarn install```

Step 5:  ```npm start or yarn start```

# From the browser call the endpoint http://localhost:9080/.

# User Registration
<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEilhsvIDk7nehhsnMMmX5eKc6GCs-zkt-Bc5qkqHU8oVJ7qOyyjRwycKMlbNLONaTjVFsvai7OjfTnxsx6CnZCXT5qI9BVTmqMaRhoETzF6cylVO5_9xTkc9HqGiup1oxBHkDw5aMntmJZStTf5RMS1LD9HErvcNX2hs6caXkMOhUapBbPonEcKqfrlGA/s951/signup.png)">

# User Signin
<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhzVZfouHw6O5_jduWnVwjjT5BP3G-odGoHm1x4PL9-Uf0aHECUXCvO6Bj-Jt2An9JTFhpdNU2as0IY2C4nd1fFN_HYhEkHKKKtFsh1LaywVV96I0szSGV5PSW9aTyivETv0JrEmSyvUPO6T8koFTM8o4JrF5Sssr2LkdmY2AEMFR5QmgOW9KCrFM2O9A/s938/login.png">

# Profile View:
<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgn19CGVQKqU0JTNeE77cU9Zy2f3F-i7NXKLJ-nTQZdbjCgCByiOxtZj9rcM0k52Wp37yHa5UScaT4gD96bSdSD2Rcku7XxX5uHgIcgkrW8fjyziukosDSn12sigWeY5YnlaZbmbFaO63MPPunYosn-Hi1R9jm4sBnEw7agUqC1eCuEoqEpmTVwZCCOng/s947/profile.png">

# Access Resource:
<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhHeHrM6W7AzwPNow-TW9ClyFABr7RtEnCDPxuSFhexHC6PYdi0WcdxLTkWdMI8YjaBUibzgFEqHND4kaimRjETudLvMSrShORL4700Iz5k2RqaeES5gJTmFTaMVzBtXouo8PEhQoheUZ-AefCj7YY8WybpwPCMAi-EEyGJ0dsvJ4dB8HLf2BQ5j_ytPQ/s948/resource.png">
