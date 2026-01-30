# Build Stage
FROM gradle:8.5-jdk17 AS builder
WORKDIR /app

# Copy only the files needed to download dependencies
COPY build.gradle settings.gradle gradlew gradlew.bat ./
COPY gradle gradle

# Grant execute permission to gradlew
RUN chmod +x gradlew

# Download dependencies - this layer will be cached unless build.gradle changes
RUN ./gradlew build -x test --no-daemon || true

# Copy the rest of the source code
COPY . .

# Build the application
RUN ./gradlew clean build -x test --no-daemon

# Run Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
