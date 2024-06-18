import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { UserContext } from './contexts/UserContext';
//import styles
import './App.css';
//import pages
import Home from './pages/Home';
import StudyGroups from './pages/StudyGroups';
import Chat from './pages/Chat/Chat';
import Login from './pages/Login/Login';
import Navbar from './components/Navbar/Navbar';
import Register from './pages/Register/Register';
import Profile from './pages/Profile/profile';
import Footer from './components/Footer/Footer';
import ForgetPassword from './pages/ForgetPassword';
import GroupInfo from './pages/GroupInfo';
import VideoCall from './pages/VideoCall/VideoCall';

import { StartPage } from "./MyComponents/StartPage";
import { ExamPage } from "./MyComponents/ExamPage";
import { ResultPage } from "./MyComponents/ResultPage";
import { AnalysisPage } from "./MyComponents/AnalysisPage";
import { Interview } from "./MyComponents/Interview";
import RoomPage from "./screens/Room";

// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import jsonData from './csv_db_10.json';
import Lobby2 from './screens/Lobby2';
import CreateRoom from './pages/CreateRoom/CreateRoom';

// import Mentor from './pages/Mentor';
// import Profile from './pages/Profile';
// import SignIn from './pages/SignIn';
// import SignUp from './pages/SignUp';
// import Projects from './pages/Projects';
// import GroupInfo from './pages/GroupInfo';
// import ForgetPassword from './pages/ForgetPassword';
// import Contact from './pages/Contact';

export const baseUrl = 'http://localhost:4000/api'

function App() {

  // Start for Aptitude Test Code

  const [aptitudeData, setAptitudeData] = useState([]);
  // const [technicalData, setTechnicalData] = useState([]);
  const [submissions_aptiData, setSubmissions_aptiData] = useState([]);
  // const [submissions_techData, setSubmissions_techData] = useState([]);
   const [jsonData, setJsonData] = useState([]);
   const [responses, setResponses] = useState([]);
   const [oldData, setOldData] = useState([]);
   const [time, setTime] = useState(0);
   

  const [user, setUser] = useState()
  const [test,setTest] = useState(0);

  let [marks, setMarks] = useState(0);
  const [loading,setLoading] = useState(true);

  // const fetchData = async () => {
  //   const response = await fetch('http://localhost:5000/fetchQuestions');
  //   const data = await response.json();
  //   console.log(data);
  //   setJsonData(data);
  // }

  const randomAbility = () => {
    return Math.floor(Math.random() * 100);
  }


  useEffect( () => {
    // Check if jsonData contains the expected structure
    // await fetchData();

    const fetchData = async () => {

    // const user = await fetch('http://localhost:4000/api/user/655cc05b0e4ed9adb2376f4b').then(res => res.json()).then(data => console.log(data));
    const userData = await JSON.parse(localStorage.getItem('user')) 
    console.log('userData',userData)
    const response = await fetch(`http://localhost:5000/fetchQuestions?userAbility=${userData?.score || 0 }`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({topic:['DBMS',"DSA","Object Oriented Programming","Computer Networks"]})
    });
    const data = await response.json();
    console.log(data);
    setAptitudeData(data);
    setLoading(false);
  }
  // fetchData();
  }, [test]);

  const onNextClick = (id, selectedOption) => {

    const timeTaken = Math.floor((Date.now() - time) / 1000);
    setTime(Date.now());

    if(selectedOption === null) {
      setResponses([...responses, {id: id, response: 0, timeTaken}]);
      return
    }

    let currentQuestion = aptitudeData.find(item => item.id === id);
    const correctOption = currentQuestion.metadata.answer;
    const formatedOption = selectedOption.split('.')[0];

    

    if (currentQuestion && correctOption === formatedOption) {
      console.log("Correct Answer") ;
      setMarks(marks + 1);
      setResponses([...responses, {id: id, response: 1, timeTaken}]);
    }
    else {
      console.log("wrong")
      setResponses([...responses, {id: id, response: 0, timeTaken}]);
    }
  }



  let percent = (marks / 10) * 100;



  const saveUser = (user, setUser) => {
    localStorage.setItem('user', JSON.stringify(user['data']))
    setUser(JSON.parse(localStorage.getItem('user')))
  }

  const clearUser = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  useEffect(() => {
    if (localStorage.getItem('user'))
     setUser(JSON.parse(localStorage.getItem('user'))) 
    }, [])

  return (
    <div className="App">
      <UserContext.Provider value={{ user, setUser, saveUser, clearUser }}>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/studygroups' element={<StudyGroups />} />
          <Route path='/chat' element={<Chat />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/reset' element={<ForgetPassword />} />
          <Route path='/groupinfo/:id' element={<GroupInfo />} />
          <Route path='/videocall' element={<VideoCall />} />
          <Route path='/aptitude' element={<StartPage aptitudeData={aptitudeData} setTime={setTime} loading={loading} />} />
          <Route path="/exam1/:id" element={<ExamPage aptitudeData={aptitudeData} onNextClick={onNextClick} setAptitudeData={setAptitudeData} responses={responses} setUser={setUser}/> } />
          <Route exact path="/result" element={<ResultPage  marks={marks} percent={percent} aptitudeData={aptitudeData} setTest={setTest} />} />
          <Route exact path="/analyse" element={<AnalysisPage  />} />
          <Route exact path="/interview" element={<Interview/>} />
          <Route path="/room/:roomId" element={<RoomPage />} />
          <Route path="/lobby2" element={<Lobby2 />} />
          <Route path="/createRoom" element={<CreateRoom />} />
          {/* 
          <Route path='/signup' element={<SignUp />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/mentor' element={<Mentor />} />
          <Route path='/groupinfo' element={<GroupInfo />} />
          <Route path='/forgetpassword' element={<ForgetPassword />} />
          <Route path='/projects' element={<Projects />} />
          <Route path='/contact' element={<Contact />} /> */}

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        {/* <Footer /> */}
      </UserContext.Provider>
    </div>
  );
}

export default App;