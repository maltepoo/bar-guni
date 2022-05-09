package com.ssafy.barguni.api.basket.service;

import com.ssafy.barguni.api.Picture.Picture;
import com.ssafy.barguni.api.Picture.PictureEntity;
import com.ssafy.barguni.api.Picture.PictureRepository;
import com.ssafy.barguni.api.basket.entity.Basket;
import com.ssafy.barguni.api.basket.entity.Categories;
import com.ssafy.barguni.api.basket.repository.BasketRepository;
import com.ssafy.barguni.api.basket.repository.CategoryRepository;
import com.ssafy.barguni.api.error.ErrorResVO;
import com.ssafy.barguni.api.error.Exception.BasketException;
import com.ssafy.barguni.api.item.ItemRepository;
import com.ssafy.barguni.api.user.User;
import com.ssafy.barguni.api.user.UserAuthority;
import com.ssafy.barguni.api.user.UserBasket;
import com.ssafy.barguni.api.user.UserBasketRepository;
import com.ssafy.barguni.common.util.ImageUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.Charset;
import java.util.List;
import java.util.Random;

import static com.ssafy.barguni.api.error.ErrorCode.*;
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BasketService {
    private final BasketRepository basketRepository;
    private final UserBasketRepository userBasketRepository;
    private final PictureRepository pictureRepository;
    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public Long createBasket(String name, MultipartFile multipartFile, User user) {
        Basket basket = new Basket();
        basket.setName(name);
        // 그림도 넣기
        if(multipartFile != null
                && !multipartFile.isEmpty())
        {
            Picture picture = ImageUtil.create(multipartFile, PictureEntity.BASKET);
            pictureRepository.save(picture);
            basket.setPicture(picture);
        }

        // 참여 코드 생성
        String joinCode = null;
        do {
            joinCode = getJoinCode();
        } while(basketRepository.existsByJoinCode(joinCode));
        basket.setJoinCode(joinCode);

        basket = basketRepository.save(basket);

        // 기본 카테고리 생성
        categoryRepository.save(new Categories(basket, "기본"));

        // UserBasket 중계 테이블에 기록
        UserBasket userBasket = new UserBasket();
        userBasket.setBasket(basket);
        userBasket.setUser(user);
        userBasket.setAuthority(UserAuthority.ADMIN);
        userBasketRepository.save(userBasket);


        return basket.getId();
    }

    public Basket getBasket(Long id){
        Basket basket = basketRepository.getByIdWithPic(id);
        if(basket == null)
            throw new BasketException(new ErrorResVO(BASKET_NOT_FOUNDED));
        return basket;
    }


    @Transactional
    public void updateBasket(Long basketId, String name, MultipartFile multipartFile) {
        Basket basket = basketRepository.getById(basketId);
        basket.setName(name);
        // 그림도 넣기
        if(multipartFile != null
                && !multipartFile.isEmpty())
        {
            // 있다면 이미지 업데이트
            basket.setPicture(ImageUtil.update(basket.getPicture(), multipartFile));
        }
    }

    @Transactional
    public Boolean deleteBasket(Long basketId, Long userId) {
        // 관리자가 아닌 경우
        UserBasket userBasket = userBasketRepository.findByUserIdAndBasketId(userId, basketId);
        if(userBasket.getAuthority() != UserAuthority.ADMIN)
            throw new BasketException(new ErrorResVO(BASKET_NOT_DELETED_BY_NON_ADMIN));
        // 다른 이가 사용중인 경우
        if(userBasketRepository.countByBasketId(basketId) != 1)
            throw new BasketException(new ErrorResVO(BASKET_USED_BY_OTHERS));
        // 아이템이 남아있는 겨웅
        if(itemRepository.countByBasketId(basketId) != 0)
            throw new BasketException(new ErrorResVO(BASKET_NOT_EMPTY));

        Basket basket = basketRepository.getById(basketId);
        // 관계 삭제
        userBasketRepository.delete(userBasket);
        // 카테고리 삭제
        categoryRepository.deleteByBasketId(basketId);
        // 바구니 삭제
        basketRepository.deleteById(basketId);
        // 이미지 삭제
        if(basket.getPicture() != null)
        {
            ImageUtil.delete(basket.getPicture());
            pictureRepository.delete(basket.getPicture());
        }
        return true;
    }

    private String getJoinCode(){
        byte[] array = new byte[20]; // length is bounded by 20
        new Random().nextBytes(array);
        String generatedString = new String(array, Charset.forName("UTF-8"));

        return generatedString;
    }

    public Basket findByJoinCode(String joinCode){
        return basketRepository.findByJoinCode(joinCode).get();
    }

    public List<UserBasket> getUsers(Long basketId) {
        return userBasketRepository.findAllUserByBasketId(basketId);
    }
}
