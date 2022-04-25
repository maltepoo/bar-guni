package com.ssafy.barguni.api.basket;

import com.ssafy.barguni.api.basket.vo.BasketRes;
import com.ssafy.barguni.api.basket.vo.CategoryRes;
import com.ssafy.barguni.api.common.ResVO;
import com.ssafy.barguni.api.user.User;
import com.ssafy.barguni.api.user.UserRepository;
import com.ssafy.barguni.api.user.UserService;
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

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/basket")
@Tag(name = "basket controller", description = "바구니 관련 컨트롤러(바구니 CRUD, 카테고리, 아이템 필터 조회, 바구니 멤버 관리 등)")
public class BasketController {
    private final BasketService basketService;
    private final UserService userService;
    private final CategoryService categoryService;


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
            Long basketId = basketService.createBasket(name, multipartFile, userDetails.getUserId());
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
    public ResponseEntity<ResVO<BasketRes>> getBasket(@PathVariable Long basketId){
        ResVO<BasketRes> result = new ResVO<>();
        HttpStatus status = null;

        try {
            Basket basket = basketService.getBasket(basketId);
            result.setData(new BasketRes(basket));
            result.setMessage("바구니 조회 성공");
            status = HttpStatus.OK;
        } catch (Exception e) {
            e.printStackTrace();
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            result.setMessage("바구니 조회 실패");
        }

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

    /**
     * 카테고리 부분
     *
     *
     *
     */
    @PostMapping("/category/{basketId}")
    @Operation(summary = "카테고리 등록", description = "해당 바구니에 카테고리를 등록한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<Long>> registerCatetory(@PathVariable Long basketId, @RequestParam String name){
        ResVO<Long> result = new ResVO<>();
        HttpStatus status = null;


        try {
            Long categoryId = categoryService.register(basketId, name);
            result.setData(categoryId);
            result.setMessage("카테고리 등록 성공");
            status = HttpStatus.OK;
        } catch (Exception e) {
            e.printStackTrace();
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            result.setMessage("카테고리 등록 실패");

        }

        return new ResponseEntity<ResVO<Long>>(result, status);

    }

    @GetMapping("/category/{basketId}")
    @Operation(summary = "바구니 내 카테고리 목록 조회", description = "바구니 내 카테고리 목록을 조회한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<List<CategoryRes>>> getCategoryList(@PathVariable Long basketId){
        ResVO<List<CategoryRes>> result = new ResVO<>();
        HttpStatus status = null;

        try {
            List<Categories> categories = categoryService.getByBasketId(basketId);
            result.setData(categories
                    .stream()
                    .map(CategoryRes::new)
                    .collect(Collectors.toList()));
            result.setMessage("카테고리 조회 성공");
            status = HttpStatus.OK;
        } catch (Exception e) {
            e.printStackTrace();
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            result.setMessage("카테고리 조회 실패");
        }

        return new ResponseEntity<ResVO<List<CategoryRes>>>(result, status);
    }

    @PutMapping("/category/{basketId}/{categoryId}")
    @Operation(summary = "카테고리 수정", description = "해당 바구니에 카테고리를 수정한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<Long>> modifyCatetory(@PathVariable Long basketId, @PathVariable Long categoryId, @RequestParam String name){
        ResVO<Long> result = new ResVO<>();
        HttpStatus status = null;

        try {
            categoryService.modify(categoryId, name);
            result.setData(categoryId);
            result.setMessage("카테고리 수정 성공");
            status = HttpStatus.OK;
        } catch (Exception e) {
            e.printStackTrace();
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            result.setMessage("카테고리 수정 실패");
            result.setData(categoryId);
        }

        return new ResponseEntity<ResVO<Long>>(result, status);
    }

    @DeleteMapping("/category/{categoryId}")
    @Operation(summary = "카테고리 삭제", description = "해당 카테고리를 삭제한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<Boolean>> deleteCategory(@PathVariable Long categoryId){
        ResVO<Boolean> result = new ResVO<>();
        HttpStatus status = null;

        try{
            categoryService.delete(categoryId);
            result.setMessage("카테고리 삭제 성공");
            result.setData(true);
            status = HttpStatus.OK;
        } catch (Exception e){
            result.setMessage("카테고리 삭제 실패");
            result.setData(false);
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<ResVO<Boolean>>(result, status);
    }

}
