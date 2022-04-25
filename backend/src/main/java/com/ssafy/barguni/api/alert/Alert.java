package com.ssafy.barguni.api.alert;

import com.ssafy.barguni.api.basket.Basket;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter @Setter
public class Alert {
    @Id @GeneratedValue
    @Column(name="alert_id")
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="bkt_id")
    private Basket basket;
    private String title;
    private String content;
    @Enumerated(value = EnumType.STRING)
    private AlertStatus status;

}
