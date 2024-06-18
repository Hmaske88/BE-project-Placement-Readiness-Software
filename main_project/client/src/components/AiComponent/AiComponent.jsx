import React, { useEffect, useState } from 'react'

const AiComponent = (props) => {

    const [user, setUser] = useState()
    const [questions, setQuestions] = useState()
    const [topic,setTopic] = useState()
    const [interviewee,setInterviewee] = useState(false)
    const [otherUser, setOtherUser] = useState(null);

    useEffect(()=>{
        if(!localStorage.getItem('user')){
            setInterviewee(false);
            return;
        }
        setInterviewee(true);
        const userData = JSON.parse(localStorage.getItem('user')) || {}
        setUser(userData)

        
    },[])

    const handleGenerate = (e) => {
      e.preventDefault()
        fetch('http://localhost:5000/getQuestions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                topic: topic,
                summary: props.remoteSummary
            }),
          }).then(response => response.json()).then(data => {console.log(data);setQuestions(data.questions)}).catch(err => console.log(err))
    }

  return (
    <>
    {interviewee&&(<div style={{color:'white'}}>
    {user && (
        <>
            {/* <p>Id : {props.remoteSocketId? props.remoteSocketId:"not found"}</p> */}
            <p>Email Id : {props.remoteEmailId? props.remoteEmailId:"not found"}</p>
            <p>User Name: {props.remoteName || 'Name not found'}</p>
            <p>User Summary: {props.remoteSummary || 'Summary not found'}</p>
            <p>User Role: {props.remoteRole}</p>
        </>
    )}
        {props.remoteRole === 'Interviewee' && (<>
        
            <h4>Enter a topic : </h4>
        <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{
                padding: '10px',
                width: '300px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                marginBottom: '10px',
                fontSize: '16px',
                transition: 'border-color 0.3s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#007bff'}
            onBlur={(e) => e.target.style.borderColor = '#ccc'}
        />
        <button
            onClick={handleGenerate}
            style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
            >
            Generate
        </button>
        <div className="questions">
            {questions && questions.map((question,index) => {
                return <div key={index}>
                    <p>Question: {question.question}</p>
                    <p>Answer: {question.answer}</p>
                    <br></br>
                </div>
            })}
        </div>
        </>)}
    </div>)}
    </>
  )
}

export default AiComponent
