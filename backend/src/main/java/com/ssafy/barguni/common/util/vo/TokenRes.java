package com.ssafy.barguni.common.util.vo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TokenRes {
    private String accessToken;
    private String refreshToken;
}
