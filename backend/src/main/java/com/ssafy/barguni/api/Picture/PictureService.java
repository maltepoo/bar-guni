package com.ssafy.barguni.api.Picture;

import com.ssafy.barguni.common.util.ImageUtil;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor

public class PictureService {
    @Value("${images.path}")
    private String uploadFolder;
    private final PictureRepository picRepository;

    public Picture getById(Long id) {
        return picRepository.findById(id).get();
    }

    @Transactional
    public Picture create(MultipartFile multipartFile, String entity){
        return picRepository.save(ImageUtil.create(multipartFile, entity));
    }

    @Transactional
    public Boolean delete(Long id){
        Picture picture = picRepository.getById(id);
        if(!ImageUtil.delete(picture)) return false;
        picRepository.deleteById(id); // 객체 삭제
        return true;
    }

    @Transactional
    public Picture update(Long pictureId, MultipartFile multipartFile){
        Picture picture = picRepository.getById(pictureId);
        return ImageUtil.update(picture, multipartFile);
    }

//    public Picture createPicByProdName(String prodName) {
//
//    }

}
