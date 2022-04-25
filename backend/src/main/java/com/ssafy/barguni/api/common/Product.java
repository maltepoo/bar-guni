package com.ssafy.barguni.api.common;

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

    private String barcode;
    private String name;

}
