package com.ssafy.barguni.api.error;

import com.ssafy.barguni.api.error.Exception.BasketException;
import com.ssafy.barguni.api.error.Exception.JwtException;
import com.ssafy.barguni.api.error.Exception.OauthException;
import com.ssafy.barguni.api.error.Exception.UsersException;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import static com.ssafy.barguni.api.error.ErrorCode.SERVER_INTERNAL_ERROR;


@RestControllerAdvice
@Tag(name = "common error handler", description = "공통 오류 관련 핸들러")
@Slf4j
public class CommonErrorHandler {
//    private final Logger log = LoggerFactory.getLogger(CommonErrorHandler.class);

    // 바구니 관련 오류
    @ExceptionHandler(BasketException.class)
    protected ResponseEntity<ErrorResVO> handleBasketException(BasketException e) {
        log.error("handleBasketException 핸들");
        return new ResponseEntity<>(e.getErrorResVO(), e.getErrorResVO().getStatus());
    }

    // Jwt 토큰 관련 오류
    @ExceptionHandler(JwtException.class)
    protected ResponseEntity<ErrorResVO> handleJwtException(JwtException e) {
        log.error("handleJwtException 핸들");
        return new ResponseEntity<>(e.getErrorResVO(), e.getErrorResVO().getStatus());
    }

    // Oauth 관련 오류
    @ExceptionHandler(OauthException.class)
    protected ResponseEntity<ErrorResVO> handleOuathException(OauthException e) {
        log.error("handleOauthException 핸들");
        return new ResponseEntity<>(e.getErrorResVO(), e.getErrorResVO().getStatus());
    }

    // 유저 관련 오류
    @ExceptionHandler(UsersException.class)
    protected ResponseEntity<ErrorResVO> handleUserException(UsersException e) {
        log.error("handleBasketException 핸들");
        return new ResponseEntity<>(e.getErrorResVO(), e.getErrorResVO().getStatus());
    }

    // 알 수 없는 서버 내부 오류
    @ExceptionHandler(Exception.class)
    protected ResponseEntity<ErrorResVO> handleException(Exception e) {
        log.error("handleException 핸들", e);
        return new ResponseEntity<>(
                new ErrorResVO(SERVER_INTERNAL_ERROR)
                ,HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
