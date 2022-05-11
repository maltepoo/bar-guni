package com.ssafy.barguni.api.item;

import com.ssafy.barguni.api.basket.service.BasketService;
import com.ssafy.barguni.api.error.ErrorCode;
import com.ssafy.barguni.api.error.ErrorResVO;
import com.ssafy.barguni.api.error.Exception.BasketException;
import com.ssafy.barguni.api.item.vo.ItemRes;
import com.ssafy.barguni.api.item.vo.ItemSearch;
import com.ssafy.barguni.api.common.ResVO;
import com.ssafy.barguni.api.item.vo.ItemPostReq;
import com.ssafy.barguni.api.user.UserBasketService;
import com.ssafy.barguni.api.user.UserService;
import com.ssafy.barguni.common.auth.AccountUserDetails;
import com.ssafy.barguni.common.util.ClovaOcrUtil;
import com.ssafy.barguni.common.util.SocialLoginType;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.json.JSONException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/item")
@Tag(name = "item controller", description = "물품 관련 컨트롤러")
public class ItemController {
    private final ItemService itemService;
    private final UserService userService;
    private final UserBasketService userBasketService;
    private final BasketService basketService;

    @PostMapping("")
    @Operation(summary = "물품 등록", description = "새로운 물품을 등록한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    // ResponseEntity 사용법 찾아보기
    public ResponseEntity<ResVO<ItemRes>> postItem(@RequestBody @Parameter ItemPostReq req) {
        ResVO<ItemRes> result = new ResVO<>();
        HttpStatus status;

        AccountUserDetails userDetails = (AccountUserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();

        Item newItem = itemService.saveNewItem(userDetails.getUserId(), req);
        result.setData(new ItemRes(newItem));
        result.setMessage("물품 등록에 성공했습니다.");
        status = HttpStatus.CREATED;

        return new ResponseEntity<ResVO<ItemRes>>(result, status);
    }


    @GetMapping("/{itemId}")
    @Operation(summary = "물품 상세 조회", description = "물품 한개의 내용을 조회한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<ItemRes>> getItem(@PathVariable @Parameter Long itemId) {
        ResVO<ItemRes> result = new ResVO<>();
        HttpStatus status;

        Item findItem = itemService.getById(itemId);
        result.setData(new ItemRes(findItem));
        result.setMessage("물품 조회에 성공했습니다.");
        status = HttpStatus.OK;

        return new ResponseEntity<ResVO<ItemRes>>(result, status);
    }


    @PutMapping("/{itemId}")
    @Operation(summary = "물품 수정", description = "물품 내용을 수정한다. 수정할 필드만 값을 채워 보낸다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<ItemRes>> putItem(
            @PathVariable @Parameter Long itemId, @RequestBody @Parameter ItemPostReq req) {
        ResVO<ItemRes> result = new ResVO<>();
        HttpStatus status;

        AccountUserDetails userDetails = (AccountUserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();

        if (!itemService.canUserChangeItem(userDetails.getUserId(), itemId)){
            throw new BasketException(new ErrorResVO(ErrorCode.BASKET_FORBIDDEN));
        }

        Item item = itemService.changeItem(itemId, req);
        result.setData(new ItemRes(item));
        result.setMessage("물품 수정에 성공했습니다.");
        status = HttpStatus.OK;


        return new ResponseEntity<ResVO<ItemRes>>(result, status);
    }

    @PutMapping("/status/{itemId}/{used}")
    @Operation(summary = "물품 상태변경", description = "물품을 휴지통으로 보내거나 복구한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<ItemRes>> checkUsedItem(
            @PathVariable @Parameter Long itemId, @PathVariable @Parameter Boolean used) {
        ResVO<ItemRes> result = new ResVO<>();
        HttpStatus status;

        Item item = itemService.changeStatus(itemId, used);
        result.setData(new ItemRes(item));
        result.setMessage("물품 수정에 성공했습니다.");
        status = HttpStatus.NO_CONTENT;

        return new ResponseEntity<ResVO<ItemRes>>(result, status);
    }

    @DeleteMapping("/{itemId}")
    @Operation(summary = "물품 삭제", description = "물품을 삭제한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<String>> deleteItem(@PathVariable @Parameter Long itemId) {
        ResVO<String> result = new ResVO<>();
        HttpStatus status;

        itemService.deleteById(itemId);
        result.setMessage("물품 수정에 성공했습니다.");
        status = HttpStatus.NO_CONTENT;


        return new ResponseEntity<ResVO<String>>(result, status);
    }


    @GetMapping("/list/{basketId}")
    @Operation(summary = "바구니 내 아이템 조회", description = "바구니 내 아이템을 조회한다. id가 -1이면 전체 바구니 조회")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<List<ItemRes>>> getItemList(@PathVariable Long basketId,
                                                            @RequestParam(required = false) Boolean used){
        ResVO<List<ItemRes>> result = new ResVO<>();
        HttpStatus status = null;

        AccountUserDetails userDetails = (AccountUserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();
        result.setData(itemService
                .getAllInBasket(basketId, userDetails.getUserId(), used)
                .stream()
                .map(ItemRes::new)
                .collect(Collectors.toList()));
        result.setMessage("바구니 내 아이템 조회 성공");
        status = HttpStatus.OK;

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

        AccountUserDetails userDetails = (AccountUserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();
        result.setData(itemService
                .getItemsUsingFilter(itemSearch, userDetails.getUserId())
                .stream()
                .map(ItemRes::new)
                .collect(Collectors.toList()));
        result.setMessage("아이템 필터 조회 성공");
        status = HttpStatus.OK;

        return new ResponseEntity<ResVO<List<ItemRes>>>(result, status);
    }

    @DeleteMapping("/used/{bktId}")
    @Operation(summary = "휴지통 비우기", description = "바구니의 사용된 아이템을 전부 삭제한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<String>> deleteUsedItems(@PathVariable @Parameter Long bktId){
        ResVO<String> result = new ResVO<>();
        HttpStatus status = null;

        result.setData(itemService.deleteUsedItemInBasket(bktId) + "개의 아이템을 삭제했습니다.");
        result.setMessage("휴지통 비우기 성공");
        status = HttpStatus.OK;

        return new ResponseEntity<ResVO<String>>(result, status);
    }

    @GetMapping("/ocr")
    @Operation(summary = "OCR 진행", description = "사진 파일로 해당 정보를 받아온다")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public void socialLoginType() throws JSONException {

        ClovaOcrUtil clovaOcrUtil = new ClovaOcrUtil();
        clovaOcrUtil.ocrTest();
//        clovaOcrUtil.getOcr();
    }
}
