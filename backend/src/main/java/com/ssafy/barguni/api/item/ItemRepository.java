package com.ssafy.barguni.api.item;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ItemRepository extends JpaRepository<Item, Long>, CustomItemRepository {
    Optional<Item> findById(Long id);
    List<Item> findAllByBasketId(Long bktId);
    Integer countByBasketId(Long basketId);
    @Query("select i from Item i join fetch i.basket b")
    List<Item> findAllWithBasket();
    Integer deleteItemsByBasket_IdAndUsed(Long bktId, Boolean used);
//    List<Item> findItemsByBasket_IdAndUsed(Long bktId, Boolean used);
}
