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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ItemService {
    private final ItemRepository itemRepository;
    private final UserService userService;
    private final BasketService basketService;
    private final PictureService pictureService;
    private final CategoryService categoryService;
    private final UserBasketService userBasketService;

    public Item saveNewItem(Long userId, ItemPostReq req) {
        if (!userBasketService.existsBybktId(userId, req.getBktId())){
            throw new BasketException(new ErrorResVO(ErrorCode.BASKET_FORBIDDEN));
        }

        Basket bkt = basketService.getBasket(req.getBktId());
        Picture pic = pictureService.getById(req.getPicId());
        Categories cate = categoryService.getById(req.getCateId());

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

    public List<Item> getAllInBasket(Long basketId){
        return itemRepository.getAllInBasket(basketId == -1 ? null : basketId);
    }

    public List<Item> getItemsUsingFilter(ItemSearch itemSearch){
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
}
