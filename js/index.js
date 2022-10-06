const prices = [
  [2, 2.2, 2.4, 2.6, 2.6],
  [5000, 7500, 22500, 40000, 75000, 100000],
  [2.8, 3, 2.4, 2.4],
  [2, 3, 2.8, 2.6, 1],
];

const app = document.querySelector(".quiz-app");
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
const price = document.querySelector(".new-price");
const prevPrice = document.querySelector(".prev-price");
const errorElement = document.querySelector(".user-form-error");
const nextQuestionBtns = document.querySelectorAll(".next-question-btn");

let selections = {};
let totlalDiscount = -10;

startBtn.addEventListener("click", () => {
  changeActiveElement([...screens], 1);
  changeActiveElement([...formSteps], 0);
  app.classList.remove("small");
});

nextQuestionBtns.forEach((item) => item.setAttribute("disabled", ""));

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
        totlalDiscount -= 3;
        changeActiveElement(arr, index + 1);
        updateProgress(index + 1);
      }
    }

    if (e.target.matches(".prev-question-btn")) {
      e.preventDefault();
      totlalDiscount += 3;
      changeActiveElement(arr, index - 1);
      updateProgress(index - 1);
    }
  });

  answers.addEventListener("change", (e) => {
    const selectedElement = [...answers.children].indexOf(e.target.parentNode);
    if (index < arr.length - 1) {
      selections[index] = prices[index][selectedElement];
    }
    console.log(selections);
    nextQuestionBtns[index].removeAttribute("disabled");
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

  [...discount].forEach((item) => (item.innerText = `${totlalDiscount}%`));

  if (questionPassed === formSteps.length - 1) {
    let totalPrice = Object.values(selections).reduce(
      (acc, item) => acc * item,
      1
    );

    sideBar.style.display = "none";
    progressBar.style.display = "none";
    price.innerText = splitNumber(totalPrice);
    prevPrice.innerText = splitNumber(
      totalPrice + (totalPrice / 100) * Math.abs(totlalDiscount)
    );
  }
}

function submitHandler() {
  if (!form.checkValidity()) {
    errorElement.classList.add("visible");
    return;
  }

  const result = new FormData(form);

  //fetch, then

  app.classList.add("small");
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

function splitNumber(number) {
  return number
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    .concat(" р.");
}
