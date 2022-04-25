package com.ssafy.barguni.api.basket;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BasketRepository extends JpaRepository<Basket, Long>, CustomBasketRepository {
    Boolean existsByJoinCode(String joinCode);
}
