package com.ssafy.barguni.common.aop;

import com.ssafy.barguni.api.error.ErrorCode;
import com.ssafy.barguni.api.error.ErrorResVO;
import com.ssafy.barguni.api.error.Exception.BasketException;
import com.ssafy.barguni.api.user.UserBasketService;
import com.ssafy.barguni.common.auth.AccountUserDetails;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

@Aspect
@Component
@RequiredArgsConstructor
public class BasketAop {
    private final UserBasketService userBasketService;
    private final Logger logger = LoggerFactory.getLogger(CommonAop.class);

    @Pointcut("execution(* com.ssafy.barguni.api..BasketController..*(..))")
    private void cutBasket(){}

    // Basket Controller가 실행되기 전에 수행
    @Before("cutBasket()")
    public void beforeBasket(JoinPoint joinPoint) {
        //JoinPoint = 들어가는 지점에 대한 객체를 가진 메서드
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        Method method = methodSignature.getMethod();

        logger.debug("basket aop 출력");

        // 바구니 생성일 땐, 접근성 검사 제외
        if(method.equals("createBasket"))
            return;

        Object[] args = joinPoint.getArgs();
        for(Object obj : args) {
            if("Long".equals(obj.getClass().getSimpleName())){
                Long basketId = (Long)obj;
                AccountUserDetails userDetails = (AccountUserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();
                Long userId = userDetails.getUserId();
                if(!userBasketService.existsByUserAndBasket(userId, basketId))
                    throw new BasketException(new ErrorResVO(ErrorCode.BASKET_FORBIDDEN));

                break;
            }
        }
    }
}
