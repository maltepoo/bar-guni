package com.ssafy.barguni.api.user;

import com.ssafy.barguni.api.user.vo.UserBasketWithCountRes;

import java.util.List;

public interface CustomUserBasketRepository {
    List<UserBasketWithCountRes> findAllBasketWithCountByUser(Long id);
}
