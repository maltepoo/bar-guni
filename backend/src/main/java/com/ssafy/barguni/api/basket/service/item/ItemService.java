package com.ssafy.barguni.api.basket.service.item;

import com.ssafy.barguni.api.Picture.Picture;
import com.ssafy.barguni.api.basket.entity.Basket;
import com.ssafy.barguni.api.basket.entity.Categories;
import com.ssafy.barguni.api.basket.service.item.vo.ItemPostReq;
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

    public Item saveNewItem(ItemPostReq req) {
//        Basket bkt = basketRepository.findById(req.getBkt_id()).get();
//        Picture pic = pictureRepository.findById(req.getPic_id()).get();
//        Categories cate = categoriesRepository.findById(req.getCate_id()).get();
        Basket bkt = new Basket();
        Picture pic = new Picture();
        Categories cate = new Categories();

        Item item = Item.createItem(bkt, pic, cate, req);
        itemRepository.save(item);

        return item;
    }

    public Item getById(Long id) {
        Optional<Item> optItem = itemRepository.findById(id);
        return optItem.get();
    }

    public List<Item> getListByBktId(Long bktId) {
        return itemRepository.findAllByBasket(bktId);
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
}
