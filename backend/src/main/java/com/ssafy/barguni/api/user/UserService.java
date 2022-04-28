package com.ssafy.barguni.api.user;

import com.ssafy.barguni.api.user.vo.UserPostReq;
import com.ssafy.barguni.common.util.GoogleOauthUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final HttpServletResponse response;

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).get();
    }

    public User findById(Long id){
        return userRepository.findById(id).get();
    }

    public Boolean isDuplicated(String email){
        return userRepository.existsByEmail(email);
    }

    public User oauthSignup(String email, String name) {
        User user = new User(email, name);
        userRepository.save(user);
        return user;
    }

    public User modifyUser(Long userId, String newName ) {
        System.out.println("~~~~ : " + newName);
        return userRepository.modifyUser(userId, newName);
    }

    public Optional<User> changeUser(Long userId, String newName ){
        User user = userRepository.findById(userId).get();

        if(newName != null){
            user.setName(newName);
        }

        return Optional.ofNullable(user);
    }

    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

}
