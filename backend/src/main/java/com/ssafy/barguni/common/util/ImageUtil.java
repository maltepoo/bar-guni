package com.ssafy.barguni.common.util;

import com.ssafy.barguni.api.Picture.Picture;
import com.ssafy.barguni.api.Picture.PictureEntity;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Random;

@Component
public class ImageUtil {
    private static String uploadFolder;

    @Value("${images.path}")
    public void setUploadFolder(String path){
        uploadFolder = path;
    }

    public static Picture create(MultipartFile multipartFile, PictureEntity entity) {
        Picture picture = new Picture();
        String imageFileName = entity + "_" + getRandomCode() + "_" + Long.toString(System.currentTimeMillis()) + "." + FilenameUtils.getExtension(multipartFile.getOriginalFilename());
        Path imageFilePath = Paths.get(uploadFolder + imageFileName);

        if (multipartFile.getSize() != 0) { // 파일이 업로드 되었는지 확인
            try {
                Files.write(imageFilePath, multipartFile.getBytes());
            } catch (Exception e) {
                e.printStackTrace();
            }
            picture.setTitle(multipartFile.getOriginalFilename());
            picture.setPicUrl(imageFilePath.toString());
            picture.setCreatedAt(LocalDateTime.now());
        } else {
            System.out.println("getsize 실패");   //이거는 있어도 될 것 같아서 남겨둡니다
        }

        return picture;
    }

// MultipartFile로 변환하지 않고 bufferedImage인 상태로 저장하는 메서드인데 나중에
// 실행속도 개선할 때 쓸 수도 있을것 같아서 놔둡니다
//    public static Picture createByBufferedImg(BufferedImage bufferedImage, String entity, String name, String imgExtension){
//        Picture picture = new Picture();
//        String imageFileName = entity + "_" + getRandomCode() + "_" + Long.toString(System.currentTimeMillis()) + "." + imgExtension;
//        Path imageFilePath = Paths.get(uploadFolder + imageFileName);
//
//        if (bufferedImage.getData() != null) { // 파일이 업로드 되었는지 확인
//            try {
//                File file = imageFilePath.toFile();
//                ImageIO.write(bufferedImage, imgExtension, file);
//            } catch (Exception e) {
//                e.printStackTrace();
//            }
//            picture.setTitle(name);
//            picture.setPicUrl(imageFileName);
//            picture.setCreatedAt(LocalDateTime.now());
//        }else{
//            System.out.println("getData 실패");
//        }
//
//        return picture;
//    }

    public static Boolean delete(Picture picture){
        String entity = picture.getPicUrl().substring(0,picture.getPicUrl().lastIndexOf("_"));

        // Product 상품 이미지 인 경우 삭제 불가
        if(entity.equals("Product")) return false;

        File file = new File(uploadFolder + picture.getPicUrl());
        file.delete(); // 파일 삭제

        return true;
    }

    public static Picture update(Picture picture, MultipartFile multipartFile){
        String[] entityInfo = picture.getPicUrl().split("_");
        String entity = picture.getPicUrl().substring(0,picture.getPicUrl().lastIndexOf("_"));

        // Product 상품 이미지 인 경우 수정 불가
        if(entity.equals("Product")) return null;

        String imageFileName = entity + "_" + getRandomCode() + "_" + Long.toString(System.currentTimeMillis()) + "." + FilenameUtils.getExtension(multipartFile.getOriginalFilename());
        Path imageFilePath = Paths.get(uploadFolder + imageFileName);

        if (multipartFile.getSize() != 0) { // 파일이 업로드 되었는지 확인
            try {
                File file = new File(uploadFolder + picture.getPicUrl());
                file.delete(); // 원래 파일 삭제
                Files.write(imageFilePath, multipartFile.getBytes()); // 파일 생성
            } catch (Exception e) {
                e.printStackTrace();
            }
            picture.setTitle(multipartFile.getOriginalFilename());
            picture.setPicUrl(imageFileName);
            picture.setCreatedAt(LocalDateTime.now());
        }

        return picture;
    }

    private static String getRandomCode(){
        return RandomStringUtils.randomAlphabetic(7);
    }
}
