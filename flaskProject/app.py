
from flask import Flask
import pytesseract
from PIL import Image



app = Flask(__name__)


@app.route('/')
def barcode():  # put application's code here
    result1 = pytesseract.image_to_string(Image.open('./static/img_4.png'), lang='kor')
    print(result1)
    # # print(pytesseract.image_to_string(Image.open('./static/img_1.png'), lang='kor_vert'))
    # result1 = pytesseract.image_to_string(Image.open('./static/ljh_best.png'), lang='kor')

    return result1

@app.route('/reciept')
def rec():  # put application's code here


    return 'receipt'

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)





