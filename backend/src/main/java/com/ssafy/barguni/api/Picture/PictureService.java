package com.ssafy.barguni.api.Picture;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PictureService {
    private final PictureRepository picRepository;

    public Picture getById(Long id) {
        return picRepository.findById(id).get();
    }

//    public Picture createPicByProdName(String prodName) {
//
//    }

}
