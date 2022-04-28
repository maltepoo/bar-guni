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
import com.ssafy.barguni.api.Picture.PictureService;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.net.URL;
import java.net.URLConnection;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {
    private final ProductRepository prodRepository;
    private final PictureService pictureService;

    public Product register(String barcode) throws Exception{
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
            Picture pic = searchImg(name);

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

    public Picture searchImg(String prodName) throws Exception {
        // 네이버 이미지 검색으로 이미지 url을 따옴
        String imgUrl = NaverImgSearchUtil.imageSearch(prodName);
        System.out.println(imgUrl);
        // url에 가서 이미지를 bufferedImage로 읽어오고, 확장자를 가져옴
        URL url = new URL(imgUrl);
        URLConnection conn = url.openConnection();
        BufferedImage image = ImageIO.read(conn.getInputStream());
        String imgExtension = conn.getContentType().split("/")[1];

//        ImageUtil.createByBufferedImg(image, "item", word, imgExtension); // multipartFile로 변환하지 않고 저장하는 함수
        // 이미지를 multipartFile로 변환
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, imgExtension, baos);
        MultipartFile multipartFile = new MockMultipartFile(prodName, prodName+"."+imgExtension,"image/"+imgExtension, baos.toByteArray());

        // PictureService를 통해 객체를 만들고 저장.
        return pictureService.create(multipartFile, "Item");
    }

}
