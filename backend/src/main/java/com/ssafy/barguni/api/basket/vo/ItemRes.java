package com.ssafy.barguni.api.basket.vo;

import com.ssafy.barguni.api.item.Item;
import lombok.Data;

@Data
public class ItemRes {
    private Long itemId;
    private String name;
    private String category;
    private String content;
    private String pictureUrl;

    public ItemRes(Item item){
        this.name = item.getName();
        if(item.getCategory() != null)
            this.category = item.getCategory().getName();
        this.itemId = item.getId();
        this.content = item.getContent();
        if(item.getPicture() != null)
            this.pictureUrl = item.getPicture().getPicUrl();
    }
}
