package com.ssafy.barguni.api.product;

import com.ssafy.barguni.api.Picture.Picture;
import com.ssafy.barguni.api.item.AlertBy;
import com.ssafy.barguni.api.item.Item;
import lombok.Data;


@Data
public class ProductRes {
    private String name;
    private String pictureUrl;
    private String barcode;

    public ProductRes(Product product){
        this.name = product.getName();
        if(product.getPicture() != null)
            this.pictureUrl = product.getPicture().getPicUrl();
        this.barcode = product.getBarcode();
    }
}
