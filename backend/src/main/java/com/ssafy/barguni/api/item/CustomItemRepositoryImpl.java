package com.ssafy.barguni.api.item;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.barguni.api.item.vo.ItemSearch;
import org.springframework.stereotype.Repository;
import org.springframework.util.StringUtils;

import javax.persistence.EntityManager;
import java.util.List;

import static com.ssafy.barguni.api.Picture.QPicture.picture;
import static com.ssafy.barguni.api.basket.entity.QCategories.categories;
import static com.ssafy.barguni.api.item.QItem.item;

@Repository
public class CustomItemRepositoryImpl implements CustomItemRepository {
    private final EntityManager em;
    private final JPAQueryFactory query;

    public CustomItemRepositoryImpl(EntityManager em){
        this.em = em;
        this.query = new JPAQueryFactory(em);
    }

    public List<Item> getAllInBasket(Long basketId){
        return query
                .select(item)
                .from(item)
                .leftJoin(item.category, categories)
                .leftJoin(item.picture, picture)
                .where(basketCheck(basketId))
                .fetch();
    }

    public List<Item> getItemsUsingFilter(ItemSearch itemSearch){
        return query
                .select(item)
                .from(item)
                .leftJoin(item.category, categories)
                .where(nameLike(itemSearch.getWord()).or(contentLike(itemSearch.getWord())).or(categoryLike(itemSearch.getWord())))
                .where(basketCheck(itemSearch.getBasketId()))
                .fetch();
    }

    private BooleanExpression basketCheck(Long basketId){
        if(basketId == null)
            return null;
        else
            return item.basket.id.eq(basketId);
    }

    private BooleanExpression categoryLike(String category) {
        if(!StringUtils.hasText(category)){
            return null;
        }
        return item.category.name.like("%" + category + "%");
    }

    private BooleanExpression nameLike(String name) {
        if(!StringUtils.hasText(name)){
            return null;
        }
        return item.name.like("%"+name+"%");
    }

    private BooleanExpression contentLike(String content) {
        if(!StringUtils.hasText(content)){
            return null;
        }
        return item.content.like("%" + content + "%");
    }
}
