package com.ssafy.barguni.api.user;

import com.ssafy.barguni.api.user.vo.UserPostReq;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;

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

    public User modifyUser(Long userId, UserPostReq userReq ) throws Exception{
        return userRepository.modifyUser(userId, userReq.getName());
    }

    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }

//    public Optional<User> updateUser(Long userId) throws Exception{
//        Optional<User> user = userRepository.findById(userId);
//
//        return user;
//    }
}
