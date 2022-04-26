package com.ssafy.barguni.api.user;

import com.ssafy.barguni.api.basket.entity.Basket;
import com.ssafy.barguni.api.basket.entity.UserAuthority;
import com.ssafy.barguni.api.basket.entity.UserBasket;
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

    public Optional<UserBasket> addMark(User user, Long bkt_id) {
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
}
