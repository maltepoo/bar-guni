package com.ssafy.barguni.common.util.barcodeSearch;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.barguni.common.util.barcodeSearch.vo.BarcodeDataFromC005Res;
import com.ssafy.barguni.common.util.barcodeSearch.vo.BarcodeDataFromI2570Res;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

public class BarcodeSearchUtil {
    public String getProdNameFromC005(String barcode) throws Exception{
        // 바코드 읽어주는 함수 Or api 갔다와서 읽은 바코드를 이 함수로 보냄

        BarcodeDataFromC005Res barcodeData = null;
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            // 바코드로 정보 조회
            barcodeData = objectMapper.readValue(getDataFromC005(barcode).getBody(), BarcodeDataFromC005Res.class);
            // 바코드 조회 실패
            if(barcodeData.getBarcodeData().getTotalCount() == 0) return null;
        }
        catch (Exception e){
            e.printStackTrace();
        }
        String name = barcodeData.getBarcodeData().getRow().get(0).getPrdlstNm();

        return name;
    }

    public String getProdNameFromI2570(String barcode) throws Exception{
        BarcodeDataFromI2570Res barcodeData = null;
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            // 바코드로 정보 조회
            barcodeData = objectMapper.readValue(getDataFromI2570(barcode).getBody(), BarcodeDataFromI2570Res.class);
            // 바코드 조회 실패
            if(barcodeData.getBarcodeData().getTotalCount() == 0) return null;
        }
        catch (Exception e){
            e.printStackTrace();
        }
        String name = barcodeData.getBarcodeData().getRow().get(0).getPrdtNm();
        return name;
    }
    private ResponseEntity<String> getDataFromC005(String barcode) {
        ResponseEntity<String> tokens = null;
        RestTemplate rt = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
//        params.add("BAR_CD", barcode);

        HttpEntity<MultiValueMap<String, String>> barcodeDataRequest =
                new HttpEntity<>(params, headers);
        try {
            tokens = rt.exchange(
                    "http://openapi.foodsafetykorea.go.kr/api/8098e732d9f3451e9955/C005/json/1/1/BAR_CD="+barcode,
                    HttpMethod.GET,
                    barcodeDataRequest,
                    String.class
            );
        } catch (Exception e) {
            e.printStackTrace();
        }

        return tokens;
    }

    private ResponseEntity<String> getDataFromI2570(String barcode) {
        ResponseEntity<String> tokens = null;
        RestTemplate rt = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        HttpEntity<MultiValueMap<String, String>> barcodeDataRequest =
                new HttpEntity<>(params, headers);
        try {
            tokens = rt.exchange(
                    "http://openapi.foodsafetykorea.go.kr/api/8098e732d9f3451e9955/I2570/json/1/1/BRCD_NO="+barcode,
                    HttpMethod.GET,
                    barcodeDataRequest,
                    String.class
            );
        } catch (Exception e) {
            e.printStackTrace();
        }

        return tokens;
    }
}
