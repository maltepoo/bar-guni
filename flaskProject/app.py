import requests
from flask import Flask
import pytesseract
from PIL import Image
import requests

app = Flask(__name__)


@app.route('/')
def barcode():  # put application's code here
    result1 = pytesseract.image_to_string(Image.open('./static/img_2.png'), lang='kor')
    print(result1)
    words = result1.split()
    api_key = "%2FFcYlFOefSczcSw8Ra5SXrup1ENH5ohszaxb%2FA8dF5l9NZIFW3f4faSbqHKRJmxPmU9505mjU1OwIp5mw9EoYQ%3D%3D"
    api_key2 = "/FcYlFOefSczcSw8Ra5SXrup1ENH5ohszaxb/A8dF5l9NZIFW3f4faSbqHKRJmxPmU9505mjU1OwIp5mw9EoYQ=="

    result_li = []

    # words = ["피코크 초마짬뽕 12", "(G)피코크 레이디핑", "무지개 방울토마토9", "델몬트파머스주스2", "서울 저지방우유 1L"]

    for word in words:
        # word = ''.join(filter(str.isalnum, word)) # 숫자만
        word = ''.join(filter(str.isalpha, word))   # 언어만

        #한글만
        # n_word= ''
        # for c in word:
        #     if '가' <= c <= '힣':
        #         n_word+=c
        # word = n_word

        if len(word)<2: continue

        url = "http://apis.data.go.kr/B553748/CertImgListService/getCertImgListService"
        url += "?ServiceKey="+api_key + "&prdlstNm="+word + "&returnType=json"

        res = requests.get(url)
        if res.status_code != 200: continue
        js = res.json()
        print(word)
        if js['totalCount'] != '0':
            # result_li.append(word)
            result_li.append(js)


   # print(pytesseract.image_to_string(Image.open('./static/img_1.png'), lang='kor_vert'))
    # result1 = pytesseract.image_to_string(Image.open('./static/ljh_best.png'), lang='kor')

    # return result1
    return str(result_li)
@app.route('/reciept')
def rec():  # put application's code here


    return 'receipt'

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)
