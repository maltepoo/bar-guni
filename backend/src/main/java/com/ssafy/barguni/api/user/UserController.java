package com.ssafy.barguni.api.user;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.barguni.api.basket.entity.Basket;
import com.ssafy.barguni.api.basket.service.BasketService;
import com.ssafy.barguni.api.common.ResVO;
import com.ssafy.barguni.api.user.vo.KakaoProfile;
import com.ssafy.barguni.api.user.vo.OauthToken;
import com.ssafy.barguni.api.user.vo.UserPostReq;
import com.ssafy.barguni.common.auth.AccountUserDetails;
import com.ssafy.barguni.common.util.JwtTokenUtil;
import com.ssafy.barguni.common.util.KakaoOauthUtil;
import com.ssafy.barguni.common.util.TokenType;
import com.ssafy.barguni.common.util.vo.TokenRes;
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

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user/")
@Tag(name = "user controller", description = "회원 관련 컨트롤러")
public class UserController {
    private final UserService userService;
    private final UserBasketService userBasketService;
    private final BasketService basketService;


    @PostMapping("/login")
    @Operation(summary = "로그인", description = "테스트 로그인한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<TokenRes>> login(@RequestParam String email) {
        ResVO<TokenRes> result = new ResVO<>();
        HttpStatus status = null;

        // 로그인 확인
        Boolean duplicated = userService.isDuplicated(email);
        if(!duplicated) {
            result.setMessage("회원이 아닙니다.");
            status = HttpStatus.NOT_ACCEPTABLE;
            return new ResponseEntity<ResVO<TokenRes>>(result, status);
        }

        //
        User user = userService.findByEmail(email);
        status = HttpStatus.OK;
        String accessToken = JwtTokenUtil.getToken(user.getId().toString(), TokenType.ACCESS);
        String refreshToken = JwtTokenUtil.getToken(user.getId().toString(), TokenType.REFRESH);

        TokenRes tokenRes = new TokenRes(accessToken, refreshToken);
        result.setData(tokenRes);
        result.setMessage("성공");

        return new ResponseEntity<ResVO<TokenRes>>(result, status);
    }


    @PostMapping("/oauth-login/kakao")
    @Operation(summary = "카카오 로그인", description = "카카오 인증 코드로 카카오 토큰을 얻고 정보로 로그인한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<TokenRes>> kakaoLogin (@RequestParam String code) {
        ResVO<TokenRes> result = new ResVO<>();
        HttpStatus status = null;

        //------------ 통신 ---------------//
        // 토큰 관련 정보 얻기
        ResponseEntity<String> responseToken = KakaoOauthUtil.getKakaoToken(code);
        if(responseToken == null){
            result.setMessage("유효하지 않은 카카오 인증 코드 입니다.");
            status = HttpStatus.BAD_REQUEST;
            return new ResponseEntity<ResVO<TokenRes>>(result, status);
        }

        // 토큰 정보 추출
        ObjectMapper objectMapper = new ObjectMapper();
        OauthToken oauthToken = null;
        try {
            oauthToken = objectMapper.readValue(responseToken.getBody(), OauthToken.class);
        } catch (JsonProcessingException e) { // 파싱 에러
            e.printStackTrace();
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            result.setMessage("서버 오류");
            return new ResponseEntity<ResVO<TokenRes>>(result, status);
        }


        //------------ 통신 ---------------//
        // 토큰으로 프로필 정보 가져오기
        ResponseEntity<String> responseProfile = KakaoOauthUtil.getKakaoProfile(oauthToken);
        if(responseProfile == null){
            result.setMessage("유효하지 않은 토큰 입니다.");
            status = HttpStatus.BAD_REQUEST;
            return new ResponseEntity<ResVO<TokenRes>>(result, status);
        }

        // 프로필 정보 추출
        KakaoProfile kakaoProfile = null;
        try {
            kakaoProfile = objectMapper.readValue(responseProfile.getBody(), KakaoProfile.class);
        } catch (JsonProcessingException e) { // 파싱 에러
            e.printStackTrace();
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            result.setMessage("서버 오류");
            return new ResponseEntity<ResVO<TokenRes>>(result, status);
        }



        // 이메일 중복 확인 및 토큰 반환
        String email = kakaoProfile.getKakao_account().getEmail();
        String nickname = kakaoProfile.getProperties().getNickname();
        Boolean duplicated = userService.isDuplicated(email);
        User user = null;
        if(!duplicated) {
            user = userService.oauthSignup(email, nickname);
//            System.out.println("소셜 회원가입");
        }
        else{
            user = userService.findByEmail(email);
//            System.out.println("소셜 로그인");
        }

        status = HttpStatus.OK;
        String accessToken = JwtTokenUtil.getToken(user.getId().toString(), TokenType.ACCESS);
        String refreshToken = JwtTokenUtil.getToken(user.getId().toString(), TokenType.REFRESH);

        TokenRes tokenRes = new TokenRes(accessToken, refreshToken);
        result.setData(tokenRes);
        result.setMessage("카카오 로그인 성공");

        return new ResponseEntity<ResVO<TokenRes>>(result, status);
    }


