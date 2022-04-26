package com.ssafy.barguni.api.basket.repository;

import com.ssafy.barguni.api.basket.entity.UserBasket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserBasketRepository extends JpaRepository<UserBasket, Long> {
    UserBasket findByUserIdAndBasketId(Long userId, Long basketId);
}
