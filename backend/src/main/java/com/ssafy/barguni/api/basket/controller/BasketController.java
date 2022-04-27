package com.ssafy.barguni.api.basket.controller;

import com.ssafy.barguni.api.basket.entity.Basket;
import com.ssafy.barguni.api.basket.service.BasketService;
import com.ssafy.barguni.api.basket.vo.BasketRes;
import com.ssafy.barguni.api.common.ResVO;
import com.ssafy.barguni.common.auth.AccountUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/basket")
@Tag(name = "basket controller", description = "바구니 관련 컨트롤러")
public class BasketController {
    private final BasketService basketService;

    @PostMapping("/")
    @Operation(summary = "바구니 생성", description = "바구니를 생성한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<Long>> createBasket(
            @RequestParam String name,
            @RequestParam(value = "basketImg", required = false)
            @Parameter(description = "바구니 사진") MultipartFile multipartFile) {
        ResVO<Long> result = new ResVO<>();
        HttpStatus status = null;

        try {
            AccountUserDetails userDetails = (AccountUserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();
            Long basketId = basketService.createBasket(name, multipartFile, userDetails.getUser());
            status = HttpStatus.OK;
            result.setData(basketId);
            result.setMessage("바구니 생성 성공");
        } catch (Exception e) {
            e.printStackTrace();
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            result.setMessage("바구니 생성 실패");
        }

        return new ResponseEntity<ResVO<Long>>(result, status);
    }

    @GetMapping("/{basketId}")
    @Operation(summary = "바구니 조회", description = "바구니를 조회한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<BasketRes>> getBasket(@PathVariable Long basketId) throws Exception{
        ResVO<BasketRes> result = new ResVO<>();
        HttpStatus status = null;

        Basket basket = basketService.getBasket(basketId);
        result.setData(new BasketRes(basket));
        result.setMessage("바구니 조회 성공");
        status = HttpStatus.OK;

        return new ResponseEntity<ResVO<BasketRes>>(result, status);
    }

    @PutMapping("/{basketId}")
    @Operation(summary = "바구니 수정", description = "바구니를 수정한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<Long>> updateBasket(
            @PathVariable Long basketId,
            @RequestParam String name,
            @RequestParam(value = "basketImg", required = false)
            @Parameter(description = "바구니 사진") MultipartFile multipartFile) {
        ResVO<Long> result = new ResVO<>();
        HttpStatus status = null;

        try {
            basketService.updateBasket(basketId, name, multipartFile);
            status = HttpStatus.OK;
            result.setData(basketId);
            result.setMessage("바구니 수정 성공");
        } catch (Exception e) {
            e.printStackTrace();
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            result.setMessage("바구니 수정 실패");
            result.setData(basketId);
        }

        return new ResponseEntity<ResVO<Long>>(result, status);
    }

    @DeleteMapping("/{basketId}")
    @Operation(summary = "바구니 삭제", description = "바구니를 삭제한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<Boolean>> deleteBasket(@PathVariable Long basketId){
        ResVO<Boolean> result = new ResVO<>();
        HttpStatus status = null;

        try {
            AccountUserDetails userDetails = (AccountUserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();
            basketService.deleteBasket(basketId, userDetails.getUserId());
            result.setMessage("바구니 삭제 성공");
            result.setData(true);
            status = HttpStatus.OK;
        } catch (Exception e) {
            e.printStackTrace();
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            result.setMessage("바구니 삭제 실패");
            result.setData(false);
        }

        return new ResponseEntity<ResVO<Boolean>>(result, status);
    }


}
