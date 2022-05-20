package com.ssafy.barguni.api.item;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
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
    private final BooleanExpression alwaysTrue = Expressions.asBoolean(true).isTrue();

    public CustomItemRepositoryImpl(EntityManager em){
        this.em = em;
        this.query = new JPAQueryFactory(em);
    }

    public List<Item> getAllInBasket(Long basketId, Boolean used){
        return query
                .select(item)
                .from(item)
                .leftJoin(item.category, categories)
                .fetchJoin()
                .leftJoin(item.picture, picture)
                .fetchJoin()
                .where(basketCheck(basketId))
                .where(usedCheck(used))
                .fetch();
    }

    public List<Item> getMyAllItems(List<Long> basketIds, Boolean used){
        return query
                .select(item)
                .from(item)
                .leftJoin(item.category, categories)
                .fetchJoin()
                .leftJoin(item.picture, picture)
                .fetchJoin()
                .where(basketCheckIn(basketIds))
                .where(usedCheck(used))
                .fetch();
    }

    public List<Item> getItemsUsingFilter(ItemSearch itemSearch){
        return query
                .select(item)
                .from(item)
                .leftJoin(item.category, categories)
                .fetchJoin()
                .where(nameLike(itemSearch.getWord()).or(contentLike(itemSearch.getWord())).or(categoryLike(itemSearch.getWord())))
                .where(basketCheckIn(itemSearch.getBasketIds()))
                .where(usedCheck(itemSearch.getUsed()))
                .fetch();
    }

    private BooleanExpression usedCheck(Boolean used){
        if(used == null)
            return null;
        else
            return item.used.eq(used);
    }

    private BooleanExpression basketCheck(Long basketId){
        if(basketId == null)
            return null;
        else
            return item.basket.id.eq(basketId);
    }

    private BooleanExpression basketCheckIn(List<Long> ids) {
        if(ids == null)
            return null;
        else
            return item.basket.id.in(ids);
    }

    private BooleanExpression categoryLike(String category) {
        if(!StringUtils.hasText(category)){
            return alwaysTrue;
        }
        return item.category.name.like("%" + category + "%");
    }

    private BooleanExpression nameLike(String name) {
        if(!StringUtils.hasText(name)){
            return alwaysTrue;
        }
        return item.name.like("%"+name+"%");
    }

    private BooleanExpression contentLike(String content) {
        if(!StringUtils.hasText(content)){
            return alwaysTrue;
        }
        return item.content.like("%" + content + "%");
    }
}
