package com.ssafy.barguni.api.product;

import com.ssafy.barguni.api.Picture.Picture;
import com.ssafy.barguni.common.util.NaverImgSearchUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
            //바코드로 사진 이름찾기, 사진 Picture 객체로 만들어 저장하기.
            String name = "안녕";
            Picture pic = new Picture();

            Product newProd = Product.createProduct(pic, barcode, name);

            return prodRepository.save(newProd);
        }

    }

    public String searchTest(String word) throws Exception {
        return NaverImgSearchUtil.imageSearch(word);
    }

}
