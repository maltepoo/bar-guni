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
    BASKET_FORBIDDEN("접근할 수 없는 바구니입니다.", "B005", HttpStatus.FORBIDDEN),

    JWT_NOT_EXIST("로그인이 필요합니다.", "J001", HttpStatus.UNAUTHORIZED),
    JWT_INVALID("로그인이 필요합니다.","J002", HttpStatus.UNAUTHORIZED),
    JWT_ACCESS_TOKEN_EXPIRED("ACCESS TOKEN 기한이 만료되었습니다.","J003",HttpStatus.UNAUTHORIZED),
    JWT_REFRESH_TOKEN_EXPIRED("REFRESH TOKEN 기한이 만료되었습니다.","J004",HttpStatus.UNAUTHORIZED),

    OAUTH_INVALID_AUTHORIZATION_CODE("AUTHORIZATION CODE 가 유효하지 않습니다.", "O001", HttpStatus.UNAUTHORIZED),
    OAUTH_INVALID_ACCESS_TOKEN("ACCESS TOKEN 이 유효하지 않습니다.", "O002", HttpStatus.UNAUTHORIZED),
    OAUTH_EMAIL_NOT_ALLOWED("이메일 정보 제공 동의가 필요합니다.","O003", HttpStatus.NOT_ACCEPTABLE),

    CATEGOTY_DUPLICATED("이미 등록된 카테고리입니다.", "C001", HttpStatus.NOT_ACCEPTABLE)
    ;

    private final String message;
    private final String code;
    private final HttpStatus status;

}
