package com.ssafy.barguni.api.alert;

import com.ssafy.barguni.api.basket.entity.Basket;
import com.ssafy.barguni.api.basket.repository.BasketRepository;
import com.ssafy.barguni.api.item.Item;
import com.ssafy.barguni.api.item.ItemRepository;
import com.ssafy.barguni.api.user.User;
import com.ssafy.barguni.api.user.UserBasket;
import com.ssafy.barguni.api.user.UserBasketRepository;
import com.ssafy.barguni.api.user.UserBasketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AlertService {
    private final AlertRepository alertRepository;
    private final BasketRepository basketRepository;
    private final ItemRepository itemRepository;
    private final FirebaseAlertService firebaseAlertService;

    public List<Alert> findAllByUserId(Long userId){
        List<Alert> alerts = alertRepository.findAllByUserId(userId);
        alerts.forEach((alert)->{
            basketRepository.getById(alert.getBasket().getId());
            itemRepository.getById(alert.getItem().getId());
        });
        return alerts;
    }

    public Integer countAllCreatedTodayByBasket(Basket basket){
        return alertRepository.countAlertsByBasket_IdAAndCreatedAt(basket.getId(), LocalDate.now());
    }

    @Transactional
    public void updateStatusById(Long alertId, AlertStatus alertStatus) {
        Alert alert = alertRepository.getById(alertId);
        alert.setStatus(alertStatus);
    }

    @Transactional
    public void deleteById(Long alertId) {
        alertRepository.deleteById(alertId);
    }

    @Transactional
    public void createAlertBeforeExpiry(Item item) {
        alertRepository.save(new Alert(item, "의 유통기한이 임박했습니다."));
    }

    @Transactional
    public void createAlertAfterExpiry(Item item) {
        alertRepository.save(new Alert(item, "의 유통기한이 지났습니다."));
    }

    public void sendAlert(String token, Integer alertCount) throws IOException {
        String title = "유통기한이 얼마 남지 않은 상품이 있어요.";
        String body = alertCount + "개의 상품의 유통기한이 임박합니다.";
        System.out.println(body);
        firebaseAlertService.sendMessageTo(token, title, body);
    }

    @Transactional
    public void createTestAlert(Long itemId){
        Item item = itemRepository.getById(itemId);
        createAlertBeforeExpiry(item);

    }
}
