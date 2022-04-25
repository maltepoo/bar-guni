package com.ssafy.barguni.api.basket.vo;

import com.ssafy.barguni.api.basket.Basket;
import lombok.Data;

@Data
public class BasketRes {
    private String name;
    private String profileUrl;
    private String joinCode;

    public BasketRes(Basket basket) {
        this.name = basket.getName();
        this.joinCode = basket.getJoinCode();
        if(basket.getPicture() != null)
            this.profileUrl = basket.getPicture().getPicUrl();
    }
}
