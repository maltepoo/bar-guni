package com.ssafy.barguni.api.basket;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Categories, Long> {
    List<Categories> getAllByBasketId(Long basketId);
}
