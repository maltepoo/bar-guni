package com.ssafy.barguni.common.util;

import com.ssafy.barguni.api.user.vo.OauthToken;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class KakaoOauthUtil implements SocialOauth {
    @Value("${sns.kakao.url}")
    private String KAKAO_SNS_BASE_URL;
    @Value("${sns.kakao.client.id}")
    private String KAKAO_SNS_CLIENT_ID;
    @Value("${sns.kakao.callback.url}")
    private String KAKAO_SNS_CALLBACK_URL;
    @Value("${sns.kakao.token.url}")
    private String KAKAO_SNS_TOKEN_BASE_URL;
    @Value("${sns.kakao.profile.url}")
    private String KAKAO_SNS_PROFILE_URL;
//    private String KAKAO_SNS_CLIENT_SECRET;

    @Override
    public String getOauthRedirectURL() {
        Map<String, Object> params = new HashMap<>();
        params.put("scope", "account_email profile_nickname");
        params.put("response_type", "code");
        params.put("client_id", KAKAO_SNS_CLIENT_ID);
        params.put("redirect_uri", KAKAO_SNS_CALLBACK_URL);

        String parameterString = params.entrySet().stream()
                .map(x -> x.getKey() + "=" + x.getValue())
                .collect(Collectors.joining("&"));

        return KAKAO_SNS_BASE_URL + "?" + parameterString;
    }


    @Override
    public ResponseEntity<String> requestAccessToken(String code) {
        ResponseEntity<String> tokens = null;
        // 카카오 토큰 요청
        RestTemplate rt = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", KAKAO_SNS_CLIENT_ID);
        params.add("redirect_uri", KAKAO_SNS_CALLBACK_URL);
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest =
                new HttpEntity<>(params, headers);
        try {
            tokens = rt.exchange(
                    KAKAO_SNS_TOKEN_BASE_URL,
                    HttpMethod.POST,
                    kakaoTokenRequest,
                    String.class
            );
        } catch (Exception e) {
            e.printStackTrace();
        }

        return tokens;
    }

    @Override
    public ResponseEntity<String> getProfile(OauthToken oauthToken) {
        ResponseEntity<String> response = null;
        // 카카오 프로필 요청
        RestTemplate rt = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + oauthToken.getAccess_token());
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<MultiValueMap<String, String>> kakaoInfoRequest =
                new HttpEntity<>(headers);
        try {
            response = rt.exchange(
                    KAKAO_SNS_PROFILE_URL,
                    HttpMethod.POST,
                    kakaoInfoRequest,
                    String.class
            );

        } catch (Exception e) {
            e.printStackTrace();
        }

        return response;
    }

    @Override
    public ResponseEntity<String> getProfile(String accessToken) {
        ResponseEntity<String> response = null;
        // 카카오 프로필 요청
        RestTemplate rt = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<MultiValueMap<String, String>> kakaoInfoRequest =
                new HttpEntity<>(headers);
        try {
            response = rt.exchange(
                    KAKAO_SNS_PROFILE_URL,
                    HttpMethod.POST,
                    kakaoInfoRequest,
                    String.class
            );

        } catch (Exception e) {
            e.printStackTrace();
        }

        return response;
    }
}
