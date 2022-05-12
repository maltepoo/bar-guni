package com.ssafy.barguni.api.item.vo;

import lombok.Data;

@Data
public class ReceiptItemRes {
    private String name;
//    private String pictureUrl;

//    public ReceiptItemRes(String name, Picture picture){
    public ReceiptItemRes(String name){
        this.name = name;
//        if(picture != null)
//            this.pictureUrl = picture.getPicUrl();
    }
}
