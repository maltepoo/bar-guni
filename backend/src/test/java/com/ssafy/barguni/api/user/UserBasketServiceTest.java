package com.ssafy.barguni.api.user;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@Transactional
class UserBasketServiceTest {
    @Autowired
    UserBasketService userBasketService;
    @Test
    void findByUserId2() {
        userBasketService.findAllBasketWithCountByUser(1L).forEach(i-> System.out.println(i));
    }
}