////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 *
 *
 *                       MAIN
 *
 *
 */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let global_passages = [];
let global_passage_pointer = 0;
let global_timestamp = 0;
let global_wpms = [];
let global_wpm = 0;

/**
 * Returns the element assocaited with an ID
 *
 * @param element is the id of an element
 * @returns {HTMLElement} is the HTML element associated with that ID
 */
function $$(element) {
    return document.getElementById(element);
}

/**
 * If the yes button is pressed, remove buttons and prompt user for their reading speed in WPM
 */
function yesButton(){

    let q = $$('question')
    q.innerText = 'Please enter your reading speed in words per minute.';

    //Remove yes and no buttons
    $$('yes').remove();
    $$('no').remove();

    //Create input box
    let text_num = makeSelectionRange('1', '1000');

    //Create confirm button
    let confirm = makeEnterButton();

    q.after(text_num);
    text_num.after(confirm);


}

/**
 * if the the enter button has been pressed,
 */
function handleEnterButtonPressed(){

    let wpm = $$('selection').value
    if (wpm < 1) {
        wpm = 1
    }
    if (wpm > 10000) {
        wpm = 9999
    }
    $$('selection').remove()
    $$('enter_button').remove()
    handleCalculateWPM(wpm)
}


/**
 * If the no button is pressed, remove buttons and prompt user for number of passages
 * they would like to read to test reading speed.
 */
function noButton(){
    const new_question = ('How many passages would you like to read to determine your reading speed?\n' +
        'Each passage should take between 10 and 45 seconds to read.\n' +
        'The more passages you read, the more accurate your measured WPM will be.')

    let q = $$('question')
    q.innerText = new_question;

    //Remove yes and no buttons
    $$('yes').remove();
    $$('no').remove();

    //Create input box
    let text_num = makeSelectionRange('1', '5');

    //Create confirm button
    let confirm = makeConfirmButton();

    q.after(text_num);
    text_num.after(confirm);
}

/**
 * Takes the number of passages requested, and queues up that many to be read by the
 * user.
 */
function confirmNumberOfPassages(){
    let selection = $$('selection').value;
    global_passages = shuffle(generate_passages(selection));

    const new_question = ('Passage #' + (global_passage_pointer + 1) + ':\n' +
        'Please press the "Start Reading" button when you are ready to start reading.\n' +
        'Press the button again when you have finished.')

    let q = $$('question')
    q.innerText = new_question;

    //Remove confirm button and selection range.
    $$('confirm_button').remove();
    $$('selection').remove();

    let stb = makeStartReadingButton()
    q.after(stb);
}

/**
 * handles the start reading button being pressed
 */
function handleStartReading() {
    let q = $$('question')
    q.innerText = global_passages[global_passage_pointer];

    $$('start_reading_button').remove();

    let stb = makeStopReadingButton();
    q.after(stb);
    global_passage_pointer += 1;
    global_timestamp = new Date();
}

/**
 * handles all passages being read, and calculate WPM
 */
function handleCalculateWPM(wpm) {
    global_wpm = wpm;
    let q = $$('question')
    q.innerText = 'Your average reading speed is ' + (parseFloat(wpm)).toFixed(1) + ' words per minute.\n' +
        'Would you like to know the time it will take you to read an article that you have the link to, ' +
        'or would you rather paste your text directly?';
    let lnk_button = makeLinkButton();
    let pst_button = makePasteButton();

    q.after(lnk_button);
    lnk_button.after(pst_button);
}


/**
 * handles the done reading button being pressed
 */
function handleDoneReading() {
    let local_timestamp = new Date();
    let q = $$('question')

    $$('stop_reading_button').remove();

    let milliseconds_to_read = local_timestamp - global_timestamp;
    console.log(milliseconds_to_read);

    let word_count = getWordCount(q.innerText);
    let wps = word_count / (milliseconds_to_read / 1000)
    let wpm = wps * 60;
    console.log(wpm)

    global_wpms.push(wpm);

    // if not end of list
    if(global_passage_pointer < global_passages.length) {
        q.innerText = ('Passage #' + (global_passage_pointer + 1) + ':\n' +
            'Please press the "Start Reading" button when you are ready to start reading.\n' +
            'Press the button again when you have finished.')
        let stb = makeStartReadingButton();
        q.after(stb);
    }
    else {
        const avg = calculateAverage(global_wpms)
        handleCalculateWPM(avg)
    }
}

/**
 * When the Paste button is pressed, creates a textbot and sets the page up for a
 * block of text to be pasted.
 */
