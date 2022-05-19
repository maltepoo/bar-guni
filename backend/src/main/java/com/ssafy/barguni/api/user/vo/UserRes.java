package com.ssafy.barguni.api.user.vo;

import com.ssafy.barguni.api.basket.entity.Basket;
import com.ssafy.barguni.api.basket.vo.BasketRes;
import com.ssafy.barguni.api.user.User;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserRes {

    private Long userId;
    private String email;
    private String name;
    private BasketRes defaultBasket;
    private Integer alertTime;

    public UserRes(Long userId, String email, String name, Basket defaultBasket, Integer alertTime) {
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.defaultBasket = defaultBasket instanceof Basket? new BasketRes(defaultBasket) : null;
        this.alertTime = alertTime;
    }

    public static UserRes convertTo(User user) {
        return new UserRes(user.getId(), user.getEmail(), user.getName(), user.getDefaultBasket(), user.getAlertTime());
    }
}
