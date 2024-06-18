import React from "react";
import { useNavigate } from "react-router-dom";
//import styles
import style from "./a.module.scss";
//import components
import Navbar from "../../components/Navbar/Navbar";
import SubHeading from "../../components/SubHeading/SubHeading.tsx";
//import assets
import gridBackground from "../../assets/Backgrounds/grid-background.svg";
import chooseMentorSectionBackground from "../../assets/Backgrounds/background-pattern-1.svg";
import skillsBackground from "../../assets/Backgrounds/grid-background-filled.svg";
import codeBraces from "../../assets/Illustrations/code-braces.svg";
import futurelearn from "../../assets/Illustrations/futurelearn.svg";
import helpOutline from "../../assets/Illustrations/help-outline.svg";
import symbolsCode from "../../assets/Illustrations/symbols_code.svg";
import chooseMentor from "../../assets/Illustrations/choose-mentor.svg";
import GradientText from "../../components/GradientText/GradientText";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import chooseSkills from "../../assets/Illustrations/choose-skills.svg";
import bulb from "../../assets/Illustrations/yellow-bulb.svg";
import teacher from "../../assets/Illustrations/red-teacher.svg";
import menu from "../../assets/Illustrations/green-menu.svg";
import group from "../../assets/Illustrations/blue-group.svg";
import waveCombination from "../../assets/Illustrations/wave-combination.svg";
import Footer from "../../components/Footer/Footer";


const Home = () => {

	const HeroSection = () => {
		return (
		<div className={style.heroSection} style={{ backgroundImage: `url(${gridBackground})` }}>
			<h1>PLACEMENT READINESS</h1>
			<h1>ASSESSMENT WEBSITE</h1>
			<h1>DEVELUP</h1>
		
			<img src={codeBraces} alt="" style={{top:'8em', bottom:'0', left:'6em'}}></img>
			<img src={futurelearn} alt="" style={{right:'10em', bottom:'6em'}}></img>
			<img src={helpOutline} alt="" style={{top:'8em', right:'6em'}}></img>
			<img src={symbolsCode} alt="" style={{bottom:'3em', left:'10em'}}></img>
		</div>
		);
	};

	const ChooseMentorSection = () => {
		return (
			<div className={style.chooseMentorSection} style={{ backgroundImage: `url(${chooseMentorSectionBackground})` }}>
				<div className={style.subHeading}>
					<SubHeading number="01" title="ADAPTIVE QUESTION GENERATION" rightLine={true} align="left"/>
				</div>
				<div className={style.content}>
					{/* <div className={style.leftContent}> */}
						<h1>GET QUESTIONS <br/> BASED ON YOUR <GradientText title="PLACEMENT READINESS" color1='#4C5EE0' color2='#31B3EC'/></h1>
						{/* <p>Questions generated based on analysis of your Placement Readiness</p> */}
						{/* <div className={style.button} onClick={()=>console.log('Explore button clicked')}> 
							<PrimaryButton title="Explore" arrows={true}/>
						</div> */}
					{/* </div> */}
					{/* <div className={style.rightSideIllustration}>
						<img className={style.illustration} src={chooseMentor} alt="Choose"></img>
					</div> */}
				</div>
			</div>
		)
	}

	const SkillsSection2 = () => {
		return (
			// style={{backgroundImage: `url(${skillsBackground})`}}
			<div className={style.skillsSection} >
				<div className={style.subHeading}>
					<SubHeading number="01" title="ADAPTIVE QUESTION GENERATION" rightLine={true} leftLine={true} align="center"/>
				</div>
				<h1>GET QUESTIONS <br/> BASED ON YOUR <GradientText title="PLACEMENT READINESS" color1='#4C5EE0' color2='#31B3EC'/></h1>
				{/* <div className={style.content}>
					<div className={style.leftContent}>
						<img src={chooseSkills} alt="choose your right skill" className={style.illustration}></img>
					</div>
					<div className={style.rightContent}>
						<div className={style.points}>
							<img src={bulb} alt="bulb"></img>
							<p>Our secondary goal is to build a strong mentoring relationship</p>
						</div>
						<div className={style.points}>
							<img src={teacher} alt="teacher"></img>
							<p>Our secondary goal is to build a strong mentoring relationship</p>
						</div>
						<div className={style.points}>
							<img src={menu} alt="menu"></img>
							<p>Our secondary goal is to build a strong mentoring relationship</p>
						</div>
						<div className={style.points}>
							<img src={group} alt="group"></img>
							<p>Our secondary goal is to build a strong mentoring relationship</p>
						</div>
					</div>
				</div> */}
			</div>
		)
	}

	

	const SkillsSection = () => {
		return (
			// style={{backgroundImage: `url(${skillsBackground})`}}
			<div className={style.skillsSection} >
				<div className={style.subHeading}>
					<SubHeading number="02" title="MOCK INTERVIEWS" rightLine={true} leftLine={true} align="center"/>
				</div>
				<h1>MOCK ONLINE<br/> PEER TO PEER <GradientText title="INTERVIEWS" color1='#8FC7C8' color2='#0A66C2'/></h1>
				{/* <div className={style.content}>
					<div className={style.leftContent}>
						<img src={chooseSkills} alt="choose your right skill" className={style.illustration}></img>
					</div>
					<div className={style.rightContent}>
						<div className={style.points}>
							<img src={bulb} alt="bulb"></img>
							<p>Our secondary goal is to build a strong mentoring relationship</p>
						</div>
						<div className={style.points}>
							<img src={teacher} alt="teacher"></img>
							<p>Our secondary goal is to build a strong mentoring relationship</p>
						</div>
						<div className={style.points}>
							<img src={menu} alt="menu"></img>
							<p>Our secondary goal is to build a strong mentoring relationship</p>
						</div>
						<div className={style.points}>
							<img src={group} alt="group"></img>
							<p>Our secondary goal is to build a strong mentoring relationship</p>
						</div>
					</div>
				</div> */}
			</div>
		)
	}

	const RoomSection = () => {
		return (
			<div className={style.roomSection}>
				<div className={style.subHeading}>
					<SubHeading number="03" title="JOIN YOUR FAVIROTE GROUP" rightLine={true} leftLine={true} align="center"/>
				</div>
				<h1>JOIN AND COLLABORATE  <br/> IN GROUPS FOR <GradientText title="PROJECT DEVELOPMENT" color1='#8FC7C8' color2='#0A66C2'/></h1>
				{/* <img src={waveCombination} alt="wave combination"></img> */}
			</div>
		)
	}

	return (
		<div>
			<div className='AppNavbarGap'></div>
			<HeroSection />
			{/* <ChooseMentorSection /> */}
			<SkillsSection2 />
			<br/>
			<SkillsSection />
			<RoomSection />
		</div>
	);
};

export default Home;
