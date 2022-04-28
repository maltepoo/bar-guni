package com.ssafy.barguni.api.basket.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ssafy.barguni.api.Picture.Picture;
import com.ssafy.barguni.api.alert.Alert;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.BatchSize;

import javax.persistence.*;
import java.util.List;

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

    @Column(unique = true)
    private String joinCode;

    @BatchSize(size = 300)
    @OneToMany(mappedBy = "basket", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Alert> alerts;
}
