package com.ssafy.barguni.api.basket;

import com.ssafy.barguni.api.basket.service.BasketService;
import com.ssafy.barguni.api.user.UserBasketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Component
@RequiredArgsConstructor
@Transactional // 바구니 delete 일괄 처리
@Slf4j
@EnableAsync
public class BasketScheduler {
    private final BasketService basketService;
    private final UserBasketService userBasketService;

    @Scheduled(cron="0 0 2 * * ?") // 매일 오전 2시에 동작
    @Async
    public void deleteNotUsedBaskets(){
        long start = System.currentTimeMillis();

        Set<Long> allIdsSet = new HashSet<>(basketService.getAllIds());
        Set<Long> usedIdsSet = new HashSet<>(userBasketService.getUsedBasketIds());
        allIdsSet.removeAll(usedIdsSet);

        allIdsSet.forEach((id)->{
            basketService.deleteNotUsedBasket(basketService.getBasket(id));
        });

        long end = System.currentTimeMillis();
        log.debug("총 걸린 시간: " + (end - start) + " ms");
    }
}
