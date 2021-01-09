import time


story = ('\nIt was the best of times, it was the worst of times, it was the age of wisdom, \n'
          'it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, \n'
          'it was the season of Light, it was the season of Darkness, it was the spring of hope, \n'
          'it was the winter of despair, we had everything before us, we had nothing before us, \n'
          'we were all going direct to Heaven, we were all going direct the other way—in short, \n'
          'the period was so far like the present period, that some of its noisiest authorities \n'
          'insisted on its being received, for good or for evil, in the superlative degree of comparison only.\n')
word_count = len(story.split(' '))

# void -> float
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
    wps = word_count/seconds_to_read

    # converts to words/min
    wpm = wps * 60

    return wpm




if __name__ == '__main__':
    print('your reading speed is ' + str(getReadSpeed()) + ' words per minute.')
