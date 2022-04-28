package com.ssafy.barguni.api.alert.vo;

import com.ssafy.barguni.api.alert.Alert;
import com.ssafy.barguni.api.alert.AlertStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class AlertRes {
    private Long id;
    private Long basketId;
    private String basketName;
    private String title;
    private String content;
    private AlertStatus status;

    public AlertRes(Alert alert){
        this.id = alert.getId();
        this.basketId = alert.getBasket().getId();
        this.basketName = alert.getBasket().getName();
        this.title = alert.getTitle();
        this.content = alert.getContent();
        this.status = alert.getStatus();
    }
}
