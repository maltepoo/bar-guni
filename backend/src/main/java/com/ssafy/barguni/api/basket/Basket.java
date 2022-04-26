package com.ssafy.barguni.api.basket;

import com.ssafy.barguni.api.Picture.Picture;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter @Setter
public class Basket {
    @Id @GeneratedValue
    @Column(name="bkt_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="pic_id")
    private Picture picture;

    private String name;
    private String joinCode;
}
