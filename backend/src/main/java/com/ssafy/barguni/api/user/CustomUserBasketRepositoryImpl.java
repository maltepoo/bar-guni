package com.ssafy.barguni.api.user;

import com.ssafy.barguni.api.user.vo.UserBasketWithCountRes;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class CustomUserBasketRepositoryImpl implements CustomUserBasketRepository{
    private final EntityManager em;
    public List<UserBasketWithCountRes> findAllBasketWithCountByUser(Long id){
        return em.createQuery("select new com.ssafy.barguni.api.user.vo.UserBasketWithCountRes(" +
                        "ub1.user.id, ub1.basket.id, ub1.authority, ub1.basket.name, count(ub2.user.id)) " +
                "from UserBasket ub1 " +
                "left join UserBasket ub2 on ub1.basket = ub2.basket " +
                "where ub1.user.id = :id " +
                "group by ub1.basket", UserBasketWithCountRes.class)
                .setParameter("id",id)
                .getResultList();
    }
}
