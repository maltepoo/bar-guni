package com.ssafy.barguni.api.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>, CustomUserRepository {
    Optional<User> findByEmail(String email);
    Optional<User> findById(Long id);
    Boolean existsByEmail(String email);

    @Modifying
    @Query("UPDATE User u SET u.name = :name WHERE u.id = :id")
    User modifyUser(Long id, String name);

    void deleteById(Long id);
}
