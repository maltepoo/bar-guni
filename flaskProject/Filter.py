from flask import Flask

# app = Flask(__name__)
#
# if __name__ == '__main__':
#     app.run()


def get_filter_word_set():
    f = open('static/filtering_words.txt', 'r', encoding='utf-8')
    str = f.readline()
    str = str.replace('/',',')
    str = str.replace("기타",'')
    str = str.split(',')
    fword_set = set(str)
    fword_set.remove('')
    return fword_set

class TrieNode:

    def __init__(self):
        self.child = dict()
        self.is_exists = False

    def add(self, word, idx):
        if len(word) == idx:
            self.is_exists = True
            return
        if self.child.get(word[idx]) == None:
            self.child[word[idx]] = TrieNode()

        self.child[word[idx]].add(word, idx+1)

    def search(self, word, idx):
        if self.is_exists:
            return True
        if len(word) == idx or self.child.get(word[idx]) == None:
            return False
        return self.child[word[idx]].search(word, idx+1)
