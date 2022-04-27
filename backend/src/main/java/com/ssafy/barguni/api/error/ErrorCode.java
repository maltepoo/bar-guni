package com.ssafy.barguni.api.error;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    SERVER_INTERNAL_ERROR("서버 내부 오류가 발생했습니다.", "S000", HttpStatus.INTERNAL_SERVER_ERROR),

    BASKET_NOT_FOUNDED("해당 바구니가 존재하지 않습니다.","B001",HttpStatus.NOT_FOUND),
    BASKET_NOT_DELETED_BY_NON_ADMIN("바구니는 관리자만 삭제할 수 있습니다.", "B002", HttpStatus.UNAUTHORIZED),
    BASKET_USED_BY_OTHERS("해당 바구니의 다른 이용자가 존재합니다.", "B003", HttpStatus.NOT_ACCEPTABLE),
    BASKET_NOT_EMPTY("바구니 내 아이템이 남아있습니다.", "B004", HttpStatus.NOT_ACCEPTABLE),

    JWT_NOT_EXIST("로그인이 필요합니다.", "J001", HttpStatus.UNAUTHORIZED),
    JWT_INVALID("로그인이 필요합니다.","J002", HttpStatus.UNAUTHORIZED)

    ;

    private final String message;
    private final String code;
    private final HttpStatus status;

}
