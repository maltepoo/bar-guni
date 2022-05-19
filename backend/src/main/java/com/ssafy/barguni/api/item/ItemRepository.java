package com.ssafy.barguni.api.item;

import com.ssafy.barguni.api.basket.entity.Basket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item, Long>, CustomItemRepository {
    Optional<Item> findById(Long id);
    @Query("select i from Item i left join fetch i.picture p where i.id = :id")
    Item findWithPictureById(Long id);
    List<Item> findAllByBasketId(Long bktId);
    Integer countByBasketId(Long basketId);
    @Query("select i from Item i join fetch i.basket b")
    List<Item> findAllWithBasket();
    Integer deleteItemsByBasket_IdAndUsed(Long bktId, Boolean used);
    @Query("select i from Item i left join fetch i.category left join fetch i.picture where i.basket.id = :bktId And i.used = :used")
    List<Item> findItemsByBasket_IdAndUsed(Long bktId, Boolean used);
    Integer deleteItemsByBasket(Basket basket);
}
