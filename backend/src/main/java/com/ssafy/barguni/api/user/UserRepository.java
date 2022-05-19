package com.ssafy.barguni.api.user;

import com.ssafy.barguni.api.basket.entity.Basket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, CustomUserRepository {
    Optional<User> findByEmail(String email);
    Optional<User> findById(Long id);
    Boolean existsByEmail(String email);

    @Query("SELECT u FROM User u left join fetch u.defaultBasket b WHERE u.id = :id")
    User findByIdWithBasket(Long id);

    @Modifying
    @Query("UPDATE User u SET u.name = :name WHERE u.id = :id")
    User modifyUser(Long id, String name);

    void deleteById(Long id);

    @Modifying
    @Query("UPDATE User u SET u.defaultBasket = :defaultBasket WHERE u.id = :userId")
    void modifyDefault(Long userId, Basket defaultBasket);

}
