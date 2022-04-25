package com.ssafy.barguni.api.common;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
public class Picture {
    @Id @GeneratedValue
    @Column(name="pic_id")
    private Long id;

    private String picUrl;
    private String title;
    private LocalDateTime createdAt;
}
