package com.ssafy.barguni.common.interceptor;

import com.ssafy.barguni.api.error.ErrorResVO;
import com.ssafy.barguni.api.error.Exception.JwtException;
import com.ssafy.barguni.common.util.JwtTokenUtil;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import static com.ssafy.barguni.api.error.ErrorCode.JWT_INVALID;
import static com.ssafy.barguni.api.error.ErrorCode.JWT_NOT_EXIST;

@Component
@Slf4j
public class JwtInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        log.debug("jwt 토큰 유무 확인 인터셉터");
        String jwtToken = request.getHeader("Authorization");
        if(jwtToken == null) {
            log.error("jwt 토큰이 없습니다.");
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            throw new JwtException(new ErrorResVO(JWT_NOT_EXIST));
        }
        else if(!jwtToken.startsWith(JwtTokenUtil.TOKEN_PREFIX)) {
            log.error("jwt 토큰이 유효하지 않습니다.");
            throw  new JwtException(new ErrorResVO(JWT_INVALID));
        }

        return true;

    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
                           ModelAndView modelAndView) throws Exception {
        // TODO Auto-generated method stub

    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
            throws Exception {
        // TODO Auto-generated method stub

    }

}