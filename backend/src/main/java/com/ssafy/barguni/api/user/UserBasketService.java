package com.ssafy.barguni.api.user;

import com.ssafy.barguni.api.basket.entity.Basket;
import com.ssafy.barguni.api.basket.service.BasketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
@Transactional
public class UserBasketService {

    private final UserBasketRepository userBasketRepository;
    private final BasketService basketService;

    public List<UserBasket> findByUserId(Long userId) {
        return userBasketRepository.findByUserId(userId);
    }

    public Optional<UserBasket> addBasket(User user, Long bkt_id) {
        UserBasket userBasket = new UserBasket();
        Basket basket = basketService.getBasket(bkt_id);

        userBasket.setUser(user);
        userBasket.setBasket(basket);
        userBasket.setAuthority(UserAuthority.MEMBER);

        userBasket = userBasketRepository.save(userBasket);

        return Optional.ofNullable(userBasket);
    }

    public void deleteBybktId(User user, Long bkt_id) {
        userBasketRepository.deleteById(user.getId(), bkt_id);
    }

    public UserBasket findByUserAndBasket(Long userId, Long basketId){
        return userBasketRepository.findByUserIdAndBasketId(userId, basketId);
    }

    @Transactional
    public void modifyAuthority(Long basketId, Long userId, UserAuthority authority) {
        UserBasket ub = userBasketRepository.findByUserIdAndBasketId(userId, basketId);
        ub.setAuthority(authority);
    }

    public boolean existsBybktId(Long user_id, Long bkt_id) {
        return userBasketRepository.existsBybktId(user_id, bkt_id);
    }
}
