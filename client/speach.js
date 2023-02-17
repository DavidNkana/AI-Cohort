let speachbtn = document.querySelector('#click_to_convert');
let convert_text = document.querySelector('#convert_text')
const form = document.querySelector('form')
const scroll_down = document.querySelector('#scroll-down')

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
        form.reset();
        
    })

    if(speech == true) 
    {
        recognition.start();
    }
})


