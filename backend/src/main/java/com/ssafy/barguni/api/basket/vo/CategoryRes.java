package com.ssafy.barguni.api.basket.vo;

import com.ssafy.barguni.api.basket.Categories;
import lombok.Data;

import java.util.List;

@Data
public class CategoryRes {
    private Long cateId;
    private String name;

    public CategoryRes(){}

    public CategoryRes(Categories category){
        this.cateId = category.getId();
        this.name = category.getName();
    }
}
