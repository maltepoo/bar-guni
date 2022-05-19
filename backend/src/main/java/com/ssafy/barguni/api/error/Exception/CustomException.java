package com.ssafy.barguni.api.error.Exception;

import com.ssafy.barguni.api.error.ErrorResVO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CustomException extends RuntimeException{
    private static final long serialVersionUID = 1L;
    private ErrorResVO errorResVO;

    public CustomException(ErrorResVO errorResVO){
        super(errorResVO.getMessage());
        this.errorResVO = errorResVO;
    }
}
