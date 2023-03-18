
// imports
import bot from './assets/AI.png'
import user from './assets/f-user.png'
// imports

// variables
const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')
let menu = document.querySelector('#menu-btn')
let header = document.querySelector('.header')
let reset = document.querySelector('.reset')
let resetbtn = document.querySelector('.reset-btn')
let themeToggle = document.querySelector('#theme-toggler')
let del = document.querySelector('#starter')
let speachbtn = document.querySelector('#click_to_convert');
let convert_text = document.querySelector('#convert_text')
// variables

// speech recognition
speachbtn.addEventListener('click', () => 
{
    var speech = true;
    window.SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;

    recognition.addEventListener('result', (e) => {
        const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)

        convert_text.innerHTML = transcript;
        
    })

    if(speech == true) 
    {
        recognition.start();
    }
})
// speech recognition

// responsive hamburger menu 
menu.addEventListener('click', () => {
    menu.classList.toggle('fa-times')
    header.classList.toggle('active')
})
// responsive hamburger menu 

// theme change 
themeToggle.addEventListener('click', () => {
    themeToggle.classList.toggle('fa-sun')
    themeToggle.classList.toggle('fa-moon')
    if(themeToggle.classList.contains('fa-sun')) 
    {
        document.body.classList.add('active')
    }
    else 
    {
        document.body.classList.remove('active')
    }
})
// theme change 


// loading while ai comes up with an answer
let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '█';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '██') {
            element.textContent = '';
        }
    }, 300);
}
// loading while ai comes up with an answer


// makes ai write letter by letter
function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, .5)
}// necessary for typing text effect for that specific reply
// makes ai write letter by letter


// generate unique ID for each message div of bot
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}


const handleSubmit = async (e) => {
    e.preventDefault()

    const data = new FormData(form)
    

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))
    

    // to clear the textarea input 
    form.reset()
    

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    chatContainer.scrollTop = chatContainer.scrollHeight
    del.innerHTML = '';

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = ""
    loader(messageDiv)

    const response = await fetch('http://localhost:5000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval)
    messageDiv.innerHTML = " "

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

        typeText(messageDiv, parsedData)
    } else {
        const err = await response.text()

        messageDiv.innerHTML = `<p class="errorMessage">Oops! Something doesn't seem right here. Either your prompt is too long or your internet connection is the issue. Try prompting shorter texts or checking your internet connection!</p>`
    }
}

reset.addEventListener('click', () => {
    chatContainer.innerHTML = ''
})

resetbtn.addEventListener('click', () => {
    chatContainer.innerHTML = ''
})

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})

// https://ai-cohort.onrender.com