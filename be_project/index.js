const express = require('express');
const { default: OpenAI } = require("openai");
const { Pinecone } = require("@pinecone-database/pinecone");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { PineconeStore } = require("@langchain/pinecone");
const dotenv = require('dotenv');
const cors = require('cors');
const { RecursiveCharacterTextSplitter, TextSplitter } = require("langchain/text_splitter");

dotenv.config();
const app = express();
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.post('/updateQuestion/:id', async(req, res) => {
    const {id} = req.params
    const {updatedStats} = req.body

    try {
        const pinecone = new Pinecone({
            // environment: "gcp-starter",
            apiKey: process.env.PINECONE_API_KEY,
        })

        const index = pinecone.Index("demo")

        await index.namespace('be_project').update({
            id,
            metadata: {text:updatedStats}
        })

        res.send('question updated')

    } catch (error) {
        console.log(error)
        res.status(500).send('Internal server error')
    }

})

const userAbility = (diff, isCorrect, userLevel, maxValue)=> {
    let lr = 0.5;
    let impact;
    const oldUserLevel = userLevel

    if (isCorrect === 0) {
        impact = -(diff * (1 - lr));
    } else {
        impact = diff * (1 + lr);
    }

    maxValue += diff * (1 + lr);
    userLevel += impact;
    userLevel = userLevel<0?oldUserLevel:userLevel

    return {userLevel, maxValue};
}

const calculateDifficulty = (correctResponse, incorrectResponses, averageTime, timeTaken, response)=>{
    const difficultyRange = 100;
    const referenceTime = 120;
    const weightTime = 0.1;

    console.log(correctResponse, incorrectResponses, averageTime, timeTaken, response)

    if (response === 0) {
        incorrectResponses+=1;
    } else {
        correctResponse+=1;
    }

    console.log(incorrectResponses,correctResponse)

    const total = correctResponse + incorrectResponses;
    averageTime = (averageTime * (total - 1) + timeTaken) / total;
    const accuracyScore = incorrectResponses / total;
    const baseDifficulty = accuracyScore * difficultyRange;
    const normalizedTime = averageTime / referenceTime;
    const timePenalty = Math.pow(normalizedTime, weightTime);

    // console.log(total,averageTime,accuracyScore,baseDifficulty,normalizedTime,timePenalty)

    // You can choose one of the following ways to calculate time penalty:
    // const timePenalty = Math.pow(1 - normalizedTime, weightTime);
    // const timePenalty = Math.pow(1 - normalizedTime, weightTime / (1 + accuracyScore));

    const adjustedDifficulty = baseDifficulty * timePenalty;
    // console.log(adjustedDifficulty)
    
    return {difficulty:adjustedDifficulty, averageTime, correctResponse, incorrectResponses};
}

app.post('/updateScores', async(req, res) => {
    try {
        const {data,user}= req.body

        const ids = data.map(update => update.id)

        const pinecone = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        })

        const index = pinecone.Index("demo")

        const results = await index.namespace('be_project').fetch(ids)

        let questions = [];

        for(let i=0;i<ids.length;i+=1){
            questions.push(results.records[ids[i]])
        }

        let maxValue = user.ability
        let user_ability = 0;
        let impact;

        for(let i = 0; i < questions.length; i++) {
            let lr = 0.5;

            if (data[i].response === 0) {
                impact = -(questions[i].metadata.difficulty * (1 - lr));
            } else {
                impact = questions[i].metadata.difficulty * (1 + lr);
            }

            maxValue += questions[i].metadata.difficulty * (1 + lr);
        }

        
        user_ability += impact;

        user_ability = (user_ability+user.ability)/(maxValue+user.ability);
        user_ability = user_ability*100
        
        user_ability = user_ability<0?0:user_ability

        const updatedValues = data.map((update,index) => {
            const que = questions[index]
            Calculatedupdate= calculateDifficulty( que.metadata.correctResponse, que.metadata.incorrectResponses, que.metadata.averageTime, update.timeTaken, update.response)
            return{
                id:update.id,
                metadata:{...update.metadata,...Calculatedupdate}
            }
        })

        console.log(updatedValues)
        console.log(user_ability)

        for(let i=0;i<updatedValues.length;i+=1){
            await index.namespace('be_project').update(
                {
                    id:updatedValues[i].id,
                    metadata:{...questions[i].metadata,...updatedValues[i].metadata}
                }
            )
        }

        res.status(200).json({updatedValues,user_ability})

    } catch (error) {
        console.log(error)
        res.status(500).send('Internal server error')
    }
})

const randomizeTopics = () => {
    const p1 = ["DBMS","Computer Networks"]
    const p2 = ["DSA","Object Oriented Programming"]

    return [p1[Math.floor(Math.random() * p1.length)],p2[Math.floor(Math.random() * p2.length)]]
}
const randomAbility = () => {
    return Math.min(50, Math.floor(Math.random() * 21) + 30);
  }
app.post('/fetchQuestions', async (req, res) => {
    try {
        const pinecone = new Pinecone({
            // environment: "gcp-st"
            apiKey: process.env.PINECONE_API_KEY,
        });
        const openai = new OpenAI(process.env.OPEN_AI_API_KEY);
        const embeddings = new OpenAIEmbeddings({ apiKey: process.env.OPEN_AI_API_KEY });

        // Assuming userAbility is a number representing the user's ability score
        const userAbility = parseInt(req.query.userAbility) || randomAbility(); // Default to 0 if userAbility is not provided

        console.log(userAbility)

        // Retrieve questions near the user's ability score
        console.log(req.body.topics)
        const index = pinecone.Index("demo");
        const questions = await index.namespace('be_project').query(
            {
                vector: await embeddings.embedQuery(JSON.stringify(randomizeTopics())),
                filter:{"difficulty":{"$gt":userAbility-20,"$lt":userAbility+20}}
                ,
                topK: 10,
                includeMetadata: true
            }
        )

        const updatedQuestions = questions.matches.map(async (question) => {

            const updatedQuestion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                response_format:{"type": "json_object"},
                messages: [
                    {
                        role: "system",
                        content: `you are a bot that paraphrases the given question. you have a question: ${question.metadata.question} return output:{text:<updatedQuestion>} . in json format.`
                    }
                ]
            })

            return {
                id: question.id,
                metadata: { ...question.metadata,question: JSON.parse(updatedQuestion.choices[0].message.content).text },
                score: question.score,
                values: question.values
            }
        })

        const updatedQuestionsData = await Promise.all(updatedQuestions)

        res.status(200).json(updatedQuestionsData)

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
});

app.post('/getQuestions', async(req, res) => {
    try {

        const openai = new OpenAI(process.env.OPEN_AI_API_KEY);
        const {summary,topic} = req.body

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            response_format:{"type": "json_object"},
            messages: [
                {
                    role: "system",
                    content: `you are a interview question generation bot. you use the summary of candidate:${summary} to generate 3 different questions on the topic:${topic}. in json format. 
                    output: {questions:[<question1>,<question2>,<question3>]}
                    `
                }
            ]
        
        })

        res.status(200).json(JSON.parse(response.choices[0].message.content))

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
})


app.listen(5000, () => {
    console.log('api running')
})