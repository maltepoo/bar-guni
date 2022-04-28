package com.ssafy.barguni.api.error.Exception;

import com.ssafy.barguni.api.error.ErrorCode;
import com.ssafy.barguni.api.error.ErrorResVO;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BasketException extends CustomException{
    private static final long serialVersionUID = 1L;

    public BasketException(ErrorResVO errorResVO){
        super(errorResVO);
    }

}
