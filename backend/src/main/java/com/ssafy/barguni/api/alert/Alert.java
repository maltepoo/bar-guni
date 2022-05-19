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
    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ALTER_SEQUENCE")
    @SequenceGenerator(name = "ALTER_SEQUENCE", sequenceName = "ALTER_SEQ")
//    @Id @GeneratedValue(strategy = GenerationType.AUTO, generator = "ALERT_NATIVE")
//    @GenericGenerator(name = "ALERT_NATIVE", strategy = "native")
    @Column(name="alert_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="bkt_id")
    private Basket basket;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="item_id")
    private Item item;

    private String title;
    private String content;
    @Enumerated(value = EnumType.STRING)
    private AlertStatus status;

    private LocalDate createdAt;

    public Alert(){}

    public Alert(Item item, String msg) {
        this.title = item.getName() + msg;
        this.status = AlertStatus.UNCHECKED;
        this.basket = item.getBasket();
        this.item = item;
        this.createdAt = LocalDate.now();

        LocalDate expirationDate = item.getAlertBy() == AlertBy.SHELF_LIFE ?
                item.getShelfLife() : item.getRegDate().plusDays(item.getDDAY());

        this.content = item.getBasket().getName()
                + " 안의 " + item.getName()
                + " 의 유통기한은 " + expirationDate + "까지 입니다.";
    }
}
