package com.ssafy.barguni.common.util.barcodeSearch.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ProductFromC005Data {
    @JsonProperty("CLSBIZ_DT")
    private String clsbizDt;
    @JsonProperty("SITE_ADDR")
    private String siteAddr;
    @JsonProperty("PRDLST_REPORT_NO")
    private String prdlstReportNo;
    @JsonProperty("PRMS_DT")
    private String prmsDt;
    @JsonProperty("BAR_CD")
    private String barCd;
    @JsonProperty("POG_DAYCNT")
    private String pogDaycnt;
    @JsonProperty("PRDLST_DCNM")
    private String prdlstDcnm;
    @JsonProperty("PRDLST_NM")
    private String prdlstNm;
    @JsonProperty("BSSH_NM")
    private String bsshNm;
    @JsonProperty("END_DT")
    private String endDt;
    @JsonProperty("INDUTY_NM")
    private String indutyNm;
}
