package com.ssafy.barguni.api.user.vo;

import com.ssafy.barguni.api.user.User;
import lombok.Data;

@Data
public class GoogleProfile {
    public String id;
    public String email;
    public Boolean verified_email;
    public String name;
    public String given_name;
    public String family_name;
    public String picture;
    public String locale;
}
