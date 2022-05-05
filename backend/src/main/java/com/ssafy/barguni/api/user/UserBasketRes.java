package com.ssafy.barguni.api.user;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter @Setter
public class UserBasketRes {

    private Long id;
    private Long user_id;
    private Long bkt_id;
    private UserAuthority authority;
    private String bkt_name;

    public UserBasketRes(Long id, Long user_id, Long bkt_id, UserAuthority authority, String bkt_name) {
        this.id = id;
        this.user_id = user_id;
        this.bkt_id = bkt_id;
        this.authority = authority;
        this.bkt_name = bkt_name;
    }


    private static UserBasketRes convertToUbRes(UserBasket ub) {
        return new UserBasketRes(ub.getId(), ub.getUser().getId()
                , ub.getBasket().getId(), ub.getAuthority(), ub.getBasket().getName());
    }

    public static List<UserBasketRes> convertToUbResList(List<UserBasket> ubList) {
        List<UserBasketRes> ubResList = new ArrayList<>();
        for (UserBasket ub : ubList){
            ubResList.add(convertToUbRes(ub));
        }
        return ubResList;
    }


}
