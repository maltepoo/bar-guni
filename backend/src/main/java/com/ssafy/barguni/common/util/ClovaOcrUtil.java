package com.ssafy.barguni.common.util;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.http.HttpClient;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import lombok.RequiredArgsConstructor;

//
//import org.json.JSONArray;
//import org.json.JSONObject;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;


import org.json.JSONArray;
import org.json.JSONObject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
@RequiredArgsConstructor
public class ClovaOcrUtil {

    private static String apiURL;
    private static String secretKey;
    private static String uploadFolder;

    @Value("${images.path}")
    public void setUploadFolder(String path){
        uploadFolder = path;
    }

    @Value("${ocr.clova.url}")
    public void setApiURL(String url){
        apiURL = url;
    }

    @Value("${ocr.clova.key}")
    public void setSecretKey(String key) {secretKey = key;}


    public String getOcrByClova(MultipartFile multipartFile) {
        try {
            URL url = new URL(apiURL);
            HttpURLConnection con = (HttpURLConnection)url.openConnection();
            con.setUseCaches(false);
            con.setDoInput(true);
            con.setDoOutput(true);
            con.setRequestMethod("POST");

//            멀티파트 요청으로 보낼 때 필요한 것들
//            con.setReadTimeout(30000);
//            String boundary = "----" + UUID.randomUUID().toString().replaceAll("-", "");
//            con.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);
            // 헤더 세팅(json요청으로 보낼 때)
            con.setRequestProperty("X-OCR-SECRET", secretKey);
            con.setRequestProperty("Content-Type", "application/json; charset=utf-8");

            //전체 json만들기
            JSONObject json = new JSONObject();
            json.put("version", "V2");
            json.put("requestId", UUID.randomUUID().toString());
            json.put("timestamp", System.currentTimeMillis());
//            json.put("timestamp", 0);
            JSONObject image = new JSONObject();
            image.put("format", FilenameUtils.getExtension(multipartFile.getOriginalFilename()));
            image.put("name", multipartFile.getName());

            // multipartfile을 그냥 파일로 변환
            String pathName = uploadFolder + multipartFile.getOriginalFilename();
            File tmp = new File(pathName);
            tmp.createNewFile();
            FileOutputStream fos = new FileOutputStream(tmp);
            fos.write(multipartFile.getBytes());
            fos.close();

//          그냥 파일을 base64로 변환하여 json에 넣기
            byte[] fileContent = FileUtils.readFileToByteArray(tmp);
            String encodedFile = Base64.getEncoder().encodeToString(fileContent);
            image.put("data", encodedFile);

            JSONArray images = new JSONArray();
            images.put(image);
            json.put("images", images);

            String postParams = json.toString();

            DataOutputStream wr = new DataOutputStream(con.getOutputStream());
            wr.writeBytes(postParams);
            wr.flush();
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
            String result = response.toString();
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("ocr 실패");
            return null;
        }
    }

    public String getOcrByFlask(MultipartFile multipartFile) throws IOException {
        try {
            Map<String, String> headers = new HashMap<>();
            HttpPostMultipart multipart = new HttpPostMultipart("https://k6b202.p.ssafy.io:5000/", "utf-8", headers);

            // multipartfile을 그냥 파일로 변환
            String pathName = uploadFolder + multipartFile.getOriginalFilename();
            File tmp = new File(pathName);
            tmp.createNewFile();
            FileOutputStream fos = new FileOutputStream(tmp);
            fos.write(multipartFile.getBytes());
            fos.close();

            multipart.addFilePart("receipt", tmp);
            String response = multipart.finish();
            return response;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

}
