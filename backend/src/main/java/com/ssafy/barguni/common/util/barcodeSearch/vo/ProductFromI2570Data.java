package com.ssafy.barguni.common.util.barcodeSearch.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProductFromI2570Data {
    // 바코드 번호
    @JsonProperty("BRCD_NO")
    private String brcdNo;
    // 품목보고번호
    @JsonProperty("PRDLST_REPORT_NO")
    private String prdlstReportNo;
    // 회사명
    @JsonProperty("CMPNY_NM")
    private String cmpnyNm;
    // 제품명
    @JsonProperty("PRDT_NM")
    private String prdtNm;
    // 최종수정일시
    @JsonProperty("LAST_UPDT_DTM")
    private String lastUpdtDtm;
    // 품목분류 소분류
    @JsonProperty("PRDLST_NM")
    private String prdlstNm;
    // 품목분류 중분류
    @JsonProperty("HRNK_PRDLST_NM")
    private String hrnkPrdlstNm;
    // 품목분류 대분류
    @JsonProperty("HTRK_PRDLST_NM")
    private String htrkPrdlstNm;
}