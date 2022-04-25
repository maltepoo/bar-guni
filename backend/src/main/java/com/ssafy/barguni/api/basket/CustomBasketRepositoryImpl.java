package com.ssafy.barguni.api.basket;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;

@Repository
@RequiredArgsConstructor
public class CustomBasketRepositoryImpl implements CustomBasketRepository{
    private final EntityManager em;

    @Override
    public Basket getByIdWithPic(Long id) {
        return em.createQuery(
                "select b from Basket b " +
                        " join fetch b.picture p" +
                        " where b.id =: id ", Basket.class )
                .setParameter("id", id)
                .getSingleResult();
    }
}
