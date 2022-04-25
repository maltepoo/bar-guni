package com.ssafy.barguni.api.basket;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter @Setter
public class Categories {
    @Id @GeneratedValue
    @Column(name="cate_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="bkt_id")
    private Basket basket;

    private String name;
}
