package com.ssafy.barguni.common.util.barcodeSearch.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class BarcodeDataFromI2570Res {
    @JsonProperty("I2570")
    private BarcodeData barcodeData;

    @Data
    public class BarcodeData {
        @JsonProperty("total_count")
        private Long TotalCount;
        private List<ProductFromI2570Data> row;
        @JsonProperty("RESULT")
        private DataResult result;

        @Data
        public class DataResult {
            @JsonProperty("MSG")
            private String msg;
            @JsonProperty("CODE")
            private String code;
        }
    }
}
