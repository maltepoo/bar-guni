package com.ssafy.barguni.api.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.barguni.api.basket.entity.Basket;
import com.ssafy.barguni.api.basket.service.BasketService;
import com.ssafy.barguni.api.common.ResVO;
import com.ssafy.barguni.api.error.ErrorCode;
import com.ssafy.barguni.api.error.ErrorResVO;
import com.ssafy.barguni.api.error.Exception.OauthException;
import com.ssafy.barguni.api.user.vo.*;
import com.ssafy.barguni.common.auth.AccountUserDetails;
import com.ssafy.barguni.common.util.*;

import com.ssafy.barguni.common.util.vo.TokenRes;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
@Slf4j
@Tag(name = "user controller", description = "회원 관련 컨트롤러")
public class UserController {
    private final UserService userService;
    private final UserBasketService userBasketService;
    private final BasketService basketService;
    private final OauthService oauthService;

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

        User user = userService.findByEmail(email);

        String accessToken = JwtTokenUtil.getToken(user.getId().toString(), TokenType.ACCESS);
        String refreshToken = JwtTokenUtil.getToken(user.getId().toString(), TokenType.REFRESH);

        TokenRes tokenRes = new TokenRes(accessToken, refreshToken);
        result.setData(tokenRes);
        result.setMessage("성공");
        status = HttpStatus.OK;

