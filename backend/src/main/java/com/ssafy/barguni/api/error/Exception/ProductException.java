package com.ssafy.barguni.api.error.Exception;

import com.ssafy.barguni.api.error.ErrorResVO;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProductException extends CustomException{
    private static final long serialVersionUID = 1L;

    public ProductException(ErrorResVO errorResVO){
        super(errorResVO);
    }
}
