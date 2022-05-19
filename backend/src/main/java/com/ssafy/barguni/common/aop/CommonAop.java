package com.ssafy.barguni.common.aop;

import com.ssafy.barguni.api.error.ErrorCode;
import com.ssafy.barguni.api.error.ErrorResVO;
import com.ssafy.barguni.api.error.Exception.BasketException;
import com.ssafy.barguni.api.user.UserBasketService;
import com.ssafy.barguni.common.auth.AccountUserDetails;
import com.ssafy.barguni.common.interceptor.JwtInterceptor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class CommonAop {
    private final UserBasketService userBasketService;

    @Pointcut("execution(* com.ssafy.barguni.api..controller..*(..))")
    private void controllerCut1(){}

    @Pointcut("execution(* com.ssafy.barguni.api..*Controller..*(..))")
    private void controllerCut2(){}

    // 모든 Controller가 실행되기 전에 수행
    @Before("controllerCut1() || controllerCut2()")
    public void controllerBefore(JoinPoint joinPoint) {
        //JoinPoint = 들어가는 지점에 대한 객체를 가진 메서드
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        Method method = methodSignature.getMethod();
        log.debug("common aop 출력");
        log.debug(joinPoint.getTarget().toString());
        log.debug(method.getName());

        Object[] args = joinPoint.getArgs();
        //메서드에 들어가는 매개변수들에 대한 배열

        for(Object obj : args) {
            if(obj == null) continue;
            log.debug(obj.toString());
            log.debug("type : "+obj.getClass().getSimpleName());
            log.debug("value : "+obj);
        }
    }

}
