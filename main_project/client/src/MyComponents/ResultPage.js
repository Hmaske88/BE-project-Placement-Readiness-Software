import React from 'react'
import {useNavigate} from 'react-router-dom';

export const ResultPage = (props) => {

  const navigate = useNavigate();
  
  const handleAnalysisClick = () => {
    props.setTest(new Date().getTime())

    navigate(`/analyse`);
  };

  console.log(JSON.parse(localStorage.getItem('user')))

  return (
    <section className="vh-100 section-bg" style={{ backgroundColor: '#eee' }}>
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" style={{ borderRadius: '25px' }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Result</p>
                    <h5>Marks Obtained : {props.marks}</h5>
                    <br />
                    <h5>Percentage : {props.percent} %</h5>
                    <br />
                    <h5>User Ability : {JSON.parse(localStorage.getItem('user')).score} </h5>
                    <br />
                    <div className="d-flex justify-content-start">
                      <a href="/analyse">
                        <button className="btn btn-primary btn-lg" onClick={handleAnalysisClick}>Analyse</button>
                      </a>
                    </div>
                  </div>
                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                      className="img-fluid"
                      alt="Sample image"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
