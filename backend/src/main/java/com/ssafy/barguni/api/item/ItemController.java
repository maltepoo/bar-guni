package com.ssafy.barguni.api.item;

import com.ssafy.barguni.api.common.ResVO;
import com.ssafy.barguni.api.item.vo.ItemPostReq;
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
@RequestMapping("/api/item/")
@Tag(name = "item controller", description = "물품 관련 컨트롤러")
public class ItemController {
    private final ItemService itemService;

    @PostMapping("")
    @Operation(summary = "물품 등록", description = "새로운 물품을 등록한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    // ResponseEntity 사용법 찾아보기
    public ResponseEntity<ResVO<Item>> postItem(@RequestBody @Parameter ItemPostReq req) {
        ResVO<Item> result = new ResVO<>();
        HttpStatus status;

        try {
            Item newItem = itemService.saveNewItem(req);
            result.setData(newItem);
            result.setMessage("물품 등록에 성공했습니다.");
            status = HttpStatus.CREATED;

        } catch (Exception e) {
            e.printStackTrace();
            result.setMessage("서버 오류");
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<ResVO<Item>>(result, status);
    }


    @GetMapping("")
    @Operation(summary = "물품 상세 조회", description = "물품 한개의 내용을 조회한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<Item>> getItem(@PathVariable @Parameter Long itemId) {
        ResVO<Item> result = new ResVO<>();
        HttpStatus status;

        try {
            Item findItem = itemService.getById(itemId);
            result.setData(findItem);
            result.setMessage("물품 조회에 성공했습니다.");
            status = HttpStatus.OK;

        } catch (Exception e) {
            e.printStackTrace();
            result.setMessage("서버 오류");
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<ResVO<Item>>(result, status);
    }


    @PutMapping("")
    @Operation(summary = "물품 수정", description = "물품 내용을 수정한다. 수정할 필드만 값을 채워 보낸다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<Item>> putItem(
            @PathVariable @Parameter Long itemId, @RequestBody @Parameter ItemPostReq req) {
        ResVO<Item> result = new ResVO<>();
        HttpStatus status;

        try {
            Item item = itemService.changeItem(itemId, req);
            result.setData(item);
            result.setMessage("물품 수정에 성공했습니다.");
            status = HttpStatus.OK;

        } catch (Exception e) {
            e.printStackTrace();
            result.setMessage("서버 오류");
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<ResVO<Item>>(result, status);
    }

    @DeleteMapping("")
    @Operation(summary = "물품 삭제", description = "물품을 삭제한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<Item>> deleteItem(@PathVariable @Parameter Long itemId) {
        ResVO<Item> result = new ResVO<>();
        HttpStatus status;

        try {
            itemService.deleteById(itemId);
            result.setMessage("물품 수정에 성공했습니다.");
            status = HttpStatus.NO_CONTENT;

        } catch (Exception e) {
            e.printStackTrace();
            result.setMessage("서버 오류");
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<ResVO<Item>>(result, status);
    }
}
