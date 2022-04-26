package com.ssafy.barguni.api.basket.repository;

import com.ssafy.barguni.api.basket.entity.Basket;

public interface CustomBasketRepository {
    Basket getByIdWithPic(Long id);
}
