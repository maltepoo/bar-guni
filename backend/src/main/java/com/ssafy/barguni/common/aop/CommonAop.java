package com.ssafy.barguni.common.aop;

import com.ssafy.barguni.common.interceptor.JwtInterceptor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;

@Aspect
@Component
public class CommonAop {
    private final Logger logger = LoggerFactory.getLogger(CommonAop.class);
    @Pointcut("execution(* com.ssafy.barguni.api..controller..*(..))")
    private void cut(){}

//    @Pointcut("execution(* com.ssafy.barguni.api.basket.controller.BasketController.createBasketUser(..))")
//    private void cut1(){}
//    @Pointcut("execution(* com.ssafy.barguni.api.basket.controller.BasketController.deleteBasketUser(..))")
//    private void cut2(){}

//    @Before("cut1() || cut2()") //cut()메서드가 실행되기 이전
    @Before("cut()") //cut()메서드가 실행되기 이전
    public void before(JoinPoint joinPoint) {
        //JoinPoint = 들어가는 지점에 대한 객체를 가진 메서드
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        Method method = methodSignature.getMethod();
        logger.debug("common aop 출력");
        logger.debug(joinPoint.getTarget().toString());
        logger.debug(method.getName());

        Object[] args = joinPoint.getArgs();
        //메서드에 들어가는 매개변수들에 대한 배열

        for(Object obj : args) {
            logger.debug("type : "+obj.getClass().getSimpleName());
            logger.debug("value : "+obj);
        }
    }
}
