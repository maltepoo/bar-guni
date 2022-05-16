from flask import Flask, request
import pytesseract
from PIL import Image
from Filter import TrieNode
from Filter import get_filter_word_set
import cv2
import imutils
import time
import numpy
# from demo.ctw1500_detection import detect
from demo.text_detection import detect



app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = './receipts'

# filter_words = ["커피", "우유", "비빔면", "햄버거", "라면", "상추", "술", "포도", "돈까스", "김밥", "어니언", "초코", "사과", "카페", "치킨", "돈까스"]
filter_word_set = get_filter_word_set()
root = TrieNode()
for word in filter_word_set:
    root.add(word,0)
    root.add(word[::-1],0)


@app.route('/',methods=['POST'])
def barcode():  # put application's code here
    # 파라미터로 multipart 파일이 없을 경우
    if request.method == 'POST':
        if 'receipt' not in request.files:
            return 'File is missing', 404

    receipt = request.files['receipt']
    # ocr 처리
    result = pytesseract.image_to_string(Image.open(receipt), lang='kor')
    # 단어 빈칸으로 구분
    words = result.split()

    result_li = []
    for word in words:
        # word = ''.join(filter(str.isalnum, word)) # 숫자만
        word = ''.join(filter(str.isalpha, word))   # 언어만

        # 필터 처리
        st_idx = 0
        check = False
        # 정순으로 검사
        while st_idx < len(word) and check == False:
            check = root.search(word, st_idx)
            st_idx += 1

        # 역순으로 검사
        r_word = word[::-1]
        while st_idx < len(r_word) and check == False:
            check = root.search(r_word, st_idx)

        if(check == False):
            continue

        # 필터 통과하면 결과로 저장
        result_li.append(word)

    return str(result_li)


@app.route('/crop',methods=['POST'])
def crop():  # put application's code here
    # 파라미터로 multipart 파일이 없을 경우
    if request.method == 'POST':
        if 'receipt' not in request.files:
            return 'File is missing', 404



    receipt = request.files['receipt']
    image = numpy.array(Image.open(receipt))[...,:3]


    boxes = detect(image)

    start_time = time.time()

    result_li = []

    for index in range(len(boxes)):
        x0, y0, x1, y1 = boxes[index]
        x0 = int(x0) + 1
        y0 = int(y0) + 1
        x1 = int(x1) + 1
        y1 = int(y1) + 1

        w = x1 - x0
        h = y1 - y0
        cropped_img = image[y0:y0 + h, x0:x0 + w]

        img = imutils.resize(cropped_img, int(image.shape[1] * 2))
        # blur = cv2.GaussianBlur(img, (3, 3), 0)
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # ocr 처리
        result = pytesseract.image_to_string(gray, lang='kor')

        print(result)
        print("-----------------")

        # 단어 빈칸으로 구분
        words = result.split('\n')

        for word in words:
            # word = ''.join(filter(str.isalnum, word)) # 숫자만
            word = ''.join(filter(str.isalpha, word))   # 언어만

            # 필터 처리
            st_idx = 0
            check = False
            while st_idx < len(word) and check == False:
                check = root.search(word, st_idx)
                st_idx += 1

            # 역순으로 검사
            r_word = word[::-1]
            while st_idx < len(r_word) and check == False:
                check = root.search(r_word, st_idx)

            if(check == False):
                continue

            # 필터 통과하면 결과로 저장
            result_li.append(word)

    print("OCR Time: {:.2f} s / img".format(time.time() - start_time))

    return str(result_li)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)
