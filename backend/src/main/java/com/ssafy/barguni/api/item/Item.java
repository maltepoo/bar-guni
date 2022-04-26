package com.ssafy.barguni.api.item;

import com.ssafy.barguni.api.basket.entity.Basket;
import com.ssafy.barguni.api.basket.entity.Categories;
import com.ssafy.barguni.api.common.Picture;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDateTime;

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
    private LocalDateTime regDate;

    @Enumerated(value = EnumType.STRING)
    private AlertBy alertBy;
    private Long DDAY;
    private LocalDateTime shelfLife;
    private String content;

    private Boolean used;
    private LocalDateTime usedDate;
}
