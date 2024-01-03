const questions = [
  {
    question: "Which is the largest animal in the world?",
    answers: [
      { text: "Shark", correct: false },
      { text: "Blue whale", correct: true },
      { text: "Elephant", correct: false },
      { text: "Giraffe", correct: false },
    ],
  },
  {
    question: "Which is the smallest continent in the world?",
    answers: [
      { text: "Asia", correct: false },
      { text: "Australia", correct: true },
      { text: "Arctic", correct: false },
      { text: "Africa", correct: false },
    ],
  },
  {
    question: "What is the correct HTML element for inserting a line break?",
    answers: [
      { text: "break", correct: false },
      { text: "lb", correct: false },
      { text: "br", correct: true },
      { text: "h", correct: false },
    ],
  },
];

const questionElement = document.getElementById("questions");
const answerButton = document.getElementById("answers-buttons");
const nextButton = document.getElementById("next-button");
const addAnswerDiv = document.querySelector(".addanswer");
const markAnswer = document.getElementById("mark-button");
const subAnswer = document.getElementById("sub");
const prevanswer = document.getElementById("per-button");
const questionNumber = document.getElementById("question-number");
const progress = document.getElementById("progress");
const countdownContainer = document.getElementById("countdown-container");


const answeredQuestions = {};

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  showQuestion();
}

function showQuestion(answered) {
  resetState();
  let currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  progress.style.width = `${currentQuestionIndex * 100 / questions.length}%`
  questionNumber.innerHTML = Math.min(questionNo, questions.length);
  questionElement.innerHTML = ` ${currentQuestion.question}`;
  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn");
    if (answered) {
      if (answer.correct) {
        button.classList.add("correct");
      }
      if (!answered.isCorrect && answer.text === answered.text) {
        button.classList.add("incorrect");
      }
      button.disabled = true
    }
    else {
      if (answer.correct) {
        button.dataset.correct = answer.correct;
      }
      button.addEventListener("click", selectAnswer);
    }
    answerButton.appendChild(button);

  });

  nextButton.innerHTML = `Next`;
}

function resetState() {
  while (answerButton.firstChild) {
    answerButton.removeChild(answerButton.firstChild);
  }
}

function selectAnswer(e) {
  const selectBtn = e.target;
  const isCorrect = selectBtn.dataset.correct === "true";
  answeredQuestions[`${currentQuestionIndex}`] = { isCorrect, text: e.target.textContent };
  if (isCorrect) {
    selectBtn.classList.add("correct");
    score++;
  } else {
    selectBtn.classList.add("incorrect");
  }

  Array.from(answerButton.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });

  nextButton.style.display = "inline-block";
}

function showScore() {
  clearTimeout(timer)
  resetState();
  questionElement.innerHTML = `Your score: ${score} out of ${questions.length}`;
  nextButton.style.display = "none";
  questionNumber.style.display = "none";
  markAnswer.style.display = "none";
  subAnswer.style.display = "none";
  prevanswer.style.display = "none";
  addAnswerDiv.style.display = "none";
  countdownContainer.style.display = "none";
  progress.style.width = `100%`
}

function handleNextButton() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    if (currentQuestionIndex === 1) {
      prevanswer.style.display = "inline-block";
    }
    showQuestion(answeredQuestions[currentQuestionIndex]);
  } else {
    questionElement.innerHTML = 'No more questions! If you are sure, click submit';
    progress.style.width = `100%`
    answerButton.style.display = "none";
    nextButton.style.display = "none";
    markAnswer.style.display = "inline-block";
    prevanswer.style.display = "inline-block";
  }
}

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length) {
    handleNextButton();
  } else {
    startQuiz();
  }
});

const markedQuestions = []; // Array to store indices of marked questions

function addQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  const questionNo = currentQuestionIndex + 1;

  // Check if the question is already marked
  if (markedQuestions.includes(currentQuestionIndex)) {
    // If the question is already marked, do not proceed
    alert(`Question ${questionNo} is already marked.`);

    return; // Exit the function early
  }

  const questionParagraph = document.createElement("p");
  questionParagraph.textContent = `Question number ${questionNo}. `;
  addAnswerDiv.appendChild(questionParagraph);
  questionParagraph.classList.add("prg");

  // Mark the question and add its index to the markedQuestions array
  console.log(`Question ${questionNo} marked.`);
  markedQuestions.push(currentQuestionIndex);
}

function previousAnswer() {

  currentQuestionIndex--;

  if (currentQuestionIndex >= 0) {
    showQuestion(answeredQuestions[`${currentQuestionIndex}`]);
  }
  if (currentQuestionIndex === 0) {
    prevanswer.style.display = "none";
  }
  nextButton.style.display = "inline-block";
  answerButton.style.display = "block";
}

markAnswer.addEventListener("click", addQuestion);
subAnswer.addEventListener("click", showScore);
prevanswer.addEventListener("click", previousAnswer);
markAnswer.addEventListener("click", addQuestion);

startQuiz();

let startTime = new Date().getTime();
let quarterHour =  15* 60 * 1000;
let endTime = startTime + quarterHour;

let timer = setInterval(() => {
  let currentTime = new Date().getTime();
  let timeRemaining = endTime - currentTime;

  let minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  document.querySelector(".countdown").innerHTML = `${minutes} minutes ${seconds} seconds`;

  if (timeRemaining <= 0) {
    clearInterval(timer);
    document.body.style.backgroundColor = "#001e4d";
    document.body.style.color = "white";
    document.body.style.textAlign = "center";
    document.body.style.fontSize="30px";
    document.body.style.fontWeight="600";
    document.body.innerHTML = "Time is out";
  }
}, 1000);
