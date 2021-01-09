import time
import passages


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




if __name__ == '__main__':
    answer = ''
    avg_wpm = 0

    while(answer != 'y' and answer != 'n'):
        print('Do you know your reading speed? (y/n)')
        answer = input().lower()
        print(answer)

    if answer == 'y':
        print('please enter your reading speed in wpm.')
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
                print('enter a number of passages between 1 and 3')

        psgs = passages.Passages()
        read_strings = psgs.get_passages(num_passages)
        wpms = []
        for psg in read_strings:
            wpms.append(getReadSpeed(psg))

        avg_wpm = sum(wpms) / len(wpms)

        # rounds the wpm to one decimal place
        print('your reading speed is ' + str(round(avg_wpm, 1)) + ' words per minute.')


