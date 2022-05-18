package com.ssafy.barguni.api.user;

import com.ssafy.barguni.api.basket.entity.Basket;
import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

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


    @Min(value = 0)
    @Max(value = 23)
    private Integer alertTime;

    public User(){}

    @Builder
    public User(String email, String name) {
        this.email = email;
        this.name = name;
    }

}
