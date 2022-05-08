package com.ssafy.barguni.api.product;

import com.ssafy.barguni.api.common.ResVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/prod")
@Tag(name = "item controller", description = "물품 관련 컨트롤러")
public class ProductController {
    private final ProductService prodService;

    @GetMapping("")
    @Operation(summary = "기성제품 찾기", description = "바코드 번호를 통해 기성제품 정보를 찾아온다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<ProductRes>> multipartconvert(
            @RequestParam @Parameter String barcode) throws Exception {
        ResVO<ProductRes> result = new ResVO<>();
        HttpStatus status;

        Product prod = prodService.register(barcode);
        result.setData(new ProductRes(prod));
        result.setMessage("제품 조회에 성공했습니다.");
        status = HttpStatus.OK;

        return new ResponseEntity<ResVO<ProductRes>>(result, status);
    }

}
