package com.ssafy.barguni.api.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserBasketRepository extends JpaRepository<UserBasket, Long>, CustomUserBasketRepository {

    @Query("select ub from UserBasket ub join fetch ub.basket b where ub.user.id = ?1")
    List<UserBasket> findByUserId(Long id);

    @Modifying
    @Query("delete from UserBasket ub where ub.user.id=:user_id and ub.basket.id=:bkt_id")
    void deleteById(Long user_id, Long bkt_id);

    Integer deleteUserBasketsByUser(User user);

    UserBasket findByUserIdAndBasketId(Long userId, Long basketId);
    Boolean existsByUserIdAndBasketId(Long userId, Long basketId);

    Integer countByBasketId(Long basketId);

    @Query("select count(ub) > 0 from UserBasket ub where ub.user.id = :user_id and ub.basket.id = :bkt_id")
    boolean existsBybktId(Long user_id, Long bkt_id);

    @Query("select ub from UserBasket ub join fetch ub.user u where ub.basket.id = :basketId")
    List<UserBasket> findAllUserByBasketId(Long basketId);

    @Query("select distinct ub.basket.id from UserBasket ub")
    List<Long> getUsedBasketIds();
}
