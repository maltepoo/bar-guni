package com.ssafy.barguni.api.product;

import com.ssafy.barguni.api.Picture.Picture;
import com.ssafy.barguni.common.util.barcodeSearch.BarcodeSearchUtil;
import com.ssafy.barguni.common.util.NaverImgSearchUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
    private final NaverImgSearchUtil naverImgSearchUtil;
    private final BarcodeSearchUtil barcodeSearchUtil;

    public Product register(String barcode) throws Exception {
        if (prodRepository.existsProductByBarcode(barcode)) {
            return prodRepository.findByBarcode(barcode).get();
        } else {
            String name = null;

            try{
                name = barcodeSearchUtil.getProdNameFromC005(barcode);
            } catch (Exception e){
                e.printStackTrace();
            }

            if (name == null) {
                try{
                    name = barcodeSearchUtil.getProdNameFromI2570(barcode);
                } catch (Exception e){
                    e.printStackTrace();
                }
            }
            System.out.println("제품명" + name);
            Picture pic = searchImg(name);
            Product newProd = Product.createProduct(pic, barcode, name);
            return prodRepository.save(newProd);
        }
    }


    public String searchTest(String word) throws Exception {
        return naverImgSearchUtil.imageSearch(word);
    }


    public Picture searchImg(String prodName) throws Exception {
        // 네이버 이미지 검색으로 이미지 url을 따옴
        String imgUrl = naverImgSearchUtil.imageSearch(prodName);
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
