package com.ssafy.barguni.api.basket.service;

import com.ssafy.barguni.api.basket.entity.Basket;
import com.ssafy.barguni.api.basket.repository.BasketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.Charset;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class BasketService {
    private final BasketRepository basketRepository;

    @Transactional
    public Long createBasket(String name, MultipartFile multipartFile, Long userId) {
        Basket basket = new Basket();
        basket.setName(name);
        String joinCode = null;
        do {
            joinCode = getJoinCode();
        } while(basketRepository.existsByJoinCode(joinCode));
        basket.setJoinCode(joinCode);

        // 그림도 넣기
//        if(!multipartFile.isEmpty())
//            basket.setPicture();

        // UserBasket 중계 테이블에 기록

        Basket save = basketRepository.save(basket);
        return save.getId();
    }

    public Basket getBasket(Long id){
//        return basketRepository.getByIdWithPic(id);
        return basketRepository.getById(id);
    }


    public void updateBasket(Long basketId, String name, MultipartFile multipartFile) {
        Basket basket = basketRepository.getById(basketId);
        basket.setName(name);
        // 그림도 넣기
//        if(!multipartFile.isEmpty()){
//            // 있다면 기존 이미지 삭제
//            basket.setPicture();
//    }
    }

    public void deleteBasket(Long basketId, Long userId) {
        // 삭제 로직 (사용하는 사람이 오직 한명이고 관리자 인 경우만 가능)

    }

    private String getJoinCode(){
        byte[] array = new byte[20]; // length is bounded by 7
        new Random().nextBytes(array);
        String generatedString = new String(array, Charset.forName("UTF-8"));

        return generatedString;
    }

    public Basket findByJoinCode(String joinCode){
        return basketRepository.findByJoinCode(joinCode).get();
    }

}
