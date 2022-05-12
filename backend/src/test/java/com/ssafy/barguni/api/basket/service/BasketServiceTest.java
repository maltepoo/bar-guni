package com.ssafy.barguni.api.basket.service;

import com.ssafy.barguni.api.basket.entity.Basket;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Rollback;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class BasketServiceTest {
    @Autowired
    BasketService basketService;

    @Test
//    @Rollback(value=false)
    void deleteNotUsedBasket(){
        Basket basket = basketService.getBasket(200L);
        basketService.deleteNotUsedBasket(basket);
    }
}