window.wpUrl = "<?php echo esc_url(admin_url('admin-ajax.php')); ?>";

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

const currentQuestion = 0;

startBtn.addEventListener("click", () => {
  changeActiveElement([...screens], 1);
  nextQuestion(0);
  app.classList.remove("small");
});

//Set all next button to disabled
nextQuestionBtns.forEach((item) => item.setAttribute("disabled", ""));

//If there is no active page, set active page to first
if (checkIsActive([...screens]) < 0) {
  screens[0].classList.add("active");
  formSteps[0].classList.add("active");
}

function nextQuestion(question) {
  const answers = formSteps[question].querySelectorAll(".quiz-answer");

  changeActiveElement([...formSteps], question);

  [...answers].forEach((item, index) => {
    item.style.animationDelay = index * 100 + 500 + "ms";
  });
}

[...formSteps].forEach((item, index, arr) => {
  const answers = item.querySelector(".quiz-answers");

  item.addEventListener("click", (e) => {
    if (e.target.matches(".next-question-btn")) {
      e.preventDefault();
      //Check if an answer is selected, else make 'next' button inactive
      if (checkIsActive([...answers.children]) < 0) {
        return;
      }

      //Last question button has to send form, other switch form step
      if (index === arr.length - 1) {
        submitHandler();
        return;
      } else {
        totlalDiscount -= 3;
        // changeActiveElement(arr, index + 1);
        nextQuestion(index + 1);
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

    //do not add final question results to totla price
    if (index < arr.length - 1) {
      selections[index] = prices[index][selectedElement];
    }

    nextQuestionBtns[index].removeAttribute("disabled");
    [...answers.children].forEach((item, index) => {
      item.classList.toggle("active", index === selectedElement);
    });
  });
});

//Function to update progress and progress UI
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
    let totalPrice = Math.round(
      Object.values(selections).reduce((acc, item) => acc * item, 1)
    );

    waitForAnimEnds(sideBar);
    waitForAnimEnds(progressBar);
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

  result.append("action", "quiz-data");

  const xhr = new XMLHttpRequest();
  xhr.open("POST", wpUrl);
  xhr.send();
  xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState !== 4) return;
    if (xhr.status === 200) {
      console.log(xhr.response);
      app.classList.add("small");
      changeActiveElement([...screens], 2);
    } else {
      console.log(xhr.statusText);
    }
  });
}

//Change active element
function changeActiveElement(elems, num) {
  elems.forEach((item, i, arr) => {
    if (item.classList.contains("active")) {
      waitForAnimEnds(item, arr[num]);
    }
  });
}

//toggle active class, after animation of previous element is ended
function waitForAnimEnds(elem, nextEl) {
  elem.classList.add("to-hide");
  elem.addEventListener(
    "animationend",
    () => {
      elem.classList.remove("to-hide");
      elem.classList.remove("active");
      if (nextEl) {
        nextEl.classList.add("active");
      }
    },
    { once: true }
  );
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

//Function to split price by 3 characters from end, like '23 443 324'
function splitNumber(number) {
  return number
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    .concat(" р.");
}
