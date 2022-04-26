package com.ssafy.barguni.api.basket.controller;


import com.ssafy.barguni.api.basket.service.BasketItemService;
import com.ssafy.barguni.api.basket.vo.ItemRes;
import com.ssafy.barguni.api.basket.vo.ItemSearch;
import com.ssafy.barguni.api.common.ResVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/basket/items")
@Tag(name = "basket item controller", description = "바구니 아이템 관련 컨트롤러로 아이템 필터 조회를 담당한다.")
public class BasketItemController {
    private final BasketItemService basketItemService;

    @GetMapping("/list/{basketId}")
    @Operation(summary = "바구니 조회", description = "바구니를 조회한다. id가 -1이면 전체 바구니 조회")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<List<ItemRes>>> getItemList(@PathVariable Long basketId){
        ResVO<List<ItemRes>> result = new ResVO<>();
        HttpStatus status = null;

        try{
            result.setData(basketItemService
                    .getAllInBasket(basketId)
                    .stream()
                    .map(ItemRes::new)
                    .collect(Collectors.toList()));
            result.setMessage("바구니 내 아이템 조회 성공");
            status = HttpStatus.OK;
        } catch (Exception e){
            result.setMessage("바구니 내 아이템 조회 실패");
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<ResVO<List<ItemRes>>>(result, status);
    }

    @GetMapping("/search")
    @Operation(summary = "필터 아이템 조회", description = "필터로 아이템 조회")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<List<ItemRes>>> searchItems(@RequestBody ItemSearch itemSearch){
        ResVO<List<ItemRes>> result = new ResVO<>();
        HttpStatus status = null;

        try{
            result.setData(basketItemService
                    .getItemsUsingFilter(itemSearch)
                    .stream()
                    .map(ItemRes::new)
                    .collect(Collectors.toList()));
            result.setMessage("아이템 필터 조회 성공");
            status = HttpStatus.OK;
        } catch (Exception e){
            result.setMessage("아이템 필터 조회 실패");
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<ResVO<List<ItemRes>>>(result, status);
    }
}
