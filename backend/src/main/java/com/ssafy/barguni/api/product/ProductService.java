package com.ssafy.barguni.api.product;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.barguni.api.Picture.Picture;
import com.ssafy.barguni.api.product.vo.BarcodeDataRes;
import com.ssafy.barguni.common.util.NaverImgSearchUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {
    private final ProductRepository prodRepository;

    public Product register(String barcode) {
        // 바코드 읽어주는 함수 Or api 갔다와서 읽은 바코드를 이 함수로 보냄
        if (prodRepository.existsProductByBarcode(barcode)) {
            return prodRepository.findByBarcode(barcode).get();
        } else {
            BarcodeDataRes barcodeData = null;
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                // 바코드로 정보 조회
                barcodeData = objectMapper.readValue(getData(barcode).getBody(), BarcodeDataRes.class);
                // 바코드 조회 실패
                if(barcodeData.getBarcodeData().getTotalCount() == 0) return null;
            }
            catch (Exception e){
                e.printStackTrace();
            }
            String name = barcodeData.getBarcodeData().getRow().get(0).getPrdlstNm();

            //바코드로 사진 이름찾기, 사진 Picture 객체로 만들어 저장하기.
            Picture pic = new Picture();

            Product newProd = Product.createProduct(pic, barcode, name);
            return prodRepository.save(newProd);
        }

    }

    public String searchTest(String word) throws Exception {
        return NaverImgSearchUtil.imageSearch(word);
    }

    private ResponseEntity<String> getData(String barcode) {
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
}
