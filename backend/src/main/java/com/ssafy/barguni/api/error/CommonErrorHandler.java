package com.ssafy.barguni.api.error;

import com.ssafy.barguni.api.error.Exception.BasketException;
import com.ssafy.barguni.api.error.Exception.JwtException;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import static com.ssafy.barguni.api.error.ErrorCode.SERVER_INTERNAL_ERROR;


@RestControllerAdvice
@Tag(name = "common error handler", description = "공통 오류 관련 핸들러")
public class CommonErrorHandler {
    private final Logger logger = LoggerFactory.getLogger(CommonErrorHandler.class);

    //바구니 관련 오류
    @ExceptionHandler(BasketException.class)
    protected ResponseEntity<ErrorResVO> handleBasketException(BasketException e) {
//        logger.error("handleBasketException 핸들", e);
        logger.error("handleBasketException 핸들");
        return new ResponseEntity<>(e.getErrorResVO(), e.getErrorResVO().getStatus());
    }

    @ExceptionHandler(JwtException.class)
    protected ResponseEntity<ErrorResVO> handleJwtException(JwtException e) {
//        logger.error("handleBasketException 핸들", e);
        logger.error("handleJwtException 핸들");
        return new ResponseEntity<>(e.getErrorResVO(), e.getErrorResVO().getStatus());
    }

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<ErrorResVO> handleException(Exception e) {
        logger.error("handleException 핸들", e);
        return new ResponseEntity<>(
                new ErrorResVO(SERVER_INTERNAL_ERROR)
                ,HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
