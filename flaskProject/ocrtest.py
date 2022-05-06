import requests
import uuid
import time
import json

# 읽어온 Json 형식의 결과를 Json 파일로 저장하는 것 까지

api_url = 'https://s742r9t1yc.apigw.ntruss.com/custom/v1/15683/6fd5d03d9f623ad06f5c19e27191c1fa2596c6c69c1a05d239cd6d6f15c0f348/general'
secret_key = 'T29hdUZSZGpZY0NMZllqWElQVlJZR3FFRGdMVE1YRnI='

image_file = 'static/img_2.png'
output_file = 'output/output2.json'

request_json = {
    'images': [
        {
            'format': 'png',
            'name': 'demo'
        }
    ],
    'requestId': str(uuid.uuid4()),
    'version': 'V2',
    'timestamp': int(round(time.time() * 1000))
}

payload = {'message': json.dumps(request_json).encode('UTF-8')}
files = [
  ('file', open(image_file,'rb'))
]
headers = {
  'X-OCR-SECRET': secret_key
}

response = requests.request("POST", api_url, headers=headers, data = payload, files = files)

res = json.loads(response.text.encode('utf8'))
print(res)

with open(output_file, 'w', encoding='utf-8') as outfile:
    json.dump(res, outfile, indent=4, ensure_ascii=False)