        return new ResponseEntity<ResVO<TokenRes>>(result, status);
    }

    /**
     * 사용자로부터 SNS 로그인 요청을 Social Login Type 을 받아 처리
     * @param socialLoginType (GOOGLE, KAKAO)
     */
    @GetMapping("/oauth-login/{socialLoginType}")
    @Operation(summary = "SNS 로그인 폼", description = "SNS 로그인 폼을 요쳥한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public void socialLoginType(
            @PathVariable(name = "socialLoginType") SocialLoginType socialLoginType) {
        oauthService.request(socialLoginType);
    }

    /**
     * Social Login API Server 요청에 의한 callback 을 처리
     * @param socialLoginType (GOOGLE, KAKAO)
     * @param code API Server 로부터 넘어노는 code
     * @return SNS Login 요청 결과로 받은 Json 형태의 String 문자열 (access_token, refresh_token 등)
     */
    @GetMapping("/oauth-login/{socialLoginType}/callback")
    @Operation(summary = "SNS 로그인", description = "인증 코드로 엑세스 토큰을 얻고 정보로 로그인한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<TokenRes>> snsLogin(
            @PathVariable(name = "socialLoginType") SocialLoginType socialLoginType,
            @RequestParam(name = "code") String code) throws Exception {

        ResVO<TokenRes> result = new ResVO<>();
        HttpStatus status = null;

        //------------ 통신 ---------------//
        // 토큰 관련 정보 얻기
        ResponseEntity<String> responseToken = oauthService.requestAccessToken(socialLoginType, code);

        // 유효하지 않은 인가코드
        if(responseToken == null) throw new OauthException(new ErrorResVO(ErrorCode.OAUTH_INVALID_AUTHORIZATION_CODE));

        // 토큰 정보 추출
        ObjectMapper objectMapper = new ObjectMapper();
        OauthToken oauthToken = null;
        oauthToken = objectMapper.readValue(responseToken.getBody(), OauthToken.class);

        // 이메일 정보 제공을 동의할 때까지 리다이렉트한다.
        if(!oauthToken.getScope().contains("email")) {
            // 필요하면 연결끊기 시도 (다시 정보제공 동의 받는 법)
            oauthService.request(socialLoginType);
            throw new OauthException(new ErrorResVO(ErrorCode.OAUTH_EMAIL_NOT_ALLOWED));
        }

        //------------ 통신 ---------------//
        // 토큰으로 프로필 정보 가져오기
        ResponseEntity<String> responseProfile = oauthService.getProfile(socialLoginType, oauthToken);
        // 유효하지 않은 엑세스 토큰
        if(responseProfile == null) throw new OauthException(new ErrorResVO(ErrorCode.OAUTH_INVALID_ACCESS_TOKEN));

        // 프로필 정보 추출
        OauthProfileinfo emailAndName = oauthService.getEmailAndName(socialLoginType, responseProfile.getBody());

        Boolean duplicated = userService.isDuplicated(emailAndName.getEmail());
        User user = null;
        if(!duplicated) {
            user = userService.oauthSignup(emailAndName);
        }
        else{
            user = userService.findByEmail(emailAndName.getEmail());
        }

        status = HttpStatus.OK;
        String accessToken = JwtTokenUtil.getToken(user.getId().toString(), TokenType.ACCESS);
        String refreshToken = JwtTokenUtil.getToken(user.getId().toString(), TokenType.REFRESH);
        TokenRes tokenRes = new TokenRes(accessToken, refreshToken);
        result.setData(tokenRes);

        result.setMessage("SNS 로그인 성공");

        return new ResponseEntity<ResVO<TokenRes>>(result, status);
    }

    @GetMapping("/oauth-login/{socialLoginType}/access-token")
    @Operation(summary = "SNS 로그인", description = "엑세스 토큰으로 프로필 정보를 얻고 로그인한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<TokenRes>> snsGetProfile(
            @PathVariable(name = "socialLoginType") SocialLoginType socialLoginType,
            @RequestParam String accessToken) throws Exception {
        ResVO<TokenRes> result = new ResVO<>();
        HttpStatus status = null;

        //------------ 통신 ---------------//
        // 토큰으로 프로필 정보 가져오기
        ResponseEntity<String> responseProfile = oauthService.getProfile(socialLoginType, accessToken);
        // 유효하지 않은 엑세스 토큰
        if(responseProfile == null) throw new OauthException(new ErrorResVO(ErrorCode.OAUTH_INVALID_ACCESS_TOKEN));

        // 프로필 정보 추출
        OauthProfileinfo emailAndName = oauthService.getEmailAndName(socialLoginType, responseProfile.getBody());

        Boolean duplicated = userService.isDuplicated(emailAndName.getEmail());
        User user = null;
        if(!duplicated) {
            user = userService.oauthSignup(emailAndName);
        }
        else{
            user = userService.findByEmail(emailAndName.getEmail());
        }

        status = HttpStatus.OK;
        String jwtAccessToken = JwtTokenUtil.getToken(user.getId().toString(), TokenType.ACCESS);
        String refreshToken = JwtTokenUtil.getToken(user.getId().toString(), TokenType.REFRESH);
        TokenRes tokenRes = new TokenRes(jwtAccessToken, refreshToken);
        result.setData(tokenRes);

        result.setMessage("SNS 로그인 성공");

        return new ResponseEntity<ResVO<TokenRes>>(result, status);
    }

    @GetMapping("")
    @Operation(summary = "사용자 조회", description = "사용자를 조회한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<UserRes>> find(){
        ResVO<UserRes> result = new ResVO<>();
        HttpStatus status = null;

        AccountUserDetails userDetails = (AccountUserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();
        User nowUser = userService.findByIdWithBasket(userDetails.getUserId());
        status = HttpStatus.OK;
        result.setData(UserRes.convertTo(nowUser));
        result.setMessage("사용자 조회 성공");

        return new ResponseEntity<ResVO<UserRes>>(result, status);
    }

    @PutMapping()
    @Operation(summary = "사용자 정보(이름만) 수정", description = "사용자 정보 수정한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "401", description = "인증 실패"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<UserRes>> updateUser(
            @RequestParam @Parameter(description = "유저 입력 폼") String name) {

        ResVO<UserRes> result = new ResVO<>();
        HttpStatus status = null;

        AccountUserDetails userDetails = (AccountUserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();

        User user = userService.changeUser(userDetails.getUserId(), name).get();
        result.setData(UserRes.convertTo(user));
        result.setMessage("유저 정보 수정 성공");
        status = HttpStatus.OK;

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

        AccountUserDetails userDetails = (AccountUserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();
        userService.deleteById(userDetails.getUserId());
        resultMap.put("message", "성공");
        status = HttpStatus.OK;

        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @GetMapping("/basket")
    @Operation(summary = "사용자가 참여중인 바구니 조회", description = "로그인 되어있는 사용자가 참여중인 바구니 리스트를 반환한다.(로그인필요)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "사용자 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<ResVO<List<UserBasketWithCountRes>>> getBasketList() {
        ResVO<List<UserBasketWithCountRes>> result = new ResVO<>();
        HttpStatus status = null;

        AccountUserDetails userDetails = (AccountUserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();
        List<UserBasketWithCountRes> bktOfUser = userBasketService.findAllBasketWithCountByUser(userDetails.getUserId());

        result.setMessage("바구니 리스트 조회 성공");
        result.setData(bktOfUser);
        status = HttpStatus.OK;

        return new ResponseEntity<ResVO<List<UserBasketWithCountRes>>>(result, status);
    }

    @PostMapping("/basket")
    @Operation(summary = "바구니 참여", description = "다른 바구니에 참여한다. (로그인필요)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "사용자 또는 바구니 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<Map<String, Object>> joinBasket(
            @RequestParam String joinCode ) {
        Map<String, Object> resultMap = new HashMap<String, Object>();
        HttpStatus status = null;

        AccountUserDetails userDetails = (AccountUserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();
        Basket basket = basketService.findByJoinCode(joinCode);

        // 이미 참여되어 있는지 확인
        boolean check = userBasketService.existsBybktId(userDetails.getUserId(), basket.getId());

        if ( !check && userBasketService.addBasket(userDetails.getUserId(), basket.getId()).isPresent()) {
            resultMap.put("message", "성공");
        } else {
            resultMap.put("message", "이미 참여한 바구니입니다.");
        }
        status = HttpStatus.OK;

        return new ResponseEntity<Map<String, Object>>(resultMap, status);
    }

    @DeleteMapping("/basket/{u_b_id}")
    @Operation(summary = "유저_바구니 ID로 바구니 탈퇴", description = "사용자가 참여중인 바구니를 유저_바구니 Id를 통해 탈퇴한다.(로그인필요)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "성공"),
            @ApiResponse(responseCode = "404", description = "사용자 또는 병원 없음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    public ResponseEntity<Map<String, Object>> leaveBasket(
            @PathVariable @Parameter(description = "유저_바구니 ID") Long u_b_id) {
        Map<String, Object> resultMap = new HashMap<String, Object>();
        HttpStatus status = null;

        AccountUserDetails userDetails = (AccountUserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();
        userBasketService.deleteById(userDetails.getUserId(), u_b_id);
        resultMap.put("message", "성공");
        status = HttpStatus.OK;

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

        AccountUserDetails userDetails = (AccountUserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();
        UserBasket ub = userBasketService.findByUserAndBasket(userDetails.getUserId(), basketId);

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
    public ResponseEntity<ResVO<Boolean>> modifyDefault(@PathVariable Long basketId){
        ResVO<Boolean> result = new ResVO<>();
        HttpStatus status = null;

        AccountUserDetails userDetails = (AccountUserDetails) SecurityContextHolder.getContext().getAuthentication().getDetails();
        Basket defaultBasket = basketService.getBasket(basketId);

        userService.modifyDefault(userDetails.getUserId(), defaultBasket);
        status = HttpStatus.OK;
        result.setMessage("기본 바구니 변경 성공");
        result.setData(true);

        return new ResponseEntity<ResVO<Boolean>>(result, status);
    }
}
