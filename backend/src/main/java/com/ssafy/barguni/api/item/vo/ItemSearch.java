package com.ssafy.barguni.api.item.vo;

import lombok.Data;

import java.util.List;

@Data
public class ItemSearch {
    private String word;
    private List<Long> basketIds;
    private Boolean used;
}
