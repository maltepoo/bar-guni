package com.ssafy.barguni.api.basket.repository;

import com.ssafy.barguni.api.basket.entity.Basket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BasketRepository extends JpaRepository<Basket, Long>{
    Boolean existsByJoinCode(String joinCode);
    @Query("select b from Basket b " +
            " left join fetch b.picture p " +
            " where b.id = :id")
    Basket getByIdWithPic(@Param("id")Long id);
}
