package com.ssafy.barguni.api.basket.controller;


import com.ssafy.barguni.api.basket.entity.UserAuthority;
import com.ssafy.barguni.api.basket.entity.UserBasket;
import com.ssafy.barguni.api.basket.service.UserBasketService;
import com.ssafy.barguni.api.common.ResVO;
import com.ssafy.barguni.common.auth.AccountUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/basket/user")
@Tag(name = "user basket controller", description = "유저 바구니 관련 컨트롤러로 바구니 멤버 관리 기능을 한다.")
public class UserBasketController {
    private final UserBasketService userBasketService;

    @PutMapping("/{basketId}")
    @Operation(summary = "멤버 권한 수정", description = "해당 바구니에 멤버 권한을 수정한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<Boolean>> modifyAuthority(@PathVariable Long basketId, @RequestParam Long userId, @RequestParam UserAuthority authority){
        ResVO<Boolean> result = new ResVO<>();
        HttpStatus status = null;

        try {
            AccountUserDetails userDetails = (AccountUserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();
            Long reqUserId = userDetails.getUserId();

            UserBasket ub = userBasketService.findByUserAndBasket(reqUserId, basketId);

            if(ub.getAuthority() != UserAuthority.ADMIN){
                status = HttpStatus.UNAUTHORIZED;
                result.setMessage("권한 변경 실패");
                result.setData(false);
            }
            else {
                userBasketService.modifyAuthority(basketId, userId, authority);
                status = HttpStatus.OK;
                result.setMessage("권한 변경 성공");
                result.setData(true);
            }
        } catch (Exception e) {
            e.printStackTrace();
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            result.setMessage("권한 변경 실패");
            result.setData(false);
        }

        return new ResponseEntity<ResVO<Boolean>>(result, status);
    }
}
