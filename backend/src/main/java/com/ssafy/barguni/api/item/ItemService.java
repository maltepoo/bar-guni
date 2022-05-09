package com.ssafy.barguni.api.item;

import com.ssafy.barguni.api.Picture.Picture;
import com.ssafy.barguni.api.Picture.PictureService;
import com.ssafy.barguni.api.basket.entity.Basket;
import com.ssafy.barguni.api.basket.entity.Categories;
import com.ssafy.barguni.api.basket.service.BasketService;
import com.ssafy.barguni.api.basket.service.CategoryService;
import com.ssafy.barguni.api.error.ErrorCode;
import com.ssafy.barguni.api.error.ErrorResVO;
import com.ssafy.barguni.api.error.Exception.BasketException;
import com.ssafy.barguni.api.item.vo.ItemSearch;
import com.ssafy.barguni.api.item.vo.ItemPostReq;
import com.ssafy.barguni.api.user.User;
import com.ssafy.barguni.api.user.UserBasketService;
import com.ssafy.barguni.api.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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

//        Basket bkt = basketRepository.findById(req.getBkt_id()).get();
//        Picture pic = pictureRepository.findById(req.getPic_id()).get();
//        Categories cate = categoriesRepository.findById(req.getCate_id()).get();
        Basket bkt = new Basket();
        Picture pic = new Picture();
        Categories cate = new Categories();

        if (req.getBktId() != null) {
            item.setBasket(bkt);
        }
        if (req.getPicId() != null) {
            item.setPicture(pic);
        }
        if (req.getCateId() != null) {
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
        itemRepository.deleteById(id);
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

    public Integer deleteUsedItemInBasket(Long bktId) {
        return itemRepository.deleteItemsByBasket_IdAndUsed(bktId, true);
    }

    public List<Item> findAllUsed(){
        return itemRepository.getItemsByUsed(true);
    }

    public void deleteItem(Item item) {
        itemRepository.delete(item);
    }
}