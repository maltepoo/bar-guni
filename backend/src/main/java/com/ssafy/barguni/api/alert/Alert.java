package com.ssafy.barguni.api.alert;

import com.ssafy.barguni.api.basket.entity.Basket;
import com.ssafy.barguni.api.item.AlertBy;
import com.ssafy.barguni.api.item.Item;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.BatchSize;

import javax.persistence.*;
import java.time.LocalDate;

@BatchSize(size=300)
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

    public Alert(){}

    public Alert(Item item, String msg) {
        this.title = item.getName() + msg;
        this.status = AlertStatus.UNCHECKED;
        this.basket = item.getBasket();

        LocalDate expirationDate = item.getAlertBy() == AlertBy.SHELF_LIFE ?
                item.getShelfLife() : item.getRegDate().plusDays(item.getDDAY());

        this.content = item.getBasket().getName()
                + " 안의 " + item.getName()
                + " 의 유통기한은 " + expirationDate + "까지 입니다.";
    }
}
