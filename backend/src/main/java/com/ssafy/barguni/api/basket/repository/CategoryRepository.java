package com.ssafy.barguni.api.basket.repository;

import com.ssafy.barguni.api.basket.entity.Categories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Categories, Long> {
    Categories getById(Long id);
    List<Categories> getAllByBasketId(Long basketId);
    Boolean existsByBasketIdAndName(Long basketId, String name);
    @Modifying
    @Query("delete from Categories c where c.basket.id = :id")
    void deleteByBasketId(Long id);
    @Query("select c from Categories c join fetch c.basket b where c.id = :id")
    Categories getByIdWithBasket(Long id);
}
