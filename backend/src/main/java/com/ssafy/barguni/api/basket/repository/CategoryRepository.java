package com.ssafy.barguni.api.basket.repository;

import com.ssafy.barguni.api.basket.entity.Categories;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Categories, Long> {
    List<Categories> getAllByBasketId(Long basketId);
    Boolean existsByBasketIdAndName(Long basketId, String name);
}
