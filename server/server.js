import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Server ran successfully'
  })
})

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({ //This line initiates the creation of a completion using OpenAI. 
      model: "text-davinci-003", //This specifies which OpenAI model to use (in this case, text-davinci-003). 
      prompt: `${prompt}`, //This specifies what you are prompting the compleation with. 
      temperature: 1, //This sets the risk level when generating a response to the prompt (higher values mean more risk). 
      max_tokens: 3990, //This sets the maximum number of tokens for the completed response (most models have a context length of 2048 tokens).  
      top_p: 1, //This is an alternate method to sampling with temperature and is called nucleus sampling. 
      frequency_penalty: .5, //This penalizes new tokens based on their existing frequency in the text so far, decreasing its likelihood to repeat the same line verbatim. 
      presence_penalty: .5, //This penalizes new tokens based on whether they appear in the text so far, increasing its likelihood to talk about new topics. 
      }); 

    res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

app.listen(5000, () => console.log('AI server started on http://localhost:5000'))