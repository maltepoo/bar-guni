package com.ssafy.barguni.api.item;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Transactional
public class ItemScheduler {
    private final ItemService itemService;
    private final static Integer daysToDelete = 7;

    @Scheduled(cron="0 0 3 * * ?")
    public void deleteExpiredUsedItem() {
        LocalDate today = LocalDate.now();
        itemService.findAllUsed().forEach((item -> {
            if (item.getUsedDate().plusDays(daysToDelete).isAfter(today)) {
                itemService.deleteItem(item);
            }
        }));
    }
}
