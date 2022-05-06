package com.ssafy.barguni.api.item;

import com.ssafy.barguni.api.item.vo.ItemSearch;

import java.util.List;

public interface CustomItemRepository {
    public List<Item> getAllInBasket(Long basketId, Boolean used);
    public List<Item> getMyAllItems(List<Long> basketIds, Boolean used);
    public List<Item> getItemsUsingFilter(ItemSearch itemSearch);
}
