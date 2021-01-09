import time
import passages


#story = ()
#word_count = len(story.split(' '))

# void -> wpm: float
def getReadSpeed():
    print('Please click the button when you are ready to start reading.\n'
          'Click the button again when you have finished.')
    print(input())  # rudimentary halting for now
    print(story)
    start_time = time.time()
    print(input())  # rudimentary halting for now
    end_time = time.time()
    seconds_to_read = end_time - start_time

    # find words/sec
    print(word_count)
    wps = word_count/seconds_to_read

    # converts to words/min
    wpm = wps * 60

    return wpm




if __name__ == '__main__':
    psgs = passages.Passages()
    test_string = psgs.get_passages(1)
    print(test_string[0][1])

    #print('your reading speed is ' + str(getReadSpeed()) + ' words per minute.')
