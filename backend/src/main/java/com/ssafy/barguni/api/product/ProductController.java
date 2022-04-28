package com.ssafy.barguni.api.product;

import com.ssafy.barguni.api.common.ResVO;
import com.ssafy.barguni.api.item.Item;
import com.ssafy.barguni.api.item.ItemService;
import com.ssafy.barguni.api.item.vo.ItemPostReq;
import com.ssafy.barguni.api.item.vo.ItemRes;
import com.ssafy.barguni.api.item.vo.ItemSearch;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/prod/")
@Tag(name = "item controller", description = "물품 관련 컨트롤러")
public class ProductController {
    private final ProductService prodService;

    @GetMapping("")
    @Operation(summary = "물품 등록", description = "새로운 물품을 등록한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    // ResponseEntity 사용법 찾아보기
    public ResponseEntity<ResVO<String>> test(@RequestParam @Parameter String word) {
        ResVO<String> result = new ResVO<>();
        HttpStatus status;

        try {
            result.setData(prodService.searchTest(word));
            result.setMessage("물품 등록에 성공했습니다.");
            status = HttpStatus.CREATED;

        } catch (Exception e) {
            e.printStackTrace();
            result.setMessage("서버 오류");
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<ResVO<String>>(result, status);
    }

    @GetMapping("image")
    // ResponseEntity 사용법 찾아보기
    public ResponseEntity<ResVO<MultipartFile>> multipartconvert(@RequestParam @Parameter String word) {
        ResVO<MultipartFile> result = new ResVO<>();
        HttpStatus status;

        try {
            MultipartFile m = prodService.searchImg(word);
            result.setData(m);
            result.setMessage("물품 등록에 성공했습니다.");
            status = HttpStatus.CREATED;

        } catch (Exception e) {
            e.printStackTrace();
            result.setMessage("서버 오류");
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<ResVO<MultipartFile>>(result, status);
    }

}
