package com.ssafy.barguni.api.product;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ProductServiceTest {
    @Autowired
    ProductService productService;

    @Test
    public void 바코드_통신_테스트(){
        productService.register("8809332393536");
    }
}