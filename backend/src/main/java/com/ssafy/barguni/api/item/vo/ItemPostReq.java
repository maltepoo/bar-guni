package com.ssafy.barguni.api.item.vo;

import com.ssafy.barguni.api.basket.Basket;
import com.ssafy.barguni.api.basket.Categories;
import com.ssafy.barguni.api.common.Picture;
import com.ssafy.barguni.api.item.AlertBy;
import com.ssafy.barguni.api.item.Item;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ItemPostReq {
    private Long bktId;
    private Long picId;
    private Long cateId;

    private String name;
//    private LocalDate regDate;

    private AlertBy alertBy;
    private Long DDAY;
    private LocalDate shelfLife;

    private String content;
//    private Boolean used;
//    private LocalDate usedDate;
}
