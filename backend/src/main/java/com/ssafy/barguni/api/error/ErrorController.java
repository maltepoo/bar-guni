package com.ssafy.barguni.api.error;

import com.ssafy.barguni.api.common.ResVO;
import com.ssafy.barguni.api.error.Exception.BasketException;
import com.ssafy.barguni.api.error.Exception.JwtException;
import com.ssafy.barguni.common.util.JwtTokenUtil;
import com.ssafy.barguni.common.util.TokenType;
import com.ssafy.barguni.common.util.vo.TokenRes;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequiredArgsConstructor
@RequestMapping("/error")
@Tag(name = "error controller", description = "오류 관련 컨트롤러")
public class ErrorController {
    @RequestMapping("/jwt")
    public void handleInterceptorException(HttpServletRequest request) throws JwtException{
        throw new JwtException((ErrorResVO) request.getAttribute("data"));
    }

    @RequestMapping("/refresh")
    public ResponseEntity<ResVO<TokenRes>> reIssueToken(HttpServletRequest request) {
        ResVO<TokenRes> result = new ResVO<>();
        HttpStatus status = null;

        String userId = (String) request.getAttribute("userId");

        String accessToken = JwtTokenUtil.getToken(userId, TokenType.ACCESS);
        String refreshToken = JwtTokenUtil.getToken(userId, TokenType.REFRESH);

        TokenRes tokenRes = new TokenRes(accessToken, refreshToken);
        result.setData(tokenRes);
        result.setMessage("ACCESS Token 재발행 성공");
        status = HttpStatus.OK;

        return new ResponseEntity<ResVO<TokenRes>>(result, status);
    }
}
