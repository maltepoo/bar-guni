package com.ssafy.barguni.api.user;

import com.ssafy.barguni.api.basket.entity.UserBasket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserBasketRepository extends JpaRepository<UserBasket, Long> {

    @Query("select ub from UserBasket ub where ub.user.id = ?1")
    List<UserBasket> findByUserId(Long id);

    @Modifying
    @Query("delete from UserBasket ub where ub.user.id=:user_id and ub.basket.id=:bkt_id")
    void deleteById(Long user_id, Long bkt_id);
}
