package com.ssafy.barguni.api.basket.repository;

import com.ssafy.barguni.api.basket.entity.Basket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface BasketRepository extends JpaRepository<Basket, Long>, CustomBasketRepository {
    Boolean existsByJoinCode(String joinCode);

    @Query("select b from Basket b where b.joinCode = :joinCode")
    Optional<Basket> findByJoinCode(String joinCode);
}
