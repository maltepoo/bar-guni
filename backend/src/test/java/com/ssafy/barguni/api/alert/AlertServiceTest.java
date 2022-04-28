package com.ssafy.barguni.api.alert;

import com.ssafy.barguni.api.basket.entity.Basket;
import com.ssafy.barguni.api.basket.repository.BasketRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional(readOnly = true)
class AlertServiceTest {
    @Autowired
    AlertRepository alertRepository;
    @Autowired
    BasketRepository basketRepository;

    int cnt = 0;
    @Test
    void findAllByUserId() {
        alertRepository.findAllByUserId(3L)
                .stream()
                .forEach((e)->{
                    if(e.getStatus() == AlertStatus.UNCHECKED) {
                        System.out.println(e.getId());
                        System.out.println(e.getStatus());
                        System.out.println(e.getBasket().getName());
                        System.out.println(e.getContent());
                        counting();
                    }
                });

        assertEquals(5, cnt);
    }

    void counting(){
        cnt++;
    }
}