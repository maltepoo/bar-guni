package com.ssafy.barguni.api.error;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResVO {
    private String message;
    private String code;
    private HttpStatus status;

    public ErrorResVO(ErrorCode errorCode){
        this.message = errorCode.getMessage();
        this.code = errorCode.getCode();
        this.status = errorCode.getStatus();
    }
}
