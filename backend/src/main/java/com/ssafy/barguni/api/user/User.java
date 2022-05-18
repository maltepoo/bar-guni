package com.ssafy.barguni.api.user;

import com.ssafy.barguni.api.basket.entity.Basket;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter @Setter
@Table(name="users")
public class User {
    @Id @GeneratedValue
    @Column(name="user_id")
    private Long id;

    @Column(unique = true)
    private String email;

    private String name;
    private String alertApiKey;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="default_bkt")
    private Basket defaultBasket;

    public User(){}

    @Builder
    public User(String email, String name) {
        this.email = email;
        this.name = name;
    }

}