function handlePasteButtonPressed() {
    let q = $$('question');
    q.innerText = 'Your average reading speed is ' + (parseFloat(global_wpm)).toFixed(1) +
        ' words per minute.\nPaste the text you would like to read below and press calculate.\n' +
        'If you also have a link, press the corresponding button to enter it.'
    $$('link_button').remove();
    $$('paste_button').remove();
    let paste_box = makePasteBox();
    let calculate_button = makeCalculatePastedButton();
    let link_button = makeLinkButton();
    q.after(paste_box);
    paste_box.after(calculate_button);
    calculate_button.after(link_button)
}

/**
 * When link button is pressed, creates an input for link to be entered.
 */
function handleLinkButtonPressed(){
    $(function() {
        $('a#link_button_wrapper').on('click', function(e) {
            e.preventDefault()
            $.post('/_get_read_time/',
                function(data) {
                    console.log(data)
                });
            return false;
        });
    });
}

/**
 * Handles calculation of read speed when button is pressed for
 * text in textbox.
 */
function handleCalculatePastedButtonPressed() {
    let text_box = $$('paste_box');
    let q = $$('question');
    let time_to_read = calculateTimeToRead(text_box.value, global_wpm);

    if($$('time_to_read') != null){
        $$('time_to_read').remove()
    }

    let ttr = document.createElement('h1')
    ttr.setAttribute('id', 'time_to_read')
    ttr.innerText = 'The pasted text will take you ' + time_to_read + ' to read.'

    q.after(ttr)
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 *
 *
 *                       PASSAGES
 *
 *
 */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Gets the number of words separated by spaces in a list.
 *
 * @param words is a string of words separated by spaces
 * @returns {number} of words separated by spaces in a string
 */
function getWordCount(words) {
    return words.split(' ').length
}

/**
 * Calculates the time to read an article given a wpm speed. Assumes all words
 * are separated by spaces. Returns time to read embedded in a string.
 *
 * @param article is a string of words separated by spaces.
 * @param wpm is float representing the reading speed.
 * @returns {string} containing minutes and seconds to read.
 */
function calculateTimeToRead(article, wpm) {
    let word_count = getWordCount(article);
    let wps = wpm / 60;
    let total_seconds = word_count / wps;
    console.log(total_seconds);
    let secs = total_seconds % 60;
    let mins = (total_seconds - secs) / 60;
    return (mins + ' minutes and ' + secs.toFixed(1)+ ' seconds')
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 *
 *
 *                       SCRAPER
 *
 *
 */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


$(function() {
    $('a#link_button_wrapper').on('click', function(e) {
        e.preventDefault()
        $.post('/_get_read_time/',
            function(data) {
                //do nothing
            });
        return false;
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 *
 *
 *                       CONSTRUCTORS
 *
 *
 */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * creates a text input that accepts numbers between {mn} and {mx}
 * @param mn the minimum number
 * @param mx the maximum number
 * @returns {HTMLInputElement}
 */
function makeSelectionRange(mn, mx){
    let text_num = document.createElement('input');
    text_num.setAttribute('id', 'selection')
    text_num.setAttribute('type', 'number')
    text_num.setAttribute('min', '1')
    text_num.setAttribute('max', '5')
    return text_num
}

/**
 * creates a confirmation button
 *
 * @returns {HTMLButtonElement}
 */
function makeConfirmButton(){
    let confirm = document.createElement('button');
    confirm.setAttribute('id', 'confirm_button')
    confirm.setAttribute('onclick', 'confirmNumberOfPassages()')
    confirm.innerText = "Confirm";
    return confirm
}

/**
 * creates an enter button to be used for entering WPM
 * @returns {HTMLButtonElement}
 */
function makeEnterButton(){
    let enter = document.createElement('button');
    enter.setAttribute('id', 'enter_button')
    enter.setAttribute('onclick', 'handleEnterButtonPressed()')
    enter.innerText = "Enter";
    return enter
}


/**
 *  creates a start reading button
 *
 * @returns {HTMLButtonElement}
 */
function makeStartReadingButton(){
    let confirm = document.createElement('button');
    confirm.setAttribute('id', 'start_reading_button')
    confirm.setAttribute('onclick', 'handleStartReading()')
    confirm.innerText = "Start Reading";
    return confirm
}


/**
 * makes a stop reading button
 *
 * @returns {HTMLButtonElement}
 */
function makeStopReadingButton(){
    let confirm = document.createElement('button');
    confirm.setAttribute('id', 'stop_reading_button')
    confirm.setAttribute('onclick', 'handleDoneReading()')
    confirm.innerText = "Finished Reading";
    return confirm
}

/**
 * make a link button
 *
 * @returns {HTMLButtonElement}
 */
function makeLinkButton(){
    let anch = document.createElement('a')
    anch.setAttribute('href', '#');
    anch.setAttribute('id', 'link_button_wrapper')

    let lnk = document.createElement('button');
    lnk.setAttribute('id', 'link_button')
    lnk.setAttribute('onclick', 'handleLinkButtonPressed()')
    lnk.innerText = "I have a link.";
    anch.appendChild(lnk);
    return anch
}

/**
 * make a paste button
 *
 * @returns {HTMLButtonElement}
 */
function makePasteButton(){
    let pst = document.createElement('button');
    pst.setAttribute('id', 'paste_button')
    pst.setAttribute('onclick', 'handlePasteButtonPressed()')
    pst.innerText = "I will paste my text.";
    return pst
}

/**
 * make a text box for article to be pasted in
 *
 * @returns {HTMLTextAreaElement}
 */
function makePasteBox(){
    let pst = document.createElement('textarea');
    pst.setAttribute('id', 'paste_box')
    //pst.innerText = "I will paste my text.";
    return pst
}

/**
 * make calculate pasted text button.
 *
 * @returns {HTMLButtonElement}
 */
function makeCalculatePastedButton() {
    let calc = document.createElement('button');
    calc.setAttribute('id', 'calculate_pasted_button');
    calc.setAttribute('onclick', 'handleCalculatePastedButtonPressed()');
    calc.innerText = "Calculate";
    return calc;
}

/**
 * Populates a list of passages short passages then returns a random set of them of size {num_passages}
 *
 * @param num_passages is the number of passages to be returned
 * @returns {string[]} of passages
 */
function generate_passages(num_passages) {
    let passages = [('\nIt was the best of times, it was the worst of times, it was the age of wisdom, \n' +
        'it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, \n' +
        'it was the season of Light, it was the season of Darkness, it was the spring of hope, \n' +
        'it was the winter of despair, we had everything before us, we had nothing before us, \n' +
        'we were all going direct to Heaven, we were all going direct the other way—in short, \n' +
        'the period was so far like the present period, that some of its noisiest authorities \n' +
        'insisted on its being received, for good or for evil, in the superlative degree of comparison only.\n'),
    ("\nAccording to all known laws of aviation, there is no way a bee should be able to fly. " +
    "\nIts wings are too small to get its fat little body off the ground. " +
    "\nThe bee, of course, flies anyway because bees don't care what humans think is impossible. " +
    "\nYellow, black. Yellow, black. \nYellow, black. Yellow, black. \nOoh, black and yellow. " +
    "\nLet's shake it up a little. Barry! Breakfast is ready! \nComing! Hang on a second. " +
    "\nHello? \n- Barry? \n- Adam? \n- Can you believe this is happening? " +
    "\n- I can't. I'll pick you up. \nLooking sharp. Use the stairs. " +
    "Your father paid good money for those. \nSorry. I'm excited. \nHere's the graduate. " +
    "\nWe're very proud of you, son. A perfect report card, all B's. \nVery proud.\n"),
    ('\nI AM SAM. I AM SAM. SAM I AM. ' +
    '\nTHAT SAM-I-AM! THAT SAM-I-AM! ' +
    '\nI DO NOT LIKE THAT SAM-I-AM! ' +
    '\nDO WOULD YOU LIKE GREEN EGGS AND HAM? ' +
    '\nI DO NOT LIKE THEM,SAM-I-AM. ' +
    '\nI DO NOT LIKE GREEN EGGS AND HAM. ' +
    '\nWOULD YOU LIKE THEM HERE OR THERE? ' +
    '\nI WOULD NOT LIKE THEM HERE OR THERE. ' +
    '\nI WOULD NOT LIKE THEM ANYWHERE. ' +
    '\nI DO NOT LIKE GREEN EGGS AND HAM. ' +
    '\nI DO NOT LIKE THEM, SAM-I-AM.\n'),]

    let lst = shuffle(passages)

    return lst.slice(0, num_passages);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 *
 *
 *                       UTIL
 *
 *
 */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Fisher-Yates shuffle from https://github.com/coolaj86/knuth-shuffle
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
 * Calculates average in an array of number values
 *
 * @param array of numbers
 * @returns {number} average of all numbers in {array}
 */
function calculateAverage(array){
    let sum = 0
    for(let i = 0; i < array.length; i++) {
        sum += array[i];
    }

    return sum / array.length
}


