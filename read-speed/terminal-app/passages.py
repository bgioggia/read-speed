import random


class Passages:

    # passages is a list of (passage: string)
    def __init__(self):
        self.passages = self.generate_passages()

    """
    num_passages:int -> ret_passages: list[(word_count: int, passage: string)]
    """
    def get_passages(self, num_passages: int):
        pass_copy = self.passages.copy()
        ret_passages = []
        for i in range(num_passages):
            random.shuffle(pass_copy)
            ret_passages.append(pass_copy.pop())
        return ret_passages

    """
     void -> passages: list[(word_count: int, passage: string)]
     hard coded for now but will make this prettier eventually
    """
    def generate_passages(self):
        passages = [('\nIt was the best of times, it was the worst of times, it was the age of wisdom, \n'
              'it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, \n'
              'it was the season of Light, it was the season of Darkness, it was the spring of hope, \n'
              'it was the winter of despair, we had everything before us, we had nothing before us, \n'
              'we were all going direct to Heaven, we were all going direct the other way—in short, \n'
              'the period was so far like the present period, that some of its noisiest authorities \n'
              'insisted on its being received, for good or for evil, in the superlative degree of comparison only.\n'),
            ("\nAccording to all known laws of aviation, there is no way a bee should be able to fly. "
             "\nIts wings are too small to get its fat little body off the ground. "
             "\nThe bee, of course, flies anyway because bees don't care what humans think is impossible. "
             "\nYellow, black. Yellow, black. \nYellow, black. Yellow, black. \nOoh, black and yellow. "
             "\nLet's shake it up a little. Barry! Breakfast is ready! \nComing! Hang on a second. "
             "\nHello? \n- Barry? \n- Adam? \n- Can you believe this is happening? "
             "\n- I can't. I'll pick you up. \nLooking sharp. Use the stairs. "
             "Your father paid good money for those. \nSorry. I'm excited. \nHere's the graduate. "
             "\nWe're very proud of you, son. A perfect report card, all B's. \nVery proud.\n"),
            ('\nI AM SAM. I AM SAM. SAM I AM. '
              '\nTHAT SAM-I-AM! THAT SAM-I-AM! '
              '\nI DO NOT LIKE THAT SAM-I-AM! '
              '\nDO WOULD YOU LIKE GREEN EGGS AND HAM? '
              '\nI DO NOT LIKE THEM,SAM-I-AM. '
              '\nI DO NOT LIKE GREEN EGGS AND HAM. '
              '\nWOULD YOU LIKE THEM HERE OR THERE? '
              '\nI WOULD NOT LIKE THEM HERE OR THERE. '
              '\nI WOULD NOT LIKE THEM ANYWHERE. '
              '\nI DO NOT LIKE GREEN EGGS AND HAM. '
              '\nI DO NOT LIKE THEM, SAM-I-AM.\n'),]
        return passages


