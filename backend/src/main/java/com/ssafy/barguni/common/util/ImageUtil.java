package com.ssafy.barguni.common.util;

import com.ssafy.barguni.api.Picture.Picture;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

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

    public static Picture create(MultipartFile multipartFile, String entity){
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
            picture.setPicUrl(imageFileName);
            picture.setCreatedAt(LocalDateTime.now());
        }

        return picture;
    }

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
