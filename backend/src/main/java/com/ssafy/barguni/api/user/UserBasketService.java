package com.ssafy.barguni.api.user;

import com.ssafy.barguni.api.basket.entity.Basket;
import com.ssafy.barguni.api.basket.repository.BasketRepository;
import com.ssafy.barguni.api.error.ErrorResVO;
import com.ssafy.barguni.api.error.Exception.BasketException;
import com.ssafy.barguni.api.error.Exception.UsersException;
import com.ssafy.barguni.api.user.vo.UserBasketWithCountRes;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static com.ssafy.barguni.api.error.ErrorCode.BASKET_NOT_FOUNDED;
import static com.ssafy.barguni.api.error.ErrorCode.USER_NOT_FOUNDED;

import static com.ssafy.barguni.api.error.ErrorCode.*;
@Service
@RequiredArgsConstructor
@Transactional
public class UserBasketService {

    private final UserRepository userRepository;
    private final UserBasketRepository userBasketRepository;
    private final BasketRepository basketRepository;

    public List<UserBasketWithCountRes> findAllBasketWithCountByUser(Long userId) {
        User user = userRepository.getById(userId);
        if(user == null)
            throw new UsersException(new ErrorResVO(USER_NOT_FOUNDED));

        List<UserBasketWithCountRes> userBaskets = userBasketRepository.findAllBasketWithCountByUser(userId);

        return userBaskets;
    }

    public List<UserBasket> findByUserId(Long userId) {
        User user = userRepository.getById(userId);
        if(user == null)
            throw new UsersException(new ErrorResVO(USER_NOT_FOUNDED));

        List<UserBasket> userBaskets = userBasketRepository.findByUserId(userId);

        return userBaskets;
    }

    public Optional<UserBasket> addBasket(Long user_id, Long bkt_id) {
        User user = userRepository.getById(user_id);
        Basket basket = basketRepository.getById(bkt_id);
        UserBasket userBasket = new UserBasket();

        userBasket.setUser(user);
        userBasket.setBasket(basket);
        userBasket.setAuthority(UserAuthority.MEMBER);

        userBasket = userBasketRepository.save(userBasket);

        return Optional.ofNullable(userBasket);
    }

    public UserBasket findByUserAndBasket(Long userId, Long basketId){
        if(!userRepository.existsById(userId))
            throw new UsersException(new ErrorResVO(USER_NOT_FOUNDED));
        if(!basketRepository.existsById(basketId))
            throw new BasketException(new ErrorResVO(BASKET_NOT_FOUNDED));

        UserBasket userBasket = userBasketRepository.findByUserIdAndBasketId(userId, basketId);
        if(userBasket == null)
            throw new UsersException(new ErrorResVO(USER_BASKET_NOT_FOUNDED));

        return userBasket;
    }

    public Boolean existsByUserAndBasket(Long userId, Long basketId){
        return userBasketRepository.existsByUserIdAndBasketId(userId, basketId);
    }

    @Transactional
    public void modifyAuthority(Long basketId, Long userId, UserAuthority authority) {
        UserBasket ub = userBasketRepository.findByUserIdAndBasketId(userId, basketId);
        ub.setAuthority(authority);
    }

    public boolean existsBybktId(Long user_id, Long bkt_id) {
        if(!userRepository.existsById(user_id))
            throw new UsersException(new ErrorResVO(USER_NOT_FOUNDED));
        if(!basketRepository.existsById(bkt_id))
            throw new BasketException(new ErrorResVO(BASKET_NOT_FOUNDED));

        return userBasketRepository.existsBybktId(user_id, bkt_id);
    }

    public void deleteById(Long user_id, Long basketId) {
        User user = userRepository.getById(user_id);
        if(user == null)
            throw new UsersException(new ErrorResVO(USER_NOT_FOUNDED));
        userBasketRepository.deleteById(user_id, basketId);
        // 권한 양도 로직 추가
    }

    public List<Long> getUsedBasketIds(){
        return userBasketRepository.getUsedBasketIds();
    }
}
