from flask import Flask, request
import pytesseract
from PIL import Image
from Filter import TrieNode

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = './receipts'

filter_words = ["커피", "우유", "비빔면", "햄버거", "라면", "상추", "술", "포도", "돈까스", "김밥", "어니언", "초코", "사과"]
root = TrieNode()
for word in filter_words:
    root.add(word,0)


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
        while st_idx < len(word) and check == False:
            check = root.search(word, st_idx)
            st_idx += 1

        if(check == False):
            continue

        # 필터 통과하면 결과로 저장
        result_li.append(word)

    return str(result_li)


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)
