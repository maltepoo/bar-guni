package com.ssafy.barguni.api.basket;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final BasketRepository basketRepository;

    @Transactional
    public Long register(Long basketId, String name) {
        Categories category = new Categories();
        Basket basket = basketRepository.getById(basketId);
        category.setName(name);
        category.setBasket(basket);
        Categories save = categoryRepository.save(category);

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
