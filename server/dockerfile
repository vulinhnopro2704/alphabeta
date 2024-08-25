# Use the appropriate base image for Java 21
FROM openjdk:21-jdk-slim

WORKDIR /app

# Copy the built Spring Boot application
COPY build/libs/server-0.0.1-SNAPSHOT.jar ./app.jar

# Expose the application port
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]