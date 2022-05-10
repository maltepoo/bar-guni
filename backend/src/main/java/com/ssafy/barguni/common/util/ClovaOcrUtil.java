package com.ssafy.barguni.common.util;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.UUID;

import lombok.RequiredArgsConstructor;
//import org.json.JSONArray;
import org.json.JSONException;
//import org.json.JSONObject;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ClovaOcrUtil {
    @Value("${ocr.clova.url}")
    private String apiURL;
    @Value("${ocr.clova.key}")
    private String secretKey;

    private String imageFile = "img/test1.jpg";

    public void getOcr() {
        try {
            URL url = new URL(apiURL);
            HttpURLConnection con = (HttpURLConnection)url.openConnection();
            con.setUseCaches(false);
            con.setDoInput(true);
            con.setDoOutput(true);
            con.setReadTimeout(30000);
            con.setRequestMethod("POST");
            String boundary = "----" + UUID.randomUUID().toString().replaceAll("-", "");
            con.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);
            con.setRequestProperty("X-OCR-SECRET", secretKey);

            JSONObject json = new JSONObject();
            json.put("version", "V2");
            json.put("requestId", UUID.randomUUID().toString());
            json.put("timestamp", System.currentTimeMillis());
            JSONObject image = new JSONObject();
            image.put("format", "jpg");
            image.put("name", "demo");
            JSONArray images = new JSONArray();
            json.put("images", images);
            String postParams = json.toString();

            con.connect();
            DataOutputStream wr = new DataOutputStream(con.getOutputStream());
            long start = System.currentTimeMillis();
            File file = new File(imageFile);
            writeMultiPart(wr, postParams, file, boundary);
            wr.close();

            int responseCode = con.getResponseCode();
            BufferedReader br;
            if (responseCode == 200) {
                br = new BufferedReader(new InputStreamReader(con.getInputStream()));
            } else {
                br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
            }
            String inputLine;
            StringBuffer response = new StringBuffer();
            while ((inputLine = br.readLine()) != null) {
                response.append(inputLine);
            }
            br.close();

            System.out.println(response);

        } catch (Exception e) {
            System.out.println(e);
        }
    }

    public void ocrTest() throws JSONException {
        String l = "{\"version\":\"V2\",\"requestId\":\"9ab1db54-c4c7-49bb-812c-dcc963be4d32\",\"timestamp\":1652167427997,\"images\":[{\"receipt\":{\"meta\":{\"estimatedLanguage\":\"ko\"},\"result\":{\"storeInfo\":{\"name\":{\"text\":\"(주)킹마트\",\"formatted\":{\"value\":\"(주)킹마트\"},\"boundingPolys\":[{\"vertices\":[{\"x\":129.0,\"y\":146.0},{\"x\":231.0,\"y\":139.0},{\"x\":234.0,\"y\":183.0},{\"x\":132.0,\"y\":190.0}]}],\"maskingPolys\":[]},\"bizNum\":{\"text\":\"286-81-01771\",\"formatted\":{\"value\":\"286-81-01771\"},\"boundingPolys\":[{\"vertices\":[{\"x\":234.0,\"y\":183.0},{\"x\":354.0,\"y\":187.0},{\"x\":354.0,\"y\":208.0},{\"x\":233.0,\"y\":204.0}]}],\"maskingPolys\":[]},\"addresses\":[{\"text\":\"경기 고양시 일산서구 중앙로1391 레이크타운 지하1층\",\"formatted\":{\"value\":\"경기 고양시 일산서구 중앙로1391 레이크타운 지하1층\"},\"boundingPolys\":[{\"vertices\":[{\"x\":133.0,\"y\":249.0},{\"x\":237.0,\"y\":251.0},{\"x\":236.0,\"y\":278.0},{\"x\":133.0,\"y\":276.0}]},{\"vertices\":[{\"x\":235.0,\"y\":229.0},{\"x\":275.0,\"y\":229.0},{\"x\":275.0,\"y\":254.0},{\"x\":235.0,\"y\":254.0}]},{\"vertices\":[{\"x\":243.0,\"y\":251.0},{\"x\":317.0,\"y\":254.0},{\"x\":316.0,\"y\":280.0},{\"x\":242.0,\"y\":277.0}]},{\"vertices\":[{\"x\":282.0,\"y\":231.0},{\"x\":344.0,\"y\":231.0},{\"x\":344.0,\"y\":255.0},{\"x\":282.0,\"y\":255.0}]},{\"vertices\":[{\"x\":351.0,\"y\":230.0},{\"x\":432.0,\"y\":231.0},{\"x\":432.0,\"y\":257.0},{\"x\":350.0,\"y\":255.0}]},{\"vertices\":[{\"x\":438.0,\"y\":232.0},{\"x\":540.0,\"y\":229.0},{\"x\":541.0,\"y\":253.0},{\"x\":439.0,\"y\":257.0}]}],\"maskingPolys\":[]}],\"tel\":[{\"text\":\"031-916-9200\",\"formatted\":{\"value\":\"0319169200\"},\"boundingPolys\":[{\"vertices\":[{\"x\":232.0,\"y\":276.0},{\"x\":357.0,\"y\":279.0},{\"x\":356.0,\"y\":301.0},{\"x\":232.0,\"y\":299.0}]}]}]},\"paymentInfo\":{\"date\":{\"text\":\"20-09-26\",\"formatted\":{\"year\":\"\",\"month\":\"09\",\"day\":\"26\"},\"boundingPolys\":[{\"vertices\":[{\"x\":191.0,\"y\":373.0},{\"x\":279.0,\"y\":375.0},{\"x\":278.0,\"y\":398.0},{\"x\":191.0,\"y\":396.0}]}],\"maskingPolys\":[]},\"time\":{\"text\":\"18: 14\",\"formatted\":{\"hour\":\"18\",\"minute\":\"14\",\"second\":\"00\"},\"boundingPolys\":[{\"vertices\":[{\"x\":283.0,\"y\":375.0},{\"x\":315.0,\"y\":375.0},{\"x\":315.0,\"y\":397.0},{\"x\":283.0,\"y\":397.0}]},{\"vertices\":[{\"x\":313.0,\"y\":373.0},{\"x\":405.0,\"y\":373.0},{\"x\":405.0,\"y\":398.0},{\"x\":313.0,\"y\":398.0}]}]}},\"subResults\":[{\"items\":[{\"name\":{\"text\":\"공주알밤술 750ml\",\"formatted\":{\"value\":\"공주알밤술 750ml\"},\"boundingPolys\":[{\"vertices\":[{\"x\":159.0,\"y\":472.0},{\"x\":267.0,\"y\":472.0},{\"x\":267.0,\"y\":499.0},{\"x\":159.0,\"y\":499.0}]},{\"vertices\":[{\"x\":273.0,\"y\":472.0},{\"x\":327.0,\"y\":472.0},{\"x\":327.0,\"y\":495.0},{\"x\":273.0,\"y\":495.0}]}],\"maskingPolys\":[]},\"code\":{\"text\":\"8809409970097\",\"boundingPolys\":[{\"vertices\":[{\"x\":156.0,\"y\":497.0},{\"x\":300.0,\"y\":496.0},{\"x\":300.0,\"y\":521.0},{\"x\":156.0,\"y\":523.0}]}]},\"count\":{\"text\":\"2\",\"formatted\":{\"value\":\"2\"},\"boundingPolys\":[{\"vertices\":[{\"x\":424.0,\"y\":497.0},{\"x\":441.0,\"y\":497.0},{\"x\":441.0,\"y\":518.0},{\"x\":424.0,\"y\":518.0}]}]},\"price\":{\"price\":{\"text\":\"2,600\",\"formatted\":{\"value\":\"2600\"},\"boundingPolys\":[{\"vertices\":[{\"x\":473.0,\"y\":494.0},{\"x\":534.0,\"y\":494.0},{\"x\":534.0,\"y\":520.0},{\"x\":473.0,\"y\":520.0}]}]},\"unitPrice\":{\"text\":\"1,300\",\"formatted\":{\"value\":\"1300\"},\"boundingPolys\":[{\"vertices\":[{\"x\":324.0,\"y\":496.0},{\"x\":380.0,\"y\":496.0},{\"x\":380.0,\"y\":520.0},{\"x\":324.0,\"y\":520.0}]}]}}},{\"name\":{\"text\":\"웰치소다포도 1.5L\",\"formatted\":{\"value\":\"웰치소다포도 1.5L\"},\"boundingPolys\":[{\"vertices\":[{\"x\":155.0,\"y\":523.0},{\"x\":288.0,\"y\":520.0},{\"x\":289.0,\"y\":549.0},{\"x\":156.0,\"y\":553.0}]},{\"vertices\":[{\"x\":294.0,\"y\":522.0},{\"x\":339.0,\"y\":522.0},{\"x\":339.0,\"y\":546.0},{\"x\":294.0,\"y\":546.0}]}],\"maskingPolys\":[]},\"code\":{\"text\":\"8801043034722\",\"boundingPolys\":[{\"vertices\":[{\"x\":154.0,\"y\":549.0},{\"x\":300.0,\"y\":546.0},{\"x\":300.0,\"y\":572.0},{\"x\":154.0,\"y\":575.0}]}]},\"count\":{\"text\":\"1\",\"formatted\":{\"value\":\"1\"},\"boundingPolys\":[{\"vertices\":[{\"x\":427.0,\"y\":550.0},{\"x\":439.0,\"y\":550.0},{\"x\":439.0,\"y\":565.0},{\"x\":427.0,\"y\":565.0}]}]},\"price\":{\"price\":{\"text\":\"1,980\",\"formatted\":{\"value\":\"1980\"},\"boundingPolys\":[{\"vertices\":[{\"x\":477.0,\"y\":545.0},{\"x\":537.0,\"y\":545.0},{\"x\":537.0,\"y\":572.0},{\"x\":477.0,\"y\":572.0}]}]},\"unitPrice\":{\"text\":\"1,980\",\"formatted\":{\"value\":\"1980\"},\"boundingPolys\":[{\"vertices\":[{\"x\":324.0,\"y\":547.0},{\"x\":381.0,\"y\":547.0},{\"x\":381.0,\"y\":572.0},{\"x\":324.0,\"y\":572.0}]}]}}},{\"name\":{\"text\":\"상추 1봉\",\"formatted\":{\"value\":\"상추 1봉\"},\"boundingPolys\":[{\"vertices\":[{\"x\":153.0,\"y\":574.0},{\"x\":201.0,\"y\":574.0},{\"x\":201.0,\"y\":603.0},{\"x\":153.0,\"y\":603.0}]},{\"vertices\":[{\"x\":207.0,\"y\":574.0},{\"x\":244.0,\"y\":574.0},{\"x\":244.0,\"y\":602.0},{\"x\":207.0,\"y\":602.0}]}],\"maskingPolys\":[]},\"code\":{\"text\":\"22001429\",\"boundingPolys\":[{\"vertices\":[{\"x\":151.0,\"y\":602.0},{\"x\":247.0,\"y\":600.0},{\"x\":247.0,\"y\":626.0},{\"x\":152.0,\"y\":628.0}]}]},\"count\":{\"text\":\"1\",\"formatted\":{\"value\":\"1\"},\"boundingPolys\":[{\"vertices\":[{\"x\":428.0,\"y\":601.0},{\"x\":442.0,\"y\":601.0},{\"x\":442.0,\"y\":619.0},{\"x\":428.0,\"y\":619.0}]}]},\"price\":{\"price\":{\"text\":\"1,980\",\"formatted\":{\"value\":\"1980\"},\"boundingPolys\":[{\"vertices\":[{\"x\":478.0,\"y\":597.0},{\"x\":538.0,\"y\":597.0},{\"x\":538.0,\"y\":624.0},{\"x\":478.0,\"y\":624.0}]}]},\"unitPrice\":{\"text\":\"1,980\",\"formatted\":{\"value\":\"1980\"},\"boundingPolys\":[{\"vertices\":[{\"x\":324.0,\"y\":598.0},{\"x\":382.0,\"y\":598.0},{\"x\":382.0,\"y\":624.0},{\"x\":324.0,\"y\":624.0}]}]}}},{\"name\":{\"text\":\"팔도)비빔면멀티팩 5입\",\"formatted\":{\"value\":\"팔도)비빔면멀티팩 5입\"},\"boundingPolys\":[{\"vertices\":[{\"x\":154.0,\"y\":627.0},{\"x\":338.0,\"y\":625.0},{\"x\":338.0,\"y\":654.0},{\"x\":154.0,\"y\":657.0}]},{\"vertices\":[{\"x\":343.0,\"y\":625.0},{\"x\":381.0,\"y\":625.0},{\"x\":381.0,\"y\":653.0},{\"x\":343.0,\"y\":653.0}]}],\"maskingPolys\":[]},\"code\":{\"text\":\"8801128503051\",\"boundingPolys\":[{\"vertices\":[{\"x\":152.0,\"y\":654.0},{\"x\":297.0,\"y\":652.0},{\"x\":297.0,\"y\":679.0},{\"x\":153.0,\"y\":681.0}]}]},\"count\":{\"text\":\"1\",\"formatted\":{\"value\":\"1\"},\"boundingPolys\":[{\"vertices\":[{\"x\":430.0,\"y\":656.0},{\"x\":442.0,\"y\":656.0},{\"x\":442.0,\"y\":671.0},{\"x\":430.0,\"y\":671.0}]}]},\"price\":{\"price\":{\"text\":\"3,980\",\"formatted\":{\"value\":\"3980\"},\"boundingPolys\":[{\"vertices\":[{\"x\":480.0,\"y\":651.0},{\"x\":542.0,\"y\":650.0},{\"x\":542.0,\"y\":678.0},{\"x\":480.0,\"y\":679.0}]}]},\"unitPrice\":{\"text\":\"3,980\",\"formatted\":{\"value\":\"3980\"},\"boundingPolys\":[{\"vertices\":[{\"x\":322.0,\"y\":651.0},{\"x\":384.0,\"y\":651.0},{\"x\":384.0,\"y\":680.0},{\"x\":322.0,\"y\":680.0}]}]}}}]}],\"totalPrice\":{\"price\":{\"text\":\"10,540\",\"formatted\":{\"value\":\"10540\"},\"boundingPolys\":[{\"vertices\":[{\"x\":412.0,\"y\":788.0},{\"x\":545.0,\"y\":787.0},{\"x\":545.0,\"y\":816.0},{\"x\":412.0,\"y\":817.0}]}]}}}},\"uid\":\"dad7bd608a514cbd97a476e6f4587887\",\"name\":\"demo\",\"inferResult\":\"SUCCESS\",\"message\":\"SUCCESS\",\"validationResult\":{\"result\":\"NO_REQUESTED\"}}]}";

        try {
            JSONParser jsonParser = new JSONParser();
            JSONObject jsonObj = (JSONObject) jsonParser.parse(l);
            JSONArray jsonArray = (JSONArray) jsonObj.get("images");



            for (int i = 0; i < jsonArray.size(); i++){
                JSONObject getObj = (JSONObject) jsonArray.get(i);
                System.out.println("receipt : " + getObj.get("receipt"));
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }

    }

    private void writeMultiPart(OutputStream out, String jsonMessage, File file, String boundary) throws
            IOException {
        StringBuilder sb = new StringBuilder();
        sb.append("--").append(boundary).append("\r\n");
        sb.append("Content-Disposition:form-data; name=\"message\"\r\n\r\n");
        sb.append(jsonMessage);
        sb.append("\r\n");

        out.write(sb.toString().getBytes("UTF-8"));
        out.flush();

        if (file != null && file.isFile()) {
            out.write(("--" + boundary + "\r\n").getBytes("UTF-8"));
            StringBuilder fileString = new StringBuilder();
            fileString
                    .append("Content-Disposition:form-data; name=\"file\"; filename=");
            fileString.append("\"" + file.getName() + "\"\r\n");
            fileString.append("Content-Type: application/octet-stream\r\n\r\n");
            out.write(fileString.toString().getBytes("UTF-8"));
            out.flush();

            try (FileInputStream fis = new FileInputStream(file)) {
                byte[] buffer = new byte[8192];
                int count;
                while ((count = fis.read(buffer)) != -1) {
                    out.write(buffer, 0, count);
                }
                out.write("\r\n".getBytes());
            }

            out.write(("--" + boundary + "--\r\n").getBytes("UTF-8"));
        }
        out.flush();
    }
}
