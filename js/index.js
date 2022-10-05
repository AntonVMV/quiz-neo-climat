const questions = [
  {
    question: "Выберите тип помещения",
    name: "building",
    answers: [
      { asnwer: "Квартира", price: 1, image: "./images/flat.png" },
      { asnwer: "Дом", price: 1.2, image: "./images/house.png" },
      { asnwer: "Офис", price: 1.4, image: "./images/office.png" },
      { asnwer: "Ресторан", price: 1.6, image: "./images/restaurant.png" },
      { asnwer: "Другое", price: 1.6, image: "./images/else-cond.png" },
    ],
  },
  {
    question: "Примерная площадь помещения",
    name: "area",
    answers: [
      { asnwer: "50 кв.м.", price: 500 },
      { asnwer: "50-150 кв.м.", price: 750 },
      { asnwer: "150-300 кв.м.", price: 2250 },
      { asnwer: "300-500 кв.м.", price: 4000 },
      { asnwer: "500-1000 кв.м.", price: 7500 },
      { asnwer: "Более 1000 кв.м.", price: 10000 },
    ],
  },
  {
    question: "Какой тип работ хотели бы произвести",
    name: "equipment",
    answers: [
      { asnwer: "Вытяжная вентиляция, удаление запаха и дыма", price: 2 },
      { asnwer: "Приточная вентиляция, подача свежего воздуха", price: 2.2 },
      { asnwer: "Кондиционирование, регуляция температуры", price: 1.4 },
      { asnwer: "Отопление, водопровод, канализация", price: 1.8 },
    ],
  },
  {
    question: "Какое нужно оборудование:",
    name: "equipment",
    answers: [
      { asnwer: "Кондиционеры", price: 1.4, image: "./images/cond-photo.jpg" },
      {
        asnwer: "Приточные установки",
        price: 1.4,
        image: "./images/pritok-photo.jpg",
      },
      {
        asnwer: "Вытяжные вентиляторы",
        price: 1.4,
        image: "./images/vent-photo.jpg",
      },
      {
        asnwer: "Котлы, насосы, нагреватели",
        price: 1.4,
        image: "./images/kotl-photo.jpg",
      },
      {
        asnwer: "Не нужно, есть своё",
        price: 1,
        image: "./images/dont-need.jpg",
      },
    ],
  },
];

const screens = document.querySelectorAll("[data-screen]");
const form = document.querySelector(".quiz-form");
const formSteps = document.querySelectorAll("[data-step]");
const startBtn = screens[0].querySelector("button");
const progressIndicator = document.querySelector(".progress-indicate");
const progressNum = document.querySelector(".complete-number");
const questionsRemains = document.querySelector(".question-remains");
const discount = document.querySelectorAll(".discount-number");
const sideBar = document.querySelector(".quiz-side");
const progressBar = document.querySelector(".quiz-progress");

const resultObj = {};

startBtn.addEventListener("click", () => {
  changeActiveElement([...screens], 1);
  changeActiveElement([...formSteps], 0);
});

//If there is no active page, set active page to first
if (checkIsActive([...screens]) < 0) {
  changeActiveElement([...screens], 0);
}

[...formSteps].forEach((item, index, arr) => {
  const answers = item.querySelector(".quiz-answers");

  item.addEventListener("click", (e) => {
    if (e.target.matches(".next-question-btn")) {
      e.preventDefault();
      //Check if an answer is selected, else make 'next' button inactive
      if (checkIsActive([...answers.children]) < 0) {
        //Show warn
        return;
      }

      //Last question button has to send form, other switch form step
      if (index === arr.length - 1) {
        submitHandler();
        return;
      } else {
        changeActiveElement(arr, index + 1);
        updateProgress(index + 1);
      }
    }

    if (e.target.matches(".prev-question-btn")) {
      e.preventDefault();
      changeActiveElement(arr, index - 1);
      updateProgress(index - 1);
    }
  });

  answers.addEventListener("change", (e) => {
    resultObj[e.target.name] = e.target.value;
    const selectedElement = [...answers.children].indexOf(e.target.parentNode);
    changeActiveElement([...answers.children], selectedElement);
  });
});

//Function to update UI
function updateProgress(questionPassed) {
  const progressInPercents =
    Math.floor(100 / (formSteps.length - 1)) * questionPassed;

  progressIndicator.style.width = `${progressInPercents}%`;
  progressNum.innerText = `${progressInPercents}%`;

  const remains = formSteps.length - 1 - questionPassed;

  questionsRemains.innerText = `${remains} ${declension(
    ["вопрос", "вопроса", "вопросов"],
    remains
  )}`;

  [...discount].forEach(
    (item) => (item.innerText = `${parseInt(item.innerText) - 3}%`)
  );

  if (questionPassed === formSteps.length - 1) {
    sideBar.style.display = "none";
    progressBar.style.display = "none";
  }
}

function submitHandler() {
  if (!form.checkValidity()) {
    //validate
    return;
  }

  const result = new FormData(form);

  //fetch, then

  changeActiveElement([...screens], 2);
}

//Set class 'active' only for one element and remove for others
function changeActiveElement(arr, elemIndex) {
  arr.forEach((item, index) => {
    item.classList.toggle("active", elemIndex === index);
  });
}

//Check if an array has an element with a class 'active'
function checkIsActive(arr) {
  return arr.findIndex((item) => item.classList.contains("active"));
}

//Function for declension words
function declension(forms, val) {
  const cases = [2, 0, 1, 1, 1, 2];
  return forms[
    val % 100 > 4 && val % 100 < 20 ? 2 : cases[val % 10 < 5 ? val % 10 : 5]
  ];
}

function createQuestionElement(questions) {
  const fieldsetElement = document.createElement("fieldset");
  fieldsetElement.classList.add("quiz-question");
  fieldsetElement.setAttribute("data-step", "");

  const title = document.createElement("h5");
  title.className = "title-m quiz-question-title";
  fieldsetElement.appendChild(title);

  const answersContainer = document.createElement("div");
  answersContainer.className = "quiz-answers";
  questions.answers.forEach((item, index) => {});

  console.log(fieldsetElement);
}

createQuestionElement(questions[0]);
