import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';

export const ExamPage = (props) => {
  let { id } = useParams();

  let currentid = id;

  const currentQuestion = props.aptitudeData.find(item => item.id === currentid) || {};

  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading,setLoading] = useState(false);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleNextClick = async(event) => {
    event.preventDefault(); // Prevent form submission

    if(props.aptitudeData.length === 1) {
      alert("No more questions left, click on submit to get your score!");
      return;
    }

    const newAptitudeData = props.aptitudeData.filter(item => item.id !== currentid)
    props.setAptitudeData(newAptitudeData);
    props.onNextClick(currentid, selectedOption);

    setSelectedOption(null);
    document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
    
    
    
    navigate(`/exam1/${newAptitudeData[0].id}`);
  };


  const handleSubmitClick = async(event) => {
    event.preventDefault(); // Prevent form submission
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem('user'))
    console.log(props.responses)
    const res = await fetch('http://localhost:5000/updateScores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({data:props.responses,user:{ability:userData?.score || 0}}),
    }).then(response => response.json())
    const update = await fetch('http://localhost:4000/api/updateHistory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({score: res.user_ability, userId : userData.id}),
    }).then(response => response.json())

    console.log(update,'update')
    res.history = update.history

    console.log(res)
    localStorage.setItem('user', JSON.stringify({...userData, score: res.user_ability, history: res.history}))
    navigate(`/result`);
  };


  if (!currentQuestion) {
    navigate(`/result`);
    // return <div>Loading question...</div>;
  }


  return (
    <div>
      <section className="vh-100 section-bg" style={{ backgroundColor: "#eee" }}>
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card text-black" style={{ borderRadius: "25px" }}>
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-10 order-2 order-lg-1">

                      <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Test</p>

                      <form className="mx-1 mx-md-4" method="" action="" id="questionForm" onSubmit={e => e.preventDefault()}>

                        <div>
                          <p>Q. {currentQuestion.metadata.question}</p>
                        </div>
                        <input type="radio" id="a" name="options" value={currentQuestion.metadata.choices[0]} onChange={handleOptionChange} />
                        <label htmlFor="a">{currentQuestion.metadata.choices[0]}</label><br />
                        <input type="radio" id="b" name="options" value={currentQuestion.metadata.choices[1]} onChange={handleOptionChange} />
                        <label htmlFor="b">{currentQuestion.metadata.choices[1]}</label><br />
                        <input type="radio" id="c" name="options" value={currentQuestion.metadata.choices[2]} onChange={handleOptionChange} />
                        <label htmlFor="c">{currentQuestion.metadata.choices[2]}</label><br />
                        <input type="radio" id="d" name="options" value={currentQuestion.metadata.choices[3]} onChange={handleOptionChange} />
                        <label htmlFor="d">{currentQuestion.metadata.choices[3]}</label><br /><br />
                        <div className="d-flex justify-content-center">
                          <button type="submit" className="btn btn-primary btn-lg" id="nextButton" name="form_button" onClick={handleNextClick}>Next</button>
                        </div>

                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <a href="/result"><button type="submit" className="btn btn-danger btn-lg" name="submit_button" onClick={handleSubmitClick}>{loading?'Loading':'Submit'}</button></a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
