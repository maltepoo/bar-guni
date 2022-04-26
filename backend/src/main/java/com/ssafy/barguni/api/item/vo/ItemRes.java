package com.ssafy.barguni.api.item.vo;

import com.ssafy.barguni.api.item.AlertBy;
import com.ssafy.barguni.api.item.Item;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ItemRes {
    private Long itemId;
    private String name;
    private LocalDate regDate;
    private AlertBy alertBy;
    private Long DDay;
    private LocalDate shelfLife;
    private LocalDate usedDate;
    private String category;
    private String content;
    private String pictureUrl;

    public ItemRes(Item item){
        this.name = item.getName();
        if(item.getCategory() != null)
            this.category = item.getCategory().getName();
        this.regDate = item.getRegDate();
        this.alertBy = item.getAlertBy();

        if (item.getAlertBy() == AlertBy.D_DAY) {
            this.DDay = item.getDDAY();
        } else if (item.getAlertBy() == AlertBy.SHELF_LIFE) {
            this.shelfLife = item.getShelfLife();
        }
        if (item.getUsed()) {
            this.usedDate = item.getUsedDate();
        }
        this.itemId = item.getId();
        this.content = item.getContent();
        if(item.getPicture() != null)
            this.pictureUrl = item.getPicture().getPicUrl();
    }
}
