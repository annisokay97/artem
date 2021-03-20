import {useState, useEffect} from "react"
import * as emailjs from 'emailjs-com'
import questions from './Test.json';
import './App.css';
import questionImg from './question.jpg';
import correctImg from './correct.jpg';
import wrongImg from './wrong.jpg';
import artemImg from './artem.jpg';

function App() {
  const [img, setImg] = useState(questionImg);
  const [currentQuestion, setCurrentQuestion] = useState({...questions[0], index: 0});
  const [isCorrect, setCorrect] = useState();
  const [correctCount, setCorrectCount] = useState(0)
  const [isEnded, setEnded] = useState(false)
  const handleClick = (isCorrectAnswer) => {
    setCorrect(isCorrectAnswer)

    if(isCorrectAnswer) {
      setCorrectCount(correctCount + 1)
    }
  } 
  const handleNext = () => {
    setCorrect(undefined);
    setCurrentQuestion({...questions[currentQuestion.index + 1], index: currentQuestion.index + 1})
  }


  const handleEnd = () => { 
    setEnded(true)

    emailjs.send('service_b7lcmqm', 'template_6oztbs9', {
      result: `Res: ${correctCount}`,
  }, 'user_sBKadUlJjKG2T5smH4jER')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
  }
  
  const images = {
    wrong : wrongImg,
    correct: correctImg,
    question: questionImg
  }
  const mapImage = () => isCorrect === undefined ? 'question' : isCorrect?"correct" : "wrong";

  useEffect(() => {
    setImg(images[mapImage()])
  }, [isCorrect])


  return (
    <div className="App">
      {isEnded ? <>
        <div className="image" style={{backgroundImage: `url(${artemImg})`}} />
        <h1>Поздравляю, Ваш Уровень Артем!!!</h1>
        <h2>Вы набрали {correctCount} из {questions.length}</h2>
       </> :
      <>
      <div className={`image ${mapImage()} `} style={{backgroundImage: `url(${img})`}} />

      <h1>{currentQuestion.question}</h1>
      {isCorrect !== undefined && <h2>{currentQuestion.answers.find(answ => answ.isСorrect)?.label}</h2>}


      
      { isCorrect === undefined &&
        <div className="buttons-container"> 
          {currentQuestion.answers.map(answer=> <button key={answer.label} onClick={() => handleClick(!!answer.isСorrect)} >{answer.label}</button>)}
        </div> 
      }

      {isCorrect !== undefined &&
       ( currentQuestion.index !== questions.length-1 ? <button className="next-button" onClick={handleNext}>Далее</button>:
       <button className="next-button" onClick={handleEnd}>Завершить</button>
       )
      }
      </>
      }
      
    </div>
  );
}

export default App;
