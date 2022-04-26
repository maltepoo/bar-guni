package com.ssafy.barguni.api.item;

import com.ssafy.barguni.api.basket.entity.Basket;
import com.ssafy.barguni.api.basket.entity.Categories;
import com.ssafy.barguni.api.Picture.Picture;
import com.ssafy.barguni.api.item.vo.ItemPostReq;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Getter @Setter
public class Item {
    @Id @GeneratedValue
    @Column(name="item_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="bkt_id")
    private Basket basket;

    @OneToOne(fetch =FetchType.LAZY)
    @JoinColumn(name="pic_id")
    private Picture picture;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="cate_id")
    private Categories category;

    private String name;
    private LocalDate regDate;

    @Enumerated(value = EnumType.STRING)
    private AlertBy alertBy;
    private Long DDAY;
    private LocalDate shelfLife;
    private String content;

    private Boolean used;
    private LocalDate usedDate;


    public static Item createItem(Basket bkt, Picture pic, Categories cate, ItemPostReq req) {
        Item item = new Item();
        // 아직 안 만들어져서 걍 주석처리
//        item.setBasket(bkt);
//        item.setPicture(pic);
//        item.setCategory(cate);
        item.setName(req.getName());
        item.setRegDate(LocalDate.now());
        item.setAlertBy(req.getAlertBy());
        // if문 안 쓰고 그냥 두개 다 사용
        item.setDDAY(req.getDDAY());
        item.setShelfLife(req.getShelfLife());
        item.setContent(req.getContent());

        return item;
    }
}
