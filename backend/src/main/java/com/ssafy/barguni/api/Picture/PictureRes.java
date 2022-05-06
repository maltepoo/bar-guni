package com.ssafy.barguni.api.Picture;

import com.ssafy.barguni.api.item.AlertBy;
import com.ssafy.barguni.api.item.Item;
import lombok.Data;

@Data
public class PictureRes {
    private Long id;
    private String picUrl;
    private String title;

    public PictureRes(Picture pic){
        this.id = pic.getId();
        this.picUrl = pic.getPicUrl();
        this.title = pic.getTitle();
    }
}
