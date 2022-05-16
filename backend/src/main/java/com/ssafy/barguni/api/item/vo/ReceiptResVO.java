package com.ssafy.barguni.api.item.vo;

import com.ssafy.barguni.api.common.ResVO;
import lombok.Data;

import java.util.List;

@Data
public class ReceiptResVO extends ResVO {
    private int Length;
    private List<ReceiptItemRes> data;

    public ReceiptResVO(List<ReceiptItemRes> data) {
        this.Length = data.size();
        this.data = data;
    }

}
