package com.ssafy.barguni.api.basket.repository;

import com.ssafy.barguni.api.basket.entity.Basket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BasketRepository extends JpaRepository<Basket, Long>, CustomBasketRepository {
    Boolean existsByJoinCode(String joinCode);
}
