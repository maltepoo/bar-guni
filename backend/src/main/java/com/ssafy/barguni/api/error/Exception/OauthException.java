package com.ssafy.barguni.api.error.Exception;

import com.ssafy.barguni.api.error.ErrorResVO;

public class OauthException extends CustomException{
    private static final long serialVersionUID = 1L;

    public OauthException(ErrorResVO errorResVO){
        super(errorResVO);
    }
}
