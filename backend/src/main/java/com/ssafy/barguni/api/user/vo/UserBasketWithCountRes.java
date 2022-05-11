package com.ssafy.barguni.api.user.vo;

import com.ssafy.barguni.api.user.UserAuthority;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserBasketWithCountRes {
    private Long user_id;
    private Long bkt_id;
    private UserAuthority authority;
    private String bkt_name;
    private Long count;

    public UserBasketWithCountRes(Long userId,
                                  Long basketId,
                                  UserAuthority userAuthority,
                                  String basketName,
                                  Long count){
        this.bkt_id = basketId;
        this.user_id = userId;
        this.authority = userAuthority;
        this.bkt_name = basketName;
        this.count = count;
    }
}
