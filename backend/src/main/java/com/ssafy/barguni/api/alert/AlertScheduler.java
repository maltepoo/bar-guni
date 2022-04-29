package com.ssafy.barguni.api.alert;

import com.ssafy.barguni.api.item.AlertBy;
import com.ssafy.barguni.api.item.ItemService;
import com.ssafy.barguni.common.interceptor.JwtInterceptor;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class AlertScheduler {
    private final static Integer EXPIRATION_ALERT_PERIOD = 7;
    private final AlertService alertService;
    private final ItemService itemService;
    private final Logger logger = LoggerFactory.getLogger(AlertScheduler.class);

    // (초 분 시 일 월)
    @Scheduled(cron="0 0 1 * * ?") // 매일 오전 1시에 동작
    public void test(){
        itemService.findAll().forEach((item)->{
            // 이미 사용한 경우는 제외
            if(item.getUsed())
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
        logger.debug(LocalDateTime.now().toString());
    }
}