    @GetMapping
    @Operation(summary = "사용자 조회", description = "테스트 조회한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<String>> find(){
        ResVO<String> result = new ResVO<>();
        HttpStatus status = null;

        try {
            AccountUserDetails userDetails = (AccountUserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();
            User nowUser = userService.findById(userDetails.getUserId());
            status = HttpStatus.OK;
            result.setData(nowUser.getEmail());
            result.setMessage("조회 성공");
        } catch (Exception e) {
            e.printStackTrace();
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            result.setMessage("조회 실패");
        }

        return new ResponseEntity<ResVO<String>>(result, status);
    }

    @PutMapping("/{userId}")
    @Operation(summary = "사용자 정보 수정", description = "사용자 정보 수정한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<UserRes>> updateUser(
            @PathVariable("userId") @Parameter(description = "유저 ID") Long userId,
            @RequestBody @Parameter(description = "유저 입력 폼") UserPostReq userReq) {

        ResVO<UserRes> result = new ResVO<>();
        HttpStatus status = null;

        try{
            User user = userService.modifyUser(userId,userReq);
            result.setData(UserRes.convertTo(user));
            result.setMessage("유저 정보 수정 성공");
            status = HttpStatus.OK;
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            result.setMessage("서버 오류");
        }
        return new ResponseEntity<ResVO<UserRes>>(result, status);
    }

    @DeleteMapping("")
    @Operation(summary = "회원 탈퇴", description = "현재 로그인된 회원 탈퇴(로그인필요)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<Map<String, Object>> deleteUser(){
        Map<String, Object> resultMap = new HashMap<String, Object>();
        HttpStatus status = null;

        try {
            AccountUserDetails userDetails = (AccountUserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();
            User user = userService.findById(userDetails.getUserId());
            userService.deleteById(user.getId());
            resultMap.put("message", "성공");
            status = HttpStatus.OK;

        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            resultMap.put("message", "서버 오류");
        }

        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @GetMapping("/basket")
    @Operation(summary = "사용자가 참여중인 바구니 조회", description = "로그인 되어있는 사용자가 참여중인 바구니 리스트를 반환한다.(로그인필요)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<List<UserBasketRes>>> getBasketList() {
        ResVO<List<UserBasketRes>> result = new ResVO<>();
        HttpStatus status = null;

        try {
            AccountUserDetails userDetails = (AccountUserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();
            User user = userService.findById(userDetails.getUserId());
            List<UserBasket> bktOfUser = userBasketService.findByUserId(user.getId());


            result.setMessage("바구니 리스트 조회 성공");
            result.setData(UserBasketRes.convertToUbResList(bktOfUser));
            status = HttpStatus.OK;
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            result.setMessage("서버 오류");
        }

        return new ResponseEntity<ResVO<List<UserBasketRes>>>(result, status);
    }

    @PostMapping("/basket/{bkt_id}")
    @Operation(summary = "바구니 참여", description = "다른 바구니에 참여한다. (로그인필요)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "사용자 또는 바구니 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<Map<String, Object>> joinBasket(
//            @PathVariable @Parameter(description = "바구니 ID") Long bkt_id,
            @RequestParam String joinCode ) {
        Map<String, Object> resultMap = new HashMap<String, Object>();
        HttpStatus status = null;

        try {
            AccountUserDetails userDetails = (AccountUserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();
            User user = userService.findById(userDetails.getUserId());
            Basket basket = basketService.findByJoinCode(joinCode);

            if (userBasketService.addBasket(user, basket.getId()).isPresent()) {
                resultMap.put("message", "성공");
            } else {
                resultMap.put("message", "이미 참여한 바구니입니다.");
            }
            status = HttpStatus.OK;

        } catch (Exception e) {
            e.printStackTrace();
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            resultMap.put("message", "서버 오류");
        }

        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @DeleteMapping("/basket/{bkt_id}")
    @Operation(summary = "바구니 ID로 바구니 탈퇴", description = "사용자가 참여중인 바구니를 바구니 Id를 통해 탈퇴한다.(로그인필요)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "사용자 또는 병원 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<Map<String, Object>> leaveBasket(
            @PathVariable @Parameter(description = "바구니 ID") Long bkt_id) {
        Map<String, Object> resultMap = new HashMap<String, Object>();
        HttpStatus status = null;

        try {
            AccountUserDetails userDetails = (AccountUserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();
            User user = userService.findById(userDetails.getUserId());
            userBasketService.deleteBybktId(user, bkt_id);
            resultMap.put("message", "성공");
            status = HttpStatus.OK;

        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            resultMap.put("message", "서버 오류");
        }

        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }




    @PutMapping("/basket/{basketId}")
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

    @PutMapping("/basket/default/{basketId}")
    @Operation(summary = "사용자 기본 바구니 변경", description = "사용자의 기본 바구니를 변경한다.(로그인필요)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<Boolean>> modifyDefault(@RequestParam Long basketId){
        ResVO<Boolean> result = new ResVO<>();
        HttpStatus status = null;

        try {
            AccountUserDetails userDetails = (AccountUserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();
            Long userId = userDetails.getUserId();

            Basket defaultBasket = basketService.getBasket(basketId);

            userService.modifyDefault(userId, defaultBasket);
            status = HttpStatus.OK;
            result.setMessage("기본 바구니 변경 성공");
            result.setData(true);

        } catch (Exception e) {
            e.printStackTrace();
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            result.setMessage("기본 바구니 변경 실패");
            result.setData(false);
        }

        return new ResponseEntity<ResVO<Boolean>>(result, status);
    }
}
