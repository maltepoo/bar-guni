package com.ssafy.barguni.api.common;

import lombok.Data;

@Data
public class ResVO<T> {
    private String message;
    private T data;
}
