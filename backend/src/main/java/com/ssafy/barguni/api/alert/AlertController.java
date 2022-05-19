package com.ssafy.barguni.api.alert;

import com.ssafy.barguni.api.alert.vo.AlertRes;
import com.ssafy.barguni.api.common.ResVO;
import com.ssafy.barguni.api.user.User;
import com.ssafy.barguni.api.user.UserService;
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

import javax.validation.constraints.Null;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/alert")
@Tag(name = "basket controller", description = "바구니 관련 컨트롤러")
public class AlertController {
    private final AlertService alertService;
    private final UserService userService;
    private final FirebaseAlertService firebaseAlertService;

    @GetMapping("")
    @Operation(summary = "알림 조회", description = "알림을 조회한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<List<AlertRes>>> findAllAlertsByUser(){
        ResVO<List<AlertRes>> result = new ResVO<>();
        HttpStatus status = null;

        AccountUserDetails userDetails = (AccountUserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();
        List<AlertRes> alerts = alertService.findAllByUserId(userDetails.getUserId())
                .stream()
                .map(AlertRes::new)
                .collect(Collectors.toList());
        result.setMessage("알림 조회 성공");
        result.setData(alerts);
        status = HttpStatus.OK;

        return new ResponseEntity<ResVO<List<AlertRes>>>(result, status);
    }

    @PutMapping("/{alertId}")
    @Operation(summary = "알림 상태 수정", description = "알림 상태를 수정한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<Null>> updateAlertStatusById(@PathVariable Long alertId
            , @RequestParam AlertStatus alertStatus){
        ResVO<Null> result = new ResVO<>();
        HttpStatus status = null;

        alertService.updateStatusById(alertId, alertStatus);
        result.setMessage("알림 수정 성공");
        status = HttpStatus.OK;

        return new ResponseEntity<ResVO<Null>>(result, status);
    }

    @DeleteMapping("/{alertId}")
    @Operation(summary = "알림 삭제", description = "알림을 삭제한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<Null>> deleteAlertById(@PathVariable Long alertId){
        ResVO<Null> result = new ResVO<>();
        HttpStatus status = null;

        alertService.deleteById(alertId);
        result.setMessage("알림 삭제 성공");
        status = HttpStatus.OK;

        return new ResponseEntity<ResVO<Null>>(result, status);
    }

    @GetMapping("/test")
    @Operation(summary = "알림 테스트", description = "특정 아이템 알람을 생성하고 유저에게 바로 보낸다")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public void test(@RequestParam Long userId, @RequestParam Long itemId){

        try {
            User user = userService.findById(userId);
            alertService.createTestAlert(itemId);
            String title = "유통기한이 얼마 남지 않은 상품이 있어요.";
            String content = "1개의 상품의 유통기한이 임박합니다.";
            firebaseAlertService.sendMessageTo(user.getAlertApiKey(), title, content);
        } catch (Exception e){
            e.printStackTrace();
        }

    }
}
