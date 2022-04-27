package com.ssafy.barguni.api.product;

import com.ssafy.barguni.api.Picture.Picture;
import com.ssafy.barguni.api.Picture.PictureService;
import com.ssafy.barguni.common.util.ImageUtil;
import com.ssafy.barguni.common.util.NaverImgSearchUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

    public MultipartFile searchImg(String word) throws Exception {
        // 네이버 이미지 검색으로 이미지 url을 따옴
        String imgUrl = NaverImgSearchUtil.imageSearch(word);
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
        MultipartFile multipartFile = new MockMultipartFile(word, word+"."+imgExtension,"image/"+imgExtension, baos.toByteArray());

        // PictureService를 통해 객체를 만들고 저장.
        pictureService.create(multipartFile, "Item", Long.parseLong("3"));
        return multipartFile;
    }

}
