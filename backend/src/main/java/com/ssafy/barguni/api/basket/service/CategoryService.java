package com.ssafy.barguni.api.basket.service;

import com.ssafy.barguni.api.basket.entity.Basket;
import com.ssafy.barguni.api.basket.entity.Categories;
import com.ssafy.barguni.api.basket.repository.BasketRepository;
import com.ssafy.barguni.api.basket.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final BasketRepository basketRepository;

    public Categories getById(Long id){
        return categoryRepository.getById(id);
    }

    public Boolean isDuplicated(Long basketId, String name){
        return categoryRepository.existsByBasketIdAndName(basketId, name);
    }

    @Transactional
    public Long register(Long basketId, String name) {
        Categories category = new Categories();
        Basket basket = basketRepository.getById(basketId);
        category.setName(name);
        category.setBasket(basket);
        Categories save = categoryRepository.save(category);

        // 동일 바구니 내 같은 카테고리명 불가능

        return save.getId();
    }

    @Transactional
    public void modify(Long categoryId, String name) {
        Categories category = categoryRepository.getById(categoryId);
        category.setName(name);
    }

    public List<Categories> getByBasketId(Long basketId){
        return categoryRepository.getAllByBasketId(basketId);
    }

    public void delete(Long categoryId) {
        categoryRepository.deleteById(categoryId);
    }
}
