package com.ssafy.barguni.api.alert.basket;

import com.ssafy.barguni.api.item.vo.ItemSearch;
import com.ssafy.barguni.api.item.ItemRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ItemRepositoryTest {
    @Autowired
    ItemRepository itemRepository;

    @Test
    public void itemSearchTest() throws Exception {
        ItemSearch itemSearch1 = new ItemSearch();
        itemSearch1.setWord("과자");

        ItemSearch itemSearch2 = new ItemSearch();
        itemSearch2.setWord("과자");
        itemSearch2.setBasketId(1L);

        ItemSearch itemSearch3 = new ItemSearch();
        itemSearch3.setWord("포카칩");
        itemSearch3.setBasketId(1L);

        assertEquals(5, itemRepository.getItemsUsingFilter(itemSearch1).size());
        assertEquals(0, itemRepository.getItemsUsingFilter(itemSearch2).size());
        assertEquals(3, itemRepository.getItemsUsingFilter(itemSearch3).size());
        assertEquals(10, itemRepository.getAllInBasket(null).size());
        assertEquals(7, itemRepository.getAllInBasket(2L).size());
        assertEquals(3, itemRepository.getAllInBasket(1L).size());


    }
}