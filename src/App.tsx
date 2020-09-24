import React, {useState} from 'react';
// import logo from './logo.svg';
// import './App.css';

// Components
import QuestionCard from './components/QuestionCard';
// Types
import {QuestionsState, Difficulty, fetchQuizQuestions} from './API'
// Style
import { GlobalStyle, Wrapper } from './App.styles';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const TOTAL_QUESTIONS = 10;

const App = () => {

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionsState[]>([]);
  const [number, setNumber] = useState(0)
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(true)

  // console.log(fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY))
  // console.log(questions);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY)

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver) {
      // Users answer
      const answer = e.currentTarget.value;
      // Check answer if answer is correct
      const correct = questions[number].correct_answer === answer;
      // Add score if answer is correct
      if (correct) setScore(prev => prev + 1);
      // Save answer in the useranswers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct, 
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers( prev => [...prev, answerObject]);  
    }
  }

  const nextQuestion = () => {
    // Next Question
    const nextQuestion = number + 1;
    if(nextQuestion === TOTAL_QUESTIONS){
      setGameOver(true);
    }else{
      setNumber(nextQuestion);
    }
  }

  
  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>React CBT Quiz</h1>
        {gameOver || userAnswers.length === TOTAL_QUESTIONS? (
          <button className="start" onClick={startTrivia}>
            Start
          </button>
          ) : null
        }
        
        {!gameOver && <p className="score">Score: {score}</p>}
        {loading && <p>Loading Questions...</p>}
        {!loading && !gameOver && (
          <QuestionCard 
            questionNr={number + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}
        {!gameOver && 
         !loading && 
         userAnswers.length === number + 1 &&
         number !== TOTAL_QUESTIONS && (
          <button className="next" onClick={nextQuestion}>
            Next Question 
          </button>
        )}
        
      </Wrapper>
    </>
  );
}

export default App;

