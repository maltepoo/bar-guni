package com.ssafy.barguni.api.error;

import com.ssafy.barguni.api.error.Exception.BasketException;
import com.ssafy.barguni.api.error.Exception.JwtException;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequiredArgsConstructor
@RequestMapping("/error")
@Tag(name = "error controller", description = "오류 관련 컨트롤러")
public class ErrorController {
    @GetMapping
    public void handleInterceptorException(HttpServletRequest request) throws BasketException{
        throw new JwtException((ErrorResVO) request.getAttribute("data"));
    }
}
