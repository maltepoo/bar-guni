# Refresh Token

## Refresh Token 적용

![Untitled](README_Refresh%20Token.assets/Untitled.png)

### FrontEnd Token Request Code

```jsx
// 토큰 발급 요청 ( 위 그림의 1번)
const data = await login(SocialType.KAKAO, res.access_token);
// 토큰 저장 (위 그림의 4번을 하기위한 저장)
await EncryptedStorage.setItem('refreshToken', data.refreshToken);
await EncryptedStorage.setItem('accessToken', data.accessToken);
```

### FrontEnd Token Filter Code

```jsx
// 위 그림의 11 ~ 13 처리 과정
function LoginApiInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: Config.API_URL,
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  instance.interceptors.response.use(
    response => response,
    async error => {
      if (error.response.data.code === 'J003') { // 토큰 만료시 오는 에러 코드(J003)
        const request = {...error.request};
        const refreshToken = await EncryptedStorage.getItem('refreshToken');
        const token = await EncryptedStorage.getItem('accessToken');
        const config: any = {
          baseURL: request.responseURL,
          method: request._method,
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
            REFRESH: `Bearer ${refreshToken}` as string | undefined, // refreshToken과 함께 토큰 요청
          },
          data: error.config.data,
        };
        const res = await instance.request(config); // 토큰 갱신 요청
        delete config.headers.REFRESH;
        config.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
        await EncryptedStorage.setItem(
          'accessToken',
          res.data.data.accessToken,
        );
        await EncryptedStorage.setItem(
          'refreshToken',
          res.data.data.refreshToken,
        ); // 재발급 받은 accessToken , refreshToken Storage에 저장
        setJwtToken(res.data.data.accessToken);
        return await instance.request(config); // access 토큰을 바꾼 상태로 다시 요청
      }

      return Promise.reject(error);
    },
  );

  return instance;
}
```

## Back Server Code

### Access Token & Refress Token Issuance

```java
/**
 * 로그인 시 JWT Token 을 발행해주는 코드
*/
@PostMapping("/login")
public ResponseEntity<ResVO<TokenRes>> login(@RequestParam String email) {
    ResVO<TokenRes> result = new ResVO<>();
    HttpStatus status = null;

    // 위 그림의 2 번 처리 과정
    Boolean duplicated = userService.isDuplicated(email);
    if(!duplicated) {
        result.setMessage("회원이 아닙니다.");
        status = HttpStatus.NOT_ACCEPTABLE;
        return new ResponseEntity<ResVO<TokenRes>>(result, status);
    }

    User user = userService.findByEmail(email);
		// 위 그림의 3 번 처리 과정
    String accessToken = JwtTokenUtil.getToken(user.getId().toString(), TokenType.ACCESS);
    String refreshToken = JwtTokenUtil.getToken(user.getId().toString(), TokenType.REFRESH);

    TokenRes tokenRes = new TokenRes(accessToken, refreshToken);
    result.setData(tokenRes);
    result.setMessage("성공");
    status = HttpStatus.OK;

    return new ResponseEntity<ResVO<TokenRes>>(result, status);
}
```

### Token Validation Check & Access Token Reissuance

```java
/**
 * AccessToken 유무와
 * AccessToken, RefreshToken 유효성 검증하는 코드
 * 만약 AccessToken 이 만료되었다면 재발급하도록 요청을 Fowarding 한다.
*/
@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
        String header = request.getHeader(JwtTokenUtil.HEADER_STRING);

        if (header == null || !header.startsWith(JwtTokenUtil.TOKEN_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }
        
        try {
						// 위 그림의 6 번 처리 과정
            Authentication authentication = getAuthentication(request);
            SecurityContextHolder.getContext().setAuthentication(authentication);
        
				}catch (TokenExpiredException tokenExpiredException){
            String refresh = request.getHeader("REFRESH");
						
						// 위 그림의 8 처리 과정
            if (refresh == null || !refresh.startsWith(JwtTokenUtil.TOKEN_PREFIX)) {
                request.setAttribute("data", new ErrorResVO(JWT_ACCESS_TOKEN_EXPIRED));
                request.getRequestDispatcher("/error/jwt").forward(request,response);
                return;
            }

						// 위 그림의 13 처리 과정
            try{ 
                JWTVerifier verifier = JwtTokenUtil.getVerifier();
                JwtTokenUtil.handleError(refresh);
                DecodedJWT decodedJWT = verifier.verify(refresh.replace(JwtTokenUtil.TOKEN_PREFIX, ""));
                String userId = decodedJWT.getSubject();
                request.setAttribute("userId", userId);
                request.getRequestDispatcher("/error/refresh").forward(request,response);

            } catch (TokenExpiredException tokenExpiredException2){
                request.setAttribute("data", new ErrorResVO(JWT_REFRESH_TOKEN_EXPIRED));
                request.getRequestDispatcher("/error/jwt").forward(request,response);

            } catch (Exception ex2){
                request.setAttribute("data", new ErrorResVO(JWT_INVALID));
                request.getRequestDispatcher("/error/jwt").forward(request,response);
            }

            return;

        } catch (Exception ex) {
            request.setAttribute("data", new ErrorResVO(JWT_INVALID));
            request.getRequestDispatcher("/error/jwt").forward(request,response);
            return;
        }
        
        filterChain.doFilter(request, response);
	}
```

### 장점

단순히 Access Token만 사용했을 때보다 JWT Token 탈취에 대한 안정성을 높일 수 있습니다.

Refresh Token 유효 기간을 길게 하여 사용자에게 기존과 같은 연결성을 제공하고 
Access Token 유효 기간을 짧게하여 Token 탈취에 대한 안정성을 높일 수 있습니다.

### 단점

구현이 복잡합니다. 프론트엔드, 서버 모두 검증 프로세스가 길고 디버깅하기가 어렵기 때문에 구현이 어렵습니다.

Access Token이 만료될 때마다 새롭게 발급하는 과정에서 생기는 HTTP 요청 횟수가 많습니다. 이는 서버의 자원 낭비로 귀결됩니다.

### 결론

바구니 프로젝트에는  Access Token + Refresh Token 방식을 도입하였습니다. 구현에 시간이 들고 어려웠으나 안정성을 따졌을 때 필요하다 생각합니다.