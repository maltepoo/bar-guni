package com.ssafy.barguni;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class BarguniApplication {

	public static void main(String[] args) {
		SpringApplication.run(BarguniApplication.class, args);
	}

}
