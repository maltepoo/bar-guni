package com.ssafy.barguni.api.user;

import com.ssafy.barguni.api.basket.entity.Basket;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter @Setter
public class UserBasket {
    @Id @GeneratedValue
    @Column(name="u_b_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="bkt_id")
    private Basket basket;

    @Enumerated(value = EnumType.STRING)
    private UserAuthority authority;
}
