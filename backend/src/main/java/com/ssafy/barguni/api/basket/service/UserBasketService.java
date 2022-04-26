package com.ssafy.barguni.api.basket.service;

import com.ssafy.barguni.api.basket.entity.UserAuthority;
import com.ssafy.barguni.api.basket.entity.UserBasket;
import com.ssafy.barguni.api.basket.repository.UserBasketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserBasketService {
    private final UserBasketRepository userBasketRepository;

    public UserBasket findByUserAndBasket(Long userId, Long basketId){
        return userBasketRepository.findByUserIdAndBasketId(userId, basketId);
    }

    @Transactional
    public void modifyAuthority(Long basketId, Long userId, UserAuthority authority) {
        UserBasket ub = userBasketRepository.findByUserIdAndBasketId(userId, basketId);
        ub.setAuthority(authority);
    }
}
