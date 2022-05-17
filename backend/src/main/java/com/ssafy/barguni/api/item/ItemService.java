package com.ssafy.barguni.api.item;

import com.ssafy.barguni.api.Picture.Picture;
import com.ssafy.barguni.api.Picture.PictureEntity;
import com.ssafy.barguni.api.Picture.PictureRepository;
import com.ssafy.barguni.api.Picture.PictureService;
import com.ssafy.barguni.api.alert.AlertRepository;
import com.ssafy.barguni.api.basket.entity.Basket;
import com.ssafy.barguni.api.basket.entity.Categories;
import com.ssafy.barguni.api.basket.service.BasketService;
import com.ssafy.barguni.api.basket.service.CategoryService;
import com.ssafy.barguni.api.error.ErrorCode;
import com.ssafy.barguni.api.error.ErrorResVO;
import com.ssafy.barguni.api.error.Exception.BasketException;
import com.ssafy.barguni.api.item.vo.ItemSearch;
import com.ssafy.barguni.api.item.vo.ItemPostReq;
import com.ssafy.barguni.api.item.vo.ReceiptItemRes;
import com.ssafy.barguni.api.product.ProductService;
import com.ssafy.barguni.api.user.UserBasketService;
import com.ssafy.barguni.common.util.ClovaOcrUtil;
import com.ssafy.barguni.common.util.ImageUtil;
import com.ssafy.barguni.api.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.FileReader;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ItemService {
    private final ItemRepository itemRepository;
    private final BasketService basketService;
    private final PictureService pictureService;
    private final CategoryService categoryService;
    private final UserBasketService userBasketService;
    private final ProductService productService;
    private final AlertRepository alertRepository;
    private final PictureRepository pictureRepository;
    private final ProductRepository productRepository;
    private final ClovaOcrUtil clovaOcrUtil;

    public Item saveNewItem(Long userId, ItemPostReq req) {
        if (!userBasketService.existsBybktId(userId, req.getBktId())){
            throw new BasketException(new ErrorResVO(ErrorCode.BASKET_FORBIDDEN));
        }

        Basket bkt = basketService.getBasket(req.getBktId());

        Picture pic;
        if (req.getPicId() != null) {
            pic = pictureService.getById(req.getPicId());
        } else {
            pic = pictureService.getById((long) 1);
        }

        Categories cate;
        if (req.getCateId() != null){
            cate = categoryService.getById(req.getCateId());
        } else {
            cate = categoryService.getByBasketId(req.getBktId()).get(0);
        }

        Item item = Item.createItem(bkt, pic, cate, req);
        return itemRepository.save(item);
    }

    public Item getById(Long id) {
        Item item = itemRepository.findById(id).get();
        return item;
    }

    public List<Item> getListByBktId(Long bktId) {
        return itemRepository.findAllByBasketId(bktId);
    }

    public Item changeItem(Long id, ItemPostReq req) {
        Item item = itemRepository.getById(id);


        if (req.getBktId() != null) {
            Basket bkt = basketService.getBasket(req.getBktId());
            item.setBasket(bkt);
        }
        if (req.getPicId() != null) {
            Picture pic = pictureService.getById(req.getPicId());
            item.setPicture(pic);
        }
        if (req.getCateId() != null) {
            Categories cate = categoryService.getById(req.getCateId());
            item.setCategory(cate);
        }
        if (req.getName() != null) {
            item.setName(req.getName());
        }
        if (req.getAlertBy() != null) {
            item.setAlertBy(req.getAlertBy());
        }
        if (req.getDDAY() != null) {
            item.setDDAY(req.getDDAY());
        }
        if (req.getShelfLife() != null) {
            item.setShelfLife(req.getShelfLife());
        }
        if (req.getContent() != null) {
            item.setContent(req.getContent());
        }
        return itemRepository.save(item);
    }

    public Item changeStatus(Long id, Boolean used) {
        Item item = itemRepository.getById(id);
        item.setUsed(used);
        if (used) {
            item.setUsedDate(LocalDate.now());
        } else {
            item.setUsedDate(null);
        }
        return itemRepository.save(item);
    }

    public void deleteById(Long id) {
        Item item = itemRepository.findWithPictureById(id);
        // alert 삭제
        alertRepository.deleteByItemId(id);
        // item 삭제
        itemRepository.deleteById(id);
        // 이미지 삭제
        if(item.getPicture() != null
                && item.getPicture().getId() != 1L
                && !productRepository.existsProductByPicture(item.getPicture()))
        {
            ImageUtil.delete(item.getPicture());
            pictureRepository.delete(item.getPicture());
        }
    }

    public List<Item> getAllInBasket(Long basketId, Long userId, Boolean used){

        // 참여 중인 바구니 전체 조회인 경우
        if(basketId == -1){
            List<Long> basketIds = userBasketService.findByUserId(userId)
                    .stream()
                    .map(e -> e.getBasket().getId())
                    .collect(Collectors.toList());
            return itemRepository.getMyAllItems(basketIds, used);
        }
        else {
            // 해당 바구니 접근 권한이 없는 경우
            if(!userBasketService.existsByUserAndBasket(userId, basketId))
                throw new BasketException(new ErrorResVO(ErrorCode.BASKET_FORBIDDEN));
            return itemRepository.getAllInBasket(basketId, used);
//            return itemRepository.findItemsByBasket_IdAndUsed(basketId, used); // used 동적 쿼리 불가능
        }
    }

    public List<Item> getItemsUsingFilter(ItemSearch itemSearch, Long userId){
        // 유저와 관련된 전체 바구니 조회
        List<Long> basketIds = userBasketService.findByUserId(userId)
                .stream()
                .map(e -> e.getBasket().getId())
                .collect(Collectors.toList());

        Optional<Long> first = itemSearch
                .getBasketIds()
                .stream()
                .filter(i -> i == -1L)
                .findFirst();

        // 바구니 id 에 -1이 포함된 경우
        // 전체 바구니 조회로 변경
        if(!first.isEmpty())
            itemSearch.setBasketIds(basketIds);
        else
            itemSearch
                    .getBasketIds()
                    .forEach(basketId->{
                        // 검색을 요청한 바구니에 접근 권한이 없는 경우
                        if(!basketIds.contains(basketId))
                            throw new BasketException(new ErrorResVO(ErrorCode.BASKET_FORBIDDEN));
                    });

        return itemRepository.getItemsUsingFilter(itemSearch);
    }

    public List<Item> findAll(){
        return itemRepository.findAllWithBasket();
    }

    public boolean canUserChangeItem(Long userId, Long itemId){
        Item item = getById(itemId);
        Long bktId = item.getBasket().getId();
        if (userBasketService.findByUserAndBasket(userId, bktId) != null) return true;
        return false;
    }

    public void deleteUsedItemInBasket(Long bktId) {
        List<Item> usedInBasket = itemRepository.getAllInBasket(bktId, true);
        for (Item i : usedInBasket) {
            deleteById(i.getId());
        }
    }

    public List<ReceiptItemRes> readReceipt(MultipartFile multipartFile) throws Exception {

//        테스트용
//        BufferedReader reader = new BufferedReader(
//                new FileReader("https://k6b202.p.ssafy.io:8080/images/receipt4.txt"),
//                16 * 1024);
//        String result = reader.readLine();
//        String result = "{\"version\":\"V2\",\"requestId\":\"57bf563e-e384-4d51-b8ce-2e371c7f8bf5\",\"timestamp\":1652265486682,\"images\":[{\"receipt\":{\"meta\":{\"estimatedLanguage\":\"ko\"},\"result\":{\"subResults\":[{\"items\":[{\"name\":{\"text\":\"피코크 초마짬뽕 12\",\"formatted\":{\"value\":\"피코크 초마짬뽕 12\"},\"boundingPolys\":[{\"vertices\":[{\"x\":84.0,\"y\":55.0},{\"x\":148.0,\"y\":55.0},{\"x\":148.0,\"y\":79.0},{\"x\":84.0,\"y\":79.0}]},{\"vertices\":[{\"x\":150.0,\"y\":56.0},{\"x\":230.0,\"y\":56.0},{\"x\":230.0,\"y\":81.0},{\"x\":150.0,\"y\":81.0}]},{\"vertices\":[{\"x\":231.0,\"y\":59.0},{\"x\":255.0,\"y\":59.0},{\"x\":255.0,\"y\":75.0},{\"x\":231.0,\"y\":75.0}]}],\"maskingPolys\":[]},\"count\":{\"text\":\"2\",\"formatted\":{\"value\":\"2\"},\"boundingPolys\":[{\"vertices\":[{\"x\":358.0,\"y\":59.0},{\"x\":372.0,\"y\":59.0},{\"x\":372.0,\"y\":75.0},{\"x\":358.0,\"y\":75.0}]}]},\"price\":{\"price\":{\"text\":\"16.960\",\"formatted\":{\"value\":\"16960\"},\"boundingPolys\":[{\"vertices\":[{\"x\":404.0,\"y\":57.0},{\"x\":466.0,\"y\":56.0},{\"x\":466.0,\"y\":73.0},{\"x\":404.0,\"y\":74.0}]}]},\"unitPrice\":{\"text\":\"8,480\",\"formatted\":{\"value\":\"8480\"},\"boundingPolys\":[{\"vertices\":[{\"x\":284.0,\"y\":59.0},{\"x\":336.0,\"y\":59.0},{\"x\":336.0,\"y\":77.0},{\"x\":284.0,\"y\":77.0}]}]}}},{\"name\":{\"text\":\"(G)피코크 레이디핑\",\"formatted\":{\"value\":\"(G)피코크 레이디핑\"},\"boundingPolys\":[{\"vertices\":[{\"x\":85.0,\"y\":76.0},{\"x\":175.0,\"y\":76.0},{\"x\":175.0,\"y\":100.0},{\"x\":85.0,\"y\":100.0}]},{\"vertices\":[{\"x\":177.0,\"y\":77.0},{\"x\":256.0,\"y\":77.0},{\"x\":256.0,\"y\":102.0},{\"x\":177.0,\"y\":102.0}]}],\"maskingPolys\":[]},\"count\":{\"text\":\",\",\"boundingPolys\":[{\"vertices\":[{\"x\":359.0,\"y\":82.0},{\"x\":369.0,\"y\":82.0},{\"x\":369.0,\"y\":94.0},{\"x\":359.0,\"y\":94.0}]}]},\"price\":{\"price\":{\"text\":\"9.980\",\"formatted\":{\"value\":\"9980\"},\"boundingPolys\":[{\"vertices\":[{\"x\":410.0,\"y\":77.0},{\"x\":464.0,\"y\":77.0},{\"x\":464.0,\"y\":96.0},{\"x\":410.0,\"y\":96.0}]}]},\"unitPrice\":{\"text\":\"9,980\",\"formatted\":{\"value\":\"9980\"},\"boundingPolys\":[{\"vertices\":[{\"x\":284.0,\"y\":80.0},{\"x\":336.0,\"y\":80.0},{\"x\":336.0,\"y\":98.0},{\"x\":283.0,\"y\":97.0}]}]}}},{\"name\":{\"text\":\"무지개 방울토마토9\",\"formatted\":{\"value\":\"무지개 방울토마토9\"},\"boundingPolys\":[{\"vertices\":[{\"x\":87.0,\"y\":96.0},{\"x\":151.0,\"y\":96.0},{\"x\":151.0,\"y\":123.0},{\"x\":87.0,\"y\":123.0}]},{\"vertices\":[{\"x\":154.0,\"y\":98.0},{\"x\":256.0,\"y\":98.0},{\"x\":256.0,\"y\":122.0},{\"x\":154.0,\"y\":122.0}]}],\"maskingPolys\":[]},\"count\":{\"text\":\",\",\"boundingPolys\":[{\"vertices\":[{\"x\":358.0,\"y\":103.0},{\"x\":370.0,\"y\":103.0},{\"x\":370.0,\"y\":115.0},{\"x\":358.0,\"y\":115.0}]}]},\"price\":{\"price\":{\"text\":\"9.500\",\"formatted\":{\"value\":\"9500\"},\"boundingPolys\":[{\"vertices\":[{\"x\":410.0,\"y\":100.0},{\"x\":464.0,\"y\":99.0},{\"x\":464.0,\"y\":117.0},{\"x\":410.0,\"y\":117.0}]}]},\"unitPrice\":{\"text\":\"9,500\",\"formatted\":{\"value\":\"9500\"},\"boundingPolys\":[{\"vertices\":[{\"x\":284.0,\"y\":101.0},{\"x\":335.0,\"y\":101.0},{\"x\":335.0,\"y\":118.0},{\"x\":284.0,\"y\":118.0}]}]}}},{\"name\":{\"text\":\"델몬트파머스주스2\",\"formatted\":{\"value\":\"델몬트파머스주스2\"},\"boundingPolys\":[{\"vertices\":[{\"x\":89.0,\"y\":118.0},{\"x\":249.0,\"y\":118.0},{\"x\":249.0,\"y\":143.0},{\"x\":89.0,\"y\":143.0}]}],\"maskingPolys\":[]},\"count\":{\"text\":\"1\",\"formatted\":{\"value\":\"1\"},\"boundingPolys\":[{\"vertices\":[{\"x\":357.0,\"y\":123.0},{\"x\":370.0,\"y\":123.0},{\"x\":370.0,\"y\":138.0},{\"x\":357.0,\"y\":138.0}]}]},\"price\":{\"price\":{\"text\":\"8,380\",\"formatted\":{\"value\":\"8380\"},\"boundingPolys\":[{\"vertices\":[{\"x\":410.0,\"y\":120.0},{\"x\":463.0,\"y\":120.0},{\"x\":463.0,\"y\":138.0},{\"x\":410.0,\"y\":138.0}]}]},\"unitPrice\":{\"text\":\"8,380\",\"formatted\":{\"value\":\"8380\"},\"boundingPolys\":[{\"vertices\":[{\"x\":285.0,\"y\":122.0},{\"x\":335.0,\"y\":122.0},{\"x\":335.0,\"y\":140.0},{\"x\":285.0,\"y\":140.0}]}]}}},{\"name\":{\"text\":\"서울 저지방우유 1L\",\"formatted\":{\"value\":\"서울 저지방우유 1L\"},\"boundingPolys\":[{\"vertices\":[{\"x\":91.0,\"y\":138.0},{\"x\":134.0,\"y\":138.0},{\"x\":134.0,\"y\":163.0},{\"x\":91.0,\"y\":163.0}]},{\"vertices\":[{\"x\":136.0,\"y\":139.0},{\"x\":231.0,\"y\":139.0},{\"x\":231.0,\"y\":164.0},{\"x\":136.0,\"y\":164.0}]},{\"vertices\":[{\"x\":233.0,\"y\":144.0},{\"x\":254.0,\"y\":144.0},{\"x\":254.0,\"y\":158.0},{\"x\":233.0,\"y\":158.0}]}],\"maskingPolys\":[]},\"count\":{\"text\":\"1\",\"formatted\":{\"value\":\"1\"},\"boundingPolys\":[{\"vertices\":[{\"x\":356.0,\"y\":144.0},{\"x\":371.0,\"y\":144.0},{\"x\":371.0,\"y\":158.0},{\"x\":356.0,\"y\":158.0}]}]},\"price\":{\"price\":{\"text\":\"2,580\",\"formatted\":{\"value\":\"2580\"},\"boundingPolys\":[{\"vertices\":[{\"x\":410.0,\"y\":142.0},{\"x\":462.0,\"y\":142.0},{\"x\":462.0,\"y\":159.0},{\"x\":410.0,\"y\":159.0}]}]},\"unitPrice\":{\"text\":\"2.580\",\"formatted\":{\"value\":\"2580\"},\"boundingPolys\":[{\"vertices\":[{\"x\":285.0,\"y\":142.0},{\"x\":336.0,\"y\":143.0},{\"x\":335.0,\"y\":161.0},{\"x\":284.0,\"y\":160.0}]}]}}},{\"name\":{\"text\":\"제주목심구이용\",\"formatted\":{\"value\":\"제주목심구이용\"},\"boundingPolys\":[{\"vertices\":[{\"x\":111.0,\"y\":158.0},{\"x\":241.0,\"y\":160.0},{\"x\":240.0,\"y\":186.0},{\"x\":111.0,\"y\":183.0}]}],\"maskingPolys\":[]},\"count\":{\"text\":\"1\",\"formatted\":{\"value\":\"1\"},\"boundingPolys\":[{\"vertices\":[{\"x\":357.0,\"y\":166.0},{\"x\":369.0,\"y\":166.0},{\"x\":369.0,\"y\":178.0},{\"x\":357.0,\"y\":178.0}]}]},\"price\":{\"price\":{\"text\":\"12,370\",\"formatted\":{\"value\":\"12370\"},\"boundingPolys\":[{\"vertices\":[{\"x\":401.0,\"y\":163.0},{\"x\":461.0,\"y\":163.0},{\"x\":461.0,\"y\":180.0},{\"x\":401.0,\"y\":180.0}]}]},\"unitPrice\":{\"text\":\"12,370\",\"formatted\":{\"value\":\"12370\"},\"boundingPolys\":[{\"vertices\":[{\"x\":277.0,\"y\":163.0},{\"x\":335.0,\"y\":163.0},{\"x\":335.0,\"y\":181.0},{\"x\":277.0,\"y\":181.0}]}]}}},{\"name\":{\"text\":\"CJ 고메치킨 핫스파\",\"formatted\":{\"value\":\"CJ 고메치킨 핫스파\"},\"boundingPolys\":[{\"vertices\":[{\"x\":92.0,\"y\":182.0},{\"x\":118.0,\"y\":182.0},{\"x\":118.0,\"y\":197.0},{\"x\":92.0,\"y\":197.0}]},{\"vertices\":[{\"x\":121.0,\"y\":179.0},{\"x\":198.0,\"y\":180.0},{\"x\":197.0,\"y\":204.0},{\"x\":120.0,\"y\":202.0}]},{\"vertices\":[{\"x\":200.0,\"y\":181.0},{\"x\":257.0,\"y\":182.0},{\"x\":257.0,\"y\":205.0},{\"x\":199.0,\"y\":204.0}]}],\"maskingPolys\":[]},\"count\":{\"text\":\"·\",\"boundingPolys\":[{\"vertices\":[{\"x\":358.0,\"y\":186.0},{\"x\":368.0,\"y\":186.0},{\"x\":368.0,\"y\":197.0},{\"x\":358.0,\"y\":197.0}]}]},\"price\":{\"price\":{\"text\":\"7,980\",\"formatted\":{\"value\":\"7980\"},\"boundingPolys\":[{\"vertices\":[{\"x\":408.0,\"y\":183.0},{\"x\":460.0,\"y\":183.0},{\"x\":460.0,\"y\":200.0},{\"x\":408.0,\"y\":200.0}]}]},\"unitPrice\":{\"text\":\"7,980\",\"formatted\":{\"value\":\"7980\"},\"boundingPolys\":[{\"vertices\":[{\"x\":285.0,\"y\":184.0},{\"x\":335.0,\"y\":184.0},{\"x\":335.0,\"y\":201.0},{\"x\":285.0,\"y\":201.0}]}]}}},{\"name\":{\"text\":\"CJ 고메치킨 순살\",\"formatted\":{\"value\":\"CJ 고메치킨 순살\"},\"boundingPolys\":[{\"vertices\":[{\"x\":95.0,\"y\":222.0},{\"x\":121.0,\"y\":222.0},{\"x\":121.0,\"y\":236.0},{\"x\":95.0,\"y\":236.0}]},{\"vertices\":[{\"x\":123.0,\"y\":217.0},{\"x\":200.0,\"y\":219.0},{\"x\":200.0,\"y\":243.0},{\"x\":123.0,\"y\":241.0}]},{\"vertices\":[{\"x\":202.0,\"y\":219.0},{\"x\":241.0,\"y\":219.0},{\"x\":241.0,\"y\":243.0},{\"x\":202.0,\"y\":243.0}]}],\"maskingPolys\":[]},\"count\":{\"text\":\",\",\"boundingPolys\":[{\"vertices\":[{\"x\":357.0,\"y\":227.0},{\"x\":367.0,\"y\":227.0},{\"x\":367.0,\"y\":237.0},{\"x\":357.0,\"y\":237.0}]}]},\"price\":{\"price\":{\"text\":\"7.980\",\"formatted\":{\"value\":\"7980\"},\"boundingPolys\":[{\"vertices\":[{\"x\":407.0,\"y\":223.0},{\"x\":458.0,\"y\":223.0},{\"x\":458.0,\"y\":239.0},{\"x\":407.0,\"y\":239.0}]}]},\"unitPrice\":{\"text\":\"7,980\",\"formatted\":{\"value\":\"7980\"},\"boundingPolys\":[{\"vertices\":[{\"x\":285.0,\"y\":223.0},{\"x\":335.0,\"y\":223.0},{\"x\":335.0,\"y\":240.0},{\"x\":285.0,\"y\":240.0}]}]}}},{\"name\":{\"text\":\"생각테일새우(51~60\",\"formatted\":{\"value\":\"생각테일새우(51~60\"},\"boundingPolys\":[{\"vertices\":[{\"x\":100.0,\"y\":257.0},{\"x\":259.0,\"y\":257.0},{\"x\":259.0,\"y\":280.0},{\"x\":100.0,\"y\":280.0}]}],\"maskingPolys\":[]},\"count\":{\"text\":\"1\",\"formatted\":{\"value\":\"1\"},\"boundingPolys\":[{\"vertices\":[{\"x\":358.0,\"y\":265.0},{\"x\":366.0,\"y\":265.0},{\"x\":366.0,\"y\":274.0},{\"x\":358.0,\"y\":274.0}]}]},\"price\":{\"price\":{\"text\":\"14,800\",\"formatted\":{\"value\":\"14800\"},\"boundingPolys\":[{\"vertices\":[{\"x\":400.0,\"y\":261.0},{\"x\":456.0,\"y\":261.0},{\"x\":456.0,\"y\":276.0},{\"x\":400.0,\"y\":276.0}]}]},\"unitPrice\":{\"text\":\"14,800\",\"formatted\":{\"value\":\"14800\"},\"boundingPolys\":[{\"vertices\":[{\"x\":279.0,\"y\":263.0},{\"x\":335.0,\"y\":263.0},{\"x\":335.0,\"y\":278.0},{\"x\":279.0,\"y\":278.0}]}]}}},{\"name\":{\"text\":\"피코크 한우곰탕500\",\"formatted\":{\"value\":\"피코크 한우곰탕500\"},\"boundingPolys\":[{\"vertices\":[{\"x\":100.0,\"y\":278.0},{\"x\":158.0,\"y\":276.0},{\"x\":158.0,\"y\":297.0},{\"x\":101.0,\"y\":299.0}]},{\"vertices\":[{\"x\":162.0,\"y\":277.0},{\"x\":260.0,\"y\":277.0},{\"x\":260.0,\"y\":299.0},{\"x\":162.0,\"y\":299.0}]}],\"maskingPolys\":[]},\"count\":{\"text\":\"1\",\"formatted\":{\"value\":\"1\"},\"boundingPolys\":[{\"vertices\":[{\"x\":356.0,\"y\":282.0},{\"x\":369.0,\"y\":282.0},{\"x\":369.0,\"y\":293.0},{\"x\":356.0,\"y\":293.0}]}]},\"price\":{\"price\":{\"text\":\"2,980\",\"formatted\":{\"value\":\"2980\"},\"boundingPolys\":[{\"vertices\":[{\"x\":406.0,\"y\":279.0},{\"x\":454.0,\"y\":279.0},{\"x\":454.0,\"y\":293.0},{\"x\":406.0,\"y\":293.0}]}]},\"unitPrice\":{\"text\":\"2,980\",\"formatted\":{\"value\":\"2980\"},\"boundingPolys\":[{\"vertices\":[{\"x\":287.0,\"y\":280.0},{\"x\":335.0,\"y\":280.0},{\"x\":335.0,\"y\":296.0},{\"x\":287.0,\"y\":296.0}]}]}}},{\"name\":{\"text\":\"강황을먹고자란오리\",\"formatted\":{\"value\":\"강황을먹고자란오리\"},\"boundingPolys\":[{\"vertices\":[{\"x\":102.0,\"y\":294.0},{\"x\":260.0,\"y\":295.0},{\"x\":260.0,\"y\":318.0},{\"x\":102.0,\"y\":318.0}]}],\"maskingPolys\":[]},\"count\":{\"text\":\"1\",\"formatted\":{\"value\":\"1\"},\"boundingPolys\":[{\"vertices\":[{\"x\":356.0,\"y\":298.0},{\"x\":367.0,\"y\":298.0},{\"x\":367.0,\"y\":310.0},{\"x\":356.0,\"y\":310.0}]}]},\"price\":{\"price\":{\"text\":\"9,800\",\"formatted\":{\"value\":\"9800\"},\"boundingPolys\":[{\"vertices\":[{\"x\":405.0,\"y\":295.0},{\"x\":452.0,\"y\":294.0},{\"x\":452.0,\"y\":307.0},{\"x\":405.0,\"y\":308.0}]}]},\"unitPrice\":{\"text\":\"9,800\",\"formatted\":{\"value\":\"9800\"},\"boundingPolys\":[{\"vertices\":[{\"x\":288.0,\"y\":298.0},{\"x\":335.0,\"y\":298.0},{\"x\":335.0,\"y\":312.0},{\"x\":288.0,\"y\":312.0}]}]}}},{\"name\":{\"text\":\"· 동원 훈제연어 레드\",\"formatted\":{\"value\":\"· 동원 훈제연어 레드\"},\"boundingPolys\":[{\"vertices\":[{\"x\":58.0,\"y\":319.0},{\"x\":86.0,\"y\":319.0},{\"x\":86.0,\"y\":332.0},{\"x\":58.0,\"y\":332.0}]},{\"vertices\":[{\"x\":103.0,\"y\":315.0},{\"x\":142.0,\"y\":313.0},{\"x\":143.0,\"y\":335.0},{\"x\":103.0,\"y\":336.0}]},{\"vertices\":[{\"x\":146.0,\"y\":314.0},{\"x\":218.0,\"y\":314.0},{\"x\":218.0,\"y\":335.0},{\"x\":146.0,\"y\":335.0}]},{\"vertices\":[{\"x\":222.0,\"y\":314.0},{\"x\":260.0,\"y\":314.0},{\"x\":260.0,\"y\":332.0},{\"x\":222.0,\"y\":332.0}]}],\"maskingPolys\":[]},\"price\":{\"price\":{\"text\":\"8,980\",\"formatted\":{\"value\":\"8980\"},\"boundingPolys\":[{\"vertices\":[{\"x\":403.0,\"y\":310.0},{\"x\":451.0,\"y\":310.0},{\"x\":451.0,\"y\":324.0},{\"x\":403.0,\"y\":324.0}]}]},\"unitPrice\":{\"text\":\"8,980\",\"formatted\":{\"value\":\"8980\"},\"boundingPolys\":[{\"vertices\":[{\"x\":288.0,\"y\":313.0},{\"x\":334.0,\"y\":313.0},{\"x\":334.0,\"y\":325.0},{\"x\":288.0,\"y\":325.0}]}]}}},{\"name\":{\"text\":\"· 생생느타리(팩)\",\"formatted\":{\"value\":\"· 생생느타리(팩)\"},\"boundingPolys\":[{\"vertices\":[{\"x\":58.0,\"y\":337.0},{\"x\":87.0,\"y\":333.0},{\"x\":89.0,\"y\":346.0},{\"x\":60.0,\"y\":350.0}]},{\"vertices\":[{\"x\":104.0,\"y\":332.0},{\"x\":229.0,\"y\":329.0},{\"x\":230.0,\"y\":351.0},{\"x\":105.0,\"y\":355.0}]}],\"maskingPolys\":[]},\"count\":{\"text\":\"1\",\"formatted\":{\"value\":\"1\"},\"boundingPolys\":[{\"vertices\":[{\"x\":356.0,\"y\":330.0},{\"x\":366.0,\"y\":330.0},{\"x\":366.0,\"y\":341.0},{\"x\":356.0,\"y\":341.0}]}]},\"price\":{\"price\":{\"text\":\"1.990\",\"formatted\":{\"value\":\"1990\"},\"boundingPolys\":[{\"vertices\":[{\"x\":406.0,\"y\":327.0},{\"x\":451.0,\"y\":327.0},{\"x\":451.0,\"y\":342.0},{\"x\":406.0,\"y\":342.0}]}]},\"unitPrice\":{\"text\":\"1.990\",\"formatted\":{\"value\":\"1990\"},\"boundingPolys\":[{\"vertices\":[{\"x\":290.0,\"y\":328.0},{\"x\":335.0,\"y\":328.0},{\"x\":335.0,\"y\":344.0},{\"x\":290.0,\"y\":344.0}]}]}}},{\"name\":{\"text\":\"논산양촌상추(봉)\",\"formatted\":{\"value\":\"논산양촌상추(봉)\"},\"boundingPolys\":[{\"vertices\":[{\"x\":102.0,\"y\":350.0},{\"x\":245.0,\"y\":347.0},{\"x\":245.0,\"y\":371.0},{\"x\":102.0,\"y\":374.0}]}],\"maskingPolys\":[]},\"price\":{\"price\":{\"text\":\"1.180\",\"formatted\":{\"value\":\"1180\"},\"boundingPolys\":[{\"vertices\":[{\"x\":407.0,\"y\":345.0},{\"x\":452.0,\"y\":345.0},{\"x\":452.0,\"y\":359.0},{\"x\":407.0,\"y\":359.0}]}]},\"unitPrice\":{\"text\":\"1,180\",\"formatted\":{\"value\":\"1180\"},\"boundingPolys\":[{\"vertices\":[{\"x\":290.0,\"y\":347.0},{\"x\":335.0,\"y\":347.0},{\"x\":335.0,\"y\":362.0},{\"x\":290.0,\"y\":362.0}]}]}}},{\"name\":{\"text\":\"* 애호박\",\"formatted\":{\"value\":\"* 애호박\"},\"boundingPolys\":[{\"vertices\":[{\"x\":59.0,\"y\":373.0},{\"x\":87.0,\"y\":373.0},{\"x\":87.0,\"y\":387.0},{\"x\":59.0,\"y\":387.0}]},{\"vertices\":[{\"x\":101.0,\"y\":370.0},{\"x\":160.0,\"y\":369.0},{\"x\":161.0,\"y\":392.0},{\"x\":102.0,\"y\":394.0}]}],\"maskingPolys\":[]},\"price\":{\"price\":{\"text\":\"1,380\",\"formatted\":{\"value\":\"1380\"},\"boundingPolys\":[{\"vertices\":[{\"x\":407.0,\"y\":363.0},{\"x\":454.0,\"y\":363.0},{\"x\":454.0,\"y\":379.0},{\"x\":407.0,\"y\":379.0}]}]},\"unitPrice\":{\"text\":\"1,380\",\"formatted\":{\"value\":\"1380\"},\"boundingPolys\":[{\"vertices\":[{\"x\":291.0,\"y\":363.0},{\"x\":336.0,\"y\":366.0},{\"x\":336.0,\"y\":382.0},{\"x\":290.0,\"y\":379.0}]}]}}},{\"name\":{\"text\":\"후레쉬센터 990깐대\",\"formatted\":{\"value\":\"후레쉬센터 990깐대\"},\"boundingPolys\":[{\"vertices\":[{\"x\":101.0,\"y\":389.0},{\"x\":194.0,\"y\":386.0},{\"x\":195.0,\"y\":411.0},{\"x\":102.0,\"y\":414.0}]},{\"vertices\":[{\"x\":195.0,\"y\":386.0},{\"x\":262.0,\"y\":386.0},{\"x\":262.0,\"y\":407.0},{\"x\":195.0,\"y\":407.0}]}],\"maskingPolys\":[]},\"price\":{\"price\":{\"text\":\"990\",\"formatted\":{\"value\":\"990\"},\"boundingPolys\":[{\"vertices\":[{\"x\":423.0,\"y\":382.0},{\"x\":457.0,\"y\":382.0},{\"x\":457.0,\"y\":399.0},{\"x\":423.0,\"y\":399.0}]}]},\"unitPrice\":{\"text\":\"990\",\"formatted\":{\"value\":\"990\"},\"boundingPolys\":[{\"vertices\":[{\"x\":305.0,\"y\":384.0},{\"x\":337.0,\"y\":384.0},{\"x\":337.0,\"y\":401.0},{\"x\":305.0,\"y\":401.0}]}]}}},{\"name\":{\"text\":\"*\",\"formatted\":{\"value\":\"*\"},\"boundingPolys\":[{\"vertices\":[{\"x\":58.0,\"y\":412.0},{\"x\":86.0,\"y\":412.0},{\"x\":86.0,\"y\":425.0},{\"x\":58.0,\"y\":425.0}]}],\"maskingPolys\":[]}},{\"name\":{\"text\":\"토종의성깐마늘(200\",\"formatted\":{\"value\":\"토종의성깐마늘(200\"},\"boundingPolys\":[{\"vertices\":[{\"x\":99.0,\"y\":409.0},{\"x\":262.0,\"y\":403.0},{\"x\":263.0,\"y\":427.0},{\"x\":100.0,\"y\":432.0}]}],\"maskingPolys\":[]},\"price\":{\"price\":{\"text\":\"2,980\",\"formatted\":{\"value\":\"2980\"},\"boundingPolys\":[{\"vertices\":[{\"x\":408.0,\"y\":401.0},{\"x\":458.0,\"y\":401.0},{\"x\":458.0,\"y\":419.0},{\"x\":408.0,\"y\":419.0}]}]},\"unitPrice\":{\"text\":\"2,980\",\"formatted\":{\"value\":\"2980\"},\"boundingPolys\":[{\"vertices\":[{\"x\":289.0,\"y\":404.0},{\"x\":338.0,\"y\":404.0},{\"x\":338.0,\"y\":421.0},{\"x\":289.0,\"y\":421.0}]}]}}},{\"name\":{\"text\":\"사과 벌크\",\"formatted\":{\"value\":\"사과 벌크\"},\"boundingPolys\":[{\"vertices\":[{\"x\":98.0,\"y\":428.0},{\"x\":141.0,\"y\":427.0},{\"x\":141.0,\"y\":452.0},{\"x\":99.0,\"y\":454.0}]},{\"vertices\":[{\"x\":144.0,\"y\":427.0},{\"x\":186.0,\"y\":427.0},{\"x\":186.0,\"y\":451.0},{\"x\":144.0,\"y\":451.0}]}],\"maskingPolys\":[]},\"price\":{\"price\":{\"text\":\"2,930\",\"formatted\":{\"value\":\"2930\"},\"boundingPolys\":[{\"vertices\":[{\"x\":409.0,\"y\":422.0},{\"x\":459.0,\"y\":422.0},{\"x\":459.0,\"y\":440.0},{\"x\":409.0,\"y\":440.0}]}]},\"unitPrice\":{\"text\":\"2,930\",\"formatted\":{\"value\":\"2930\"},\"boundingPolys\":[{\"vertices\":[{\"x\":290.0,\"y\":423.0},{\"x\":338.0,\"y\":423.0},{\"x\":338.0,\"y\":441.0},{\"x\":290.0,\"y\":441.0}]}]}}},{\"name\":{\"text\":\"농심닭다리너겟 130\",\"formatted\":{\"value\":\"농심닭다리너겟 130\"},\"boundingPolys\":[{\"vertices\":[{\"x\":98.0,\"y\":448.0},{\"x\":229.0,\"y\":443.0},{\"x\":230.0,\"y\":470.0},{\"x\":99.0,\"y\":476.0}]},{\"vertices\":[{\"x\":231.0,\"y\":446.0},{\"x\":262.0,\"y\":446.0},{\"x\":262.0,\"y\":462.0},{\"x\":231.0,\"y\":462.0}]}],\"maskingPolys\":[]},\"count\":{\"text\":\"1\",\"formatted\":{\"value\":\"1\"},\"boundingPolys\":[{\"vertices\":[{\"x\":361.0,\"y\":446.0},{\"x\":372.0,\"y\":446.0},{\"x\":372.0,\"y\":460.0},{\"x\":361.0,\"y\":460.0}]}]},\"price\":{\"price\":{\"text\":\"1,980\",\"formatted\":{\"value\":\"1980\"},\"boundingPolys\":[{\"vertices\":[{\"x\":411.0,\"y\":443.0},{\"x\":460.0,\"y\":443.0},{\"x\":460.0,\"y\":460.0},{\"x\":411.0,\"y\":460.0}]}]},\"unitPrice\":{\"text\":\"1,980\",\"formatted\":{\"value\":\"1980\"},\"boundingPolys\":[{\"vertices\":[{\"x\":290.0,\"y\":444.0},{\"x\":338.0,\"y\":443.0},{\"x\":339.0,\"y\":460.0},{\"x\":290.0,\"y\":462.0}]}]}}},{\"name\":{\"text\":\"마리오케이퍼100g\",\"formatted\":{\"value\":\"마리오케이퍼100g\"},\"boundingPolys\":[{\"vertices\":[{\"x\":97.0,\"y\":470.0},{\"x\":246.0,\"y\":464.0},{\"x\":247.0,\"y\":489.0},{\"x\":98.0,\"y\":495.0}]}],\"maskingPolys\":[]},\"count\":{\"text\":\"·\",\"boundingPolys\":[{\"vertices\":[{\"x\":361.0,\"y\":462.0},{\"x\":371.0,\"y\":462.0},{\"x\":371.0,\"y\":478.0},{\"x\":361.0,\"y\":478.0}]}]},\"price\":{\"price\":{\"text\":\"3,180\",\"formatted\":{\"value\":\"3180\"},\"boundingPolys\":[{\"vertices\":[{\"x\":410.0,\"y\":463.0},{\"x\":461.0,\"y\":463.0},{\"x\":461.0,\"y\":479.0},{\"x\":410.0,\"y\":479.0}]}]},\"unitPrice\":{\"text\":\"3,180\",\"formatted\":{\"value\":\"3180\"},\"boundingPolys\":[{\"vertices\":[{\"x\":289.0,\"y\":464.0},{\"x\":339.0,\"y\":464.0},{\"x\":339.0,\"y\":481.0},{\"x\":289.0,\"y\":481.0}]}]}}},{\"name\":{\"text\":\"* 후레쉬센터 제주감\",\"formatted\":{\"value\":\"* 후레쉬센터 제주감\"},\"boundingPolys\":[{\"vertices\":[{\"x\":55.0,\"y\":493.0},{\"x\":83.0,\"y\":493.0},{\"x\":83.0,\"y\":506.0},{\"x\":55.0,\"y\":506.0}]},{\"vertices\":[{\"x\":97.0,\"y\":489.0},{\"x\":192.0,\"y\":486.0},{\"x\":193.0,\"y\":512.0},{\"x\":97.0,\"y\":515.0}]},{\"vertices\":[{\"x\":194.0,\"y\":485.0},{\"x\":254.0,\"y\":483.0},{\"x\":255.0,\"y\":510.0},{\"x\":195.0,\"y\":512.0}]}],\"maskingPolys\":[]},\"count\":{\"text\":\"1\",\"formatted\":{\"value\":\"1\"},\"boundingPolys\":[{\"vertices\":[{\"x\":362.0,\"y\":486.0},{\"x\":372.0,\"y\":486.0},{\"x\":372.0,\"y\":498.0},{\"x\":362.0,\"y\":498.0}]}]},\"price\":{\"price\":{\"text\":\"1,010\",\"formatted\":{\"value\":\"1010\"},\"boundingPolys\":[{\"vertices\":[{\"x\":413.0,\"y\":483.0},{\"x\":463.0,\"y\":483.0},{\"x\":463.0,\"y\":501.0},{\"x\":413.0,\"y\":501.0}]}]},\"unitPrice\":{\"text\":\"1,010\",\"formatted\":{\"value\":\"1010\"},\"boundingPolys\":[{\"vertices\":[{\"x\":291.0,\"y\":484.0},{\"x\":339.0,\"y\":484.0},{\"x\":339.0,\"y\":502.0},{\"x\":291.0,\"y\":502.0}]}]}}},{\"name\":{\"text\":\"상하리코타치즈 200\",\"formatted\":{\"value\":\"상하리코타치즈 200\"},\"boundingPolys\":[{\"vertices\":[{\"x\":97.0,\"y\":510.0},{\"x\":227.0,\"y\":506.0},{\"x\":228.0,\"y\":532.0},{\"x\":98.0,\"y\":537.0}]},{\"vertices\":[{\"x\":228.0,\"y\":506.0},{\"x\":262.0,\"y\":506.0},{\"x\":262.0,\"y\":525.0},{\"x\":228.0,\"y\":525.0}]}],\"maskingPolys\":[]},\"count\":{\"text\":\"1\",\"formatted\":{\"value\":\"1\"},\"boundingPolys\":[{\"vertices\":[{\"x\":362.0,\"y\":506.0},{\"x\":374.0,\"y\":506.0},{\"x\":374.0,\"y\":520.0},{\"x\":362.0,\"y\":520.0}]}]},\"price\":{\"price\":{\"text\":\"5,280\",\"formatted\":{\"value\":\"5280\"},\"boundingPolys\":[{\"vertices\":[{\"x\":413.0,\"y\":504.0},{\"x\":464.0,\"y\":504.0},{\"x\":464.0,\"y\":522.0},{\"x\":413.0,\"y\":522.0}]}]},\"unitPrice\":{\"text\":\"5,280\",\"formatted\":{\"value\":\"5280\"},\"boundingPolys\":[{\"vertices\":[{\"x\":290.0,\"y\":506.0},{\"x\":340.0,\"y\":506.0},{\"x\":340.0,\"y\":523.0},{\"x\":290.0,\"y\":523.0}]}]}}},{\"name\":{\"text\":\"이마트 초코썸76g\",\"formatted\":{\"value\":\"이마트 초코썸76g\"},\"boundingPolys\":[{\"vertices\":[{\"x\":96.0,\"y\":531.0},{\"x\":156.0,\"y\":530.0},{\"x\":156.0,\"y\":558.0},{\"x\":97.0,\"y\":559.0}]},{\"vertices\":[{\"x\":157.0,\"y\":531.0},{\"x\":245.0,\"y\":526.0},{\"x\":246.0,\"y\":550.0},{\"x\":159.0,\"y\":555.0}]}],\"maskingPolys\":[]},\"count\":{\"text\":\"1\",\"formatted\":{\"value\":\"1\"},\"boundingPolys\":[{\"vertices\":[{\"x\":364.0,\"y\":527.0},{\"x\":375.0,\"y\":527.0},{\"x\":375.0,\"y\":542.0},{\"x\":364.0,\"y\":542.0}]}]},\"price\":{\"price\":{\"text\":\"1,080\",\"formatted\":{\"value\":\"1080\"},\"boundingPolys\":[{\"vertices\":[{\"x\":416.0,\"y\":525.0},{\"x\":466.0,\"y\":525.0},{\"x\":466.0,\"y\":543.0},{\"x\":416.0,\"y\":543.0}]}]},\"unitPrice\":{\"text\":\"1,080\",\"formatted\":{\"value\":\"1080\"},\"boundingPolys\":[{\"vertices\":[{\"x\":291.0,\"y\":526.0},{\"x\":341.0,\"y\":526.0},{\"x\":341.0,\"y\":545.0},{\"x\":291.0,\"y\":545.0}]}]}}},{\"name\":{\"text\":\"정통바게트\",\"formatted\":{\"value\":\"정통바게트\"},\"boundingPolys\":[{\"vertices\":[{\"x\":96.0,\"y\":549.0},{\"x\":192.0,\"y\":550.0},{\"x\":192.0,\"y\":576.0},{\"x\":96.0,\"y\":575.0}]}],\"maskingPolys\":[]},\"count\":{\"text\":\"1\",\"formatted\":{\"value\":\"1\"},\"boundingPolys\":[{\"vertices\":[{\"x\":366.0,\"y\":550.0},{\"x\":374.0,\"y\":550.0},{\"x\":374.0,\"y\":562.0},{\"x\":366.0,\"y\":562.0}]}]},\"price\":{\"price\":{\"text\":\"2,400\",\"formatted\":{\"value\":\"2400\"},\"boundingPolys\":[{\"vertices\":[{\"x\":415.0,\"y\":545.0},{\"x\":468.0,\"y\":546.0},{\"x\":467.0,\"y\":566.0},{\"x\":414.0,\"y\":564.0}]}]},\"unitPrice\":{\"text\":\"2,400\",\"formatted\":{\"value\":\"2400\"},\"boundingPolys\":[{\"vertices\":[{\"x\":290.0,\"y\":548.0},{\"x\":341.0,\"y\":548.0},{\"x\":341.0,\"y\":566.0},{\"x\":290.0,\"y\":566.0}]}]}}}]}],\"totalPrice\":{\"price\":{\"text\":\"137,670\",\"formatted\":{\"value\":\"137670\"},\"boundingPolys\":[{\"vertices\":[{\"x\":403.0,\"y\":657.0},{\"x\":474.0,\"y\":658.0},{\"x\":474.0,\"y\":676.0},{\"x\":403.0,\"y\":676.0}]}]}}}},\"uid\":\"f58a8676454f40e5afc9e1489425f532\",\"name\":\"image\",\"inferResult\":\"SUCCESS\",\"message\":\"SUCCESS\",\"validationResult\":{\"result\":\"NO_REQUESTED\"}}]}";

//        실제 api 사용
        String result = clovaOcrUtil.getOcr(multipartFile);

        JSONParser parser = new JSONParser();
        JSONObject json = (JSONObject) parser.parse(result);

        // 필요한 내용 경로 따라가기
        JSONArray imagesJson = (JSONArray) json.get("images");
        JSONObject imagesJson0 = (JSONObject) imagesJson.get(0);
        JSONObject receiptJson = (JSONObject) imagesJson0.get("receipt");
        JSONObject resultJson = (JSONObject) receiptJson.get("result");
        JSONArray subResultJson = (JSONArray) resultJson.get("subResults");
        JSONObject subResultJson0 = (JSONObject) subResultJson.get(0);
        JSONArray itemsJson = (JSONArray) subResultJson0.get("items");  // items도착
        // arr에 RecItemRes 쌓아서 반환
        ArrayList<ReceiptItemRes> arr = new ArrayList<>();
        for (int i=0; i<itemsJson.size(); i++) {
            JSONObject itemJson = (JSONObject) itemsJson.get(i);
            JSONObject nameJson = (JSONObject) itemJson.get("name");
            String name = (String) nameJson.get("text");
            arr.add(new ReceiptItemRes(name));
        }

        return arr;
    }

}