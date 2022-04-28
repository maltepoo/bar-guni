package com.ssafy.barguni.api.alert;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    @Query("select b.alerts from UserBasket ub " +
            " join ub.user u " +
            " join ub.basket b " +
            " where u.id = :id")
    List<Alert> findAllByUserId(Long id);
}
