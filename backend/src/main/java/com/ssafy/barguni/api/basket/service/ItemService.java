package com.ssafy.barguni.api.basket.service;

import com.ssafy.barguni.api.basket.repository.ItemRepository;
import com.ssafy.barguni.api.basket.vo.ItemSearch;
import com.ssafy.barguni.api.basket.service.item.Item;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService {
    private final ItemRepository itemRepository;

    public List<Item> getAllInBasket(Long basketId){
        return itemRepository.getAllInBasket(basketId == -1 ? null : basketId);
    }

    public List<Item> getItemsUsingFilter(ItemSearch itemSearch){
        return itemRepository.getItemsUsingFilter(itemSearch);
    }

}
