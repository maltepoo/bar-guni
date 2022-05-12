package com.ssafy.barguni.api.basket.repository;

import com.ssafy.barguni.api.user.UserBasketRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class BasketRepositoryTest {
    @Autowired
    BasketRepository basketRepository;
    @Autowired
    UserBasketRepository userBasketRepository;
    @Test
    void getAllIds() {
//        basketRepository.getAllIds()
        assertEquals(10, basketRepository.getAllIds().size());
    }
    @Test
    void getUsedBasketIds(){
        assertEquals(7, userBasketRepository.getUsedBasketIds().size());
    }
}