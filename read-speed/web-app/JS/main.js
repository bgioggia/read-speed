////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 *
 *
 *                       MAIN
 *
 *
 */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Returns the element assocaited with an ID
 *
 * @param element is the id of an element
 * @returns {HTMLElement} is the HTML element associated with that ID
 */
function $$(element) {
    return document.getElementById(element)
}

/**
 * If the no button is pressed, remove buttons and prompt user for number of passages
 * they would like to read to test reading speed.
 */
function noButton(){
    const new_question = ('How many passages would you like to read to determine your reading speed?\n' +
        'Each passage should take between 10 and 45 seconds to read.\n' +
        'The more passages you read, the more accurate your measured WPM will be.')

    var q = $$('question')
    q.innerText = new_question;

    //Remove yes and no buttons
    $$('yes').remove();
    $$('no').remove();

    //Create input box
    var text_num = makeSelectionRange('1', '5');

    //Create confirm button
    var confirm = makeConfirmButton()

    q.after(text_num);
    text_num.after(confirm);
}

/**
 * Takes the number of passages requested, and queues up that many to be read by the
 * user.
 */
function confirmNumberOfPassages(){
    let selection = $$('selection').value;
    let passages = generate_passages(selection);
    console.log(passages);
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 *
 *
 *                       SCRAPER
 *
 *
 */
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
    var text_num = document.createElement('input');
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
    var confirm = document.createElement('button');
    confirm.setAttribute('id', 'confirm_button')
    confirm.setAttribute('onclick', 'confirmNumberOfPassages()')
    confirm.innerText = "Confirm";
    return confirm
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

    passages.sort(() => 0.5 - Math.random());
    return passages.slice(0, num_passages);
}




