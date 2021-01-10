import urllib
import requests
from requests.exceptions import HTTPError
from bs4 import BeautifulSoup


"""
url:string -> html_body:soup
"""
def get_htmll(url):

    try:
        r = requests.get(url)
        r.raise_for_status()
    except HTTPError:
        return ''

    u = urllib.request.urlopen(url)
    html_body = BeautifulSoup(u, 'html.parser')

    return html_body


def filter_size(size:int):
    return

"""
html_body:soup -> article:string
"""
def find_article_body(html_body):
    ps = html_body.findAll('p')
    txt = []
    for p in ps:
        txt.append(p.text)
    biggest_text = max(txt, key=len)  # get biggest block of text
    filtered_txt = filter(lambda x: len(x) > (len(biggest_text)//10), txt)  # remove anything smaller than 10% of biggest text
    article = ' '.join(str(block) for block in filtered_txt)
    return article


