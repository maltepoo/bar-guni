package com.ssafy.barguni.api.basket.service.item.vo;

import com.ssafy.barguni.api.basket.service.item.AlertBy;
import lombok.Data;

import java.time.LocalDate;

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
