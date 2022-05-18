package com.ssafy.barguni.api.alert;

import com.ssafy.barguni.api.basket.entity.Basket;
import com.ssafy.barguni.api.item.AlertBy;
import com.ssafy.barguni.api.item.Item;
import com.ssafy.barguni.api.item.ItemService;
import com.ssafy.barguni.api.user.User;
import com.ssafy.barguni.api.user.UserBasket;
import com.ssafy.barguni.api.user.UserBasketRepository;
import com.ssafy.barguni.api.user.UserBasketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Transactional // 모든 알림이 다 등록하고 insert 일괄로 처리
@Slf4j
@EnableAsync
public class AlertScheduler {
    private final static Integer EXPIRATION_ALERT_PERIOD = 7;
    private final UserBasketService userBasketService;
    private final AlertService alertService;
    private final ItemService itemService;

    // (초 분 시 일 월)
//    @Scheduled(cron="${schedular.alert.time}")
    @Scheduled(cron="0 0 0 * * ?") // 매일 오전 00시에 동작
    @Async
    public void createAlert(){
        long start = System.currentTimeMillis();

        itemService.findAll().forEach((item)->{
            // 이미 사용한 경우는 제외
            if(item.getUsed())
                return;

            // 기간 설정이 잘 못된 경우 알림 생성 불가능
            if(item.getAlertBy() == null)
                return;
            else if(item.getAlertBy() == AlertBy.D_DAY
                    && (item.getRegDate() == null || item.getDDAY() == null))
                return;
            else if(item.getAlertBy() == AlertBy.SHELF_LIFE
                    && item.getShelfLife() == null)
                return;

            // 유통기한 지남 알림
            if(
                    // 유통기한으로 관리되는 경우
                    (item.getAlertBy() == AlertBy.SHELF_LIFE
                    && LocalDate.now().compareTo(item.getShelfLife()) > 0)
                    // D Day 로 관리되는 경우
                    || (item.getAlertBy() == AlertBy.D_DAY
                    && LocalDate.now().compareTo(item.getRegDate().plusDays(item.getDDAY())) > 0)
            ) {
                alertService.createAlertAfterExpiry(item);
                return;
            }

            // 유통기한 임박 알림
            if(     // 유통기한으로 관리되는 경우
                    (item.getAlertBy() == AlertBy.SHELF_LIFE
                    && LocalDate.now().compareTo(item.getShelfLife().minusDays(EXPIRATION_ALERT_PERIOD)) >= 0)
                    // D Day 로 관리되는 경우
                    || (item.getAlertBy() == AlertBy.D_DAY
                    && LocalDate.now().compareTo(item.getRegDate().plusDays(item.getDDAY()-EXPIRATION_ALERT_PERIOD)) >= 0)
            ) alertService.createAlertBeforeExpiry(item);

        });


        long end = System.currentTimeMillis();
        log.debug("총 걸린 시간: " + (end - start) + " ms");
    }


//    @Scheduled(cron="30 0 * * * ?") // 매 시각마다(*시0분3초) 동작
    @Scheduled(cron="30 * * * * ?") // 매 시각마다(*시0분3초) 동작
    @Async
    public void sendAlert() {
        Integer hour = LocalDateTime.now().getHour();
        List<UserBasket> ubs = userBasketService.getListByAlertTime(hour);
        // 알러트를 가져오고 유저-아림
        for (UserBasket ub: ubs) {
            User user = ub.getUser();
            Basket basket = ub.getBasket();
            Integer result = alertService.countAllCreatedTodayByBasket(basket);
            if (result == 0) continue;
            try {
                alertService.sendAlert(user.getAlertApiKey(), result);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

}
