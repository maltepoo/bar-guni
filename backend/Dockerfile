FROM openjdk:11-jdk
ARG JAR_FILE=build/libs/barguni-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} barguni-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java","-jar","barguni-0.0.1-SNAPSHOT.jar"]