package com.ssafy.barguni.common.auth;

//import com.ssafy.api.service.UserService;
//import com.ssafy.db.entity.User;
import com.ssafy.barguni.api.user.User;
import com.ssafy.barguni.api.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;


/**
 * 현재 액세스 토큰으로 부터 인증된 유저의 상세정보(활성화 여부, 만료, 롤 등) 관련 서비스 정의.
 */
@Component
public class AccountUserDetailService implements UserDetailsService{
	@Autowired
	UserService userService;
	
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		//실제로는 username이 아니고 email이지만 UsernameNotFoundException과 맞추기 위해 여기서만 username으로 사용
		User user = userService.findByEmail(username);
		if(user != null) {
    			AccountUserDetails accountDetails = new AccountUserDetails(user);
    			return accountDetails;
    		}
		return null;
    }
}
