package com.ssafy.barguni.api.product;

import com.ssafy.barguni.api.Picture.Picture;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter @Setter
public class Product {
    @Id @GeneratedValue
    @Column(name="prod_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="pic_id")
    private Picture picture;
    // 바코드를 아이디로?
    private String barcode;
    private String name;

    public static Product createProduct(Picture pic, String barcode, String name) {
        Product product = new Product();
        // 아직 안 만들어져서 걍 주석처리
//        item.setPicture(pic);
        product.barcode = barcode;
        product.name = name;

        return product;
    }
}
