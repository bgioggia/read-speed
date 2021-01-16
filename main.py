import os
import time
import passages
import scraper
from flask import Flask, render_template, jsonify

"""
words:str -> word_count:int
"""
def getWordCount(words: str):
    word_count = len(words.split(' '))
    return word_count

# void -> wpm: float
def getReadSpeed(words: str):
    word_count = getWordCount(words)
    print('Please press enter when you are ready to start reading.\n'
          'Press enter again when you have finished.')

    #print('Please click the button when you are ready to start reading.\n'
    #      'Click the button again when you have finished.')

    input()  # rudimentary halting for now
    print(words)
    start_time = time.time()
    input() # rudimentary halting for now

    end_time = time.time()
    seconds_to_read = end_time - start_time

    # find words/sec
    wps = word_count/seconds_to_read
    # converts to words/min
    wpm = wps * 60

    return wpm

def get_avg_wpm_through_terminal():
    answer = ''
    avg_wpm = 0

    while(answer != 'y' and answer != 'n'):
        print('Do you know your reading speed? (y/n)')
        answer = input().lower()

    if answer == 'y':
        print('Please enter your reading speed in wpm.')
        avg_wpm = float(input())
    elif answer == 'n':
        print('How many passages would you like to read to determine your reading speed?\n'
              'Each passage should take between 10 and 45 seconds to read.\n'
              'The more passages you read, the more accurate your measured WPM will be.')
        num_passages = 0
        while num_passages == 0:
            try:
                num_passages = int(input())
            except ValueError:
                print('Enter a number of passages between 1 and 3')

        psgs = passages.Passages()
        read_strings = psgs.get_passages(num_passages)
        wpms = []
        for psg in read_strings:
            wpms.append(getReadSpeed(psg))

        avg_wpm = sum(wpms) / len(wpms)

    # rounds the wpm to one decimal place
    print('Your reading speed is ' + str(round(avg_wpm, 1)) + ' words per minute.')
    return avg_wpm

"""
void -> article:string
"""
def get_article_through_terminal():
    print('Please enter the link to the article you would like to read.')
    url = input()
    html_body = scraper.get_htmll(url)
    article = scraper.find_article_body(html_body)
    return article
"""
article:str, wpm:float -> time_to_read:str
"""
def determine_time_to_read(article, wpm):
    word_count = getWordCount(article)
    print(word_count)
    mins = word_count // wpm
    secs = (word_count - (mins * wpm)) / (wpm / 60)

    return str(int(mins)) + ' minutes and ' + str(int(secs)) + ' seconds.'


app = Flask (__name__)

@app.route('/')
def render_read_speed():
    return render_template('read-speed.html')

@app.route('/_get_read_time/', methods=['POST'])
def _get_read_time():
    html_body = scraper.get_htmll("https://www.reuters.com/article/us-tesla-safety/u-s-asks-tesla-to-recall-158000-vehicles-for-touchscreen-failures-idUSKBN29I35K?utm_source=reddit.com")
    article = scraper.find_article_body(html_body)
    ret_string = determine_time_to_read(article, 233)
    #response = jsonify({'data: '+ ret_string})
    response = jsonify(data=ret_string)
    response.status_code = 200
    return response
    #return make_response(jsonify({'data: '+ ret_string}), 200)

if __name__ == '__main__':
    app.run(debug=True)






