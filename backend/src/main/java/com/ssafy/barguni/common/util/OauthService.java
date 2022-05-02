package com.ssafy.barguni.common.util;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.barguni.api.user.vo.GoogleProfile;
import com.ssafy.barguni.api.user.vo.KakaoProfile;
import com.ssafy.barguni.api.user.vo.OauthProfileinfo;
import com.ssafy.barguni.api.user.vo.OauthToken;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OauthService {
    private final List<SocialOauth> socialOauthList;
    private final HttpServletResponse response;

    public void request(SocialLoginType socialLoginType) {
        SocialOauth socialOauth = this.findSocialOauthByType(socialLoginType);
        String redirectURL = socialOauth.getOauthRedirectURL();
        try {
            response.sendRedirect(redirectURL);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public ResponseEntity<String> requestAccessToken(SocialLoginType socialLoginType, String code) {
        SocialOauth socialOauth = this.findSocialOauthByType(socialLoginType);
        return (ResponseEntity<String>) socialOauth.requestAccessToken(code);
    }

    private SocialOauth findSocialOauthByType(SocialLoginType socialLoginType) {
        return socialOauthList.stream()
                .filter(x -> x.type() == socialLoginType)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("알 수 없는 SocialLoginType 입니다."));
    }

    public ResponseEntity<String> getProfile(SocialLoginType socialLoginType, OauthToken oauthToken){
        SocialOauth socialOauth = this.findSocialOauthByType(socialLoginType);
        return socialOauth.getProfile(oauthToken);
    }

    public OauthProfileinfo getEmailAndName(SocialLoginType socialLoginType, String responseBody) throws Exception{
        ObjectMapper objectMapper = new ObjectMapper();
        OauthProfileinfo oauthProfileinfo = new OauthProfileinfo();

        System.out.println(responseBody);

        if(socialLoginType == SocialLoginType.GOOGLE){
            GoogleProfile googleProfile = objectMapper.readValue(responseBody, GoogleProfile.class);
            oauthProfileinfo.setEmail(googleProfile.getEmail());
            oauthProfileinfo.setName(googleProfile.getName());
        } else if(socialLoginType == SocialLoginType.KAKAO){
            KakaoProfile kakaoProfile = objectMapper.readValue(responseBody, KakaoProfile.class);
            oauthProfileinfo.setEmail(kakaoProfile.getKakao_account().getEmail());
            oauthProfileinfo.setName(kakaoProfile.getProperties().getNickname());
        } else
            new IllegalArgumentException("알 수 없는 SocialLoginType 입니다.");

        return oauthProfileinfo;
    }
}