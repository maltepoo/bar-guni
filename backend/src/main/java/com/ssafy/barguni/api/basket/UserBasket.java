package com.ssafy.barguni.api.basket;

import com.ssafy.barguni.api.user.User;
import com.ssafy.barguni.api.user.UserAuthority;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter @Setter
public class UserBasket {
    @Id @GeneratedValue
    @Column(name="u_b_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name="bkt_id")
    private Basket basket;

    @Enumerated
    private UserAuthority authority;
}
