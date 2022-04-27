package com.ssafy.barguni.api.error.Exception;

import com.ssafy.barguni.api.error.ErrorResVO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtException extends RuntimeException{
    private static final long serialVersionUID = 1L;
    private ErrorResVO errorResVO;
}
