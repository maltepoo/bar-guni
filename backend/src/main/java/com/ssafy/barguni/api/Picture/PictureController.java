package com.ssafy.barguni.api.Picture;

import com.ssafy.barguni.api.common.ResVO;
import com.ssafy.barguni.api.item.Item;
import com.ssafy.barguni.api.item.vo.ItemPostReq;
import com.ssafy.barguni.api.item.vo.ItemRes;
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
@RequestMapping("/api/picture/")
@Tag(name = "picture controller", description = "이미지 관련 컨트롤러")
public class PictureController {
    private final PictureService pictureService;

    @PostMapping("")
    @Operation(summary = "Picture 등록", description = "새로운 이미지를 등록하고 id를 받아온다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    // ResponseEntity 사용법 찾아보기
    public ResponseEntity<ResVO<PictureRes>> postPicture(
            @RequestParam @Parameter(description = "이미지") MultipartFile image,
            @RequestParam @Parameter(description = "엔티티명") PictureEntity entity) {
        ResVO<PictureRes> result = new ResVO<>();
        HttpStatus status;

        try {
            Picture picture = pictureService.create(image, entity);
            result.setData(new PictureRes(picture));
            result.setMessage("이미지 등록에 성공했습니다.");
            status = HttpStatus.CREATED;

        } catch (Exception e) {
            e.printStackTrace();
            result.setMessage("서버 오류");
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return new ResponseEntity<ResVO<PictureRes>>(result, status);
    }

}
