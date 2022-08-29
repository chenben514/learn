/*history: test_0822_0120*/
import game_focus from "./game_focus.js";
import loadWordChain from "./game_word_chain.js";

//disable window scroll
// var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
// var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft);
// window.onscroll = function () {
//     window.scrollTo(scrollLeft, scrollTop);
//   };
//disable window scroll_end

window.pronClick = pronClick;
window.confirmClick = confirmClick;
window.optionSelected = optionSelected;
//selecting all required elements
const maxQuesCnt = 500;
const start_btn = document.querySelector(".test-button");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const select_list = document.querySelector(".select_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
const userName = document.querySelector(".user-nav__user-name");
const content = document.querySelector(".content");
const sideBar = document.querySelector(".sidebar");
const quizWidth = document.querySelector("section").offsetWidth;
let quesTimer = 15;
var startSecond;
var nowSecond;
var startMilisecond;
var nowMilisecond;
var miliWidth;
let curQuiz = "";
let ansQuesCnt = 0;
let quizType = "";
let curStatus = "nextQues";
let correctCnt = 0;
let cursubject = "";
let curLevel = 0;
let userInputAns = "";
var curQuizType = "";
var questions = "";

/*4. questions */
var base_filename;
let quesArr;

/*5. subtitle */
let timeoutID;
class Subtitle {
  numb;
  content;
  start;
  finish;
}

class Playlist {
  numb;
  content;
  video_id;
}

/*5.1 subtitle audio */
let rowSelected;
let startTime, finishTime;
let nowAudioLoop = false;
var subtitles = "";
var subTitleCnt = 0;
let audio, source;
let autoRowSelected = 0;
let myAudioTableRow;
let remainHighlight,
  bRemainHighlight = false;
let audio_sec_bottom;

/*5.2 subtitle youtube */
let youtube_mode = false,
  youtube_ready = false;
var player;
let youtube_url;

/*5.3 subtitle audio */
let playlistCnt = 0;
let playlists = [];

//6.1. Set Search
let search_button = document.querySelectorAll(".search__button");
search_button[0].addEventListener("click", showSearch);

let search_input = document.getElementById("search__input");
search_input.addEventListener("input", showSearch);

let oldSearchValue = "";

//7.1. Set Selected
let curSelected = "";

function showSearch() {
  if (oldSearchValue != search_input.value) {
    var tmpID = document.getElementById(curMainSubj);
    oldSearchValue = search_input.value;
    tmpID.click();
  }
}

//0.1. Set Subject
const subject_links = document.querySelectorAll(".side-nav__link");
for (let i = 0; i < subject_links.length; i++) {
  subject_links[i].addEventListener("click", setCourse);
}

function setCourse() {
  var preElement = document.getElementById(curCourse).parentNode;
  preElement.classList.remove("side-nav__item--active");

  curCourse = this.id;
  localStorage.setItem("lastCourse", curCourse);
  var element = document.getElementById(this.id).parentNode;
  element.classList.add("side-nav__item--active");

  showTopic();

  //0.3. Set Main Subject
  const main_subject_links = document.querySelectorAll(".main_subj__photo");
  for (let i = 0; i < main_subject_links.length; i++) {
    main_subject_links[i].addEventListener("click", setMainSubject);
  }

  //0.3. Set Left Subject
  let left_test_links = document.querySelectorAll(".detail_left_subj");
  for (let i = 0; i < left_test_links.length; i++) {
    left_test_links[i].addEventListener("click", startLeft);
  }

  //0.2. Set Subject
  let small_test_links = document.querySelectorAll(".test-button");
  for (let i = 0; i < small_test_links.length; i++) {
    small_test_links[i].addEventListener("click", startQuiz);
  }

  let conver_test_links = document.querySelectorAll(
    ".conversation-test-button"
  );
  for (let i = 0; i < conver_test_links.length; i++) {
    conver_test_links[i].addEventListener(
      "click",
      function () {
        startAudio(conver_test_links[i].id);
      },
      false
    );
  }

  let small_wrong_links = document.querySelectorAll(".wrong-button");
  for (let i = 0; i < small_wrong_links.length; i++) {
    small_wrong_links[i].addEventListener("click", startWrong);
  }
}

//0.2. Set Last Course
var tmpElement = document.getElementById(curCourse);
if (tmpElement != null) {
  var element = document.getElementById(curCourse).parentNode;
  element.classList.add("side-nav__item--active");
}

//0.3. Set Main Subject
const main_subject_links = document.querySelectorAll(".main_subj__photo");
for (let i = 0; i < main_subject_links.length; i++) {
  main_subject_links[i].addEventListener("click", setMainSubject);
}

function setMainSubject() {
  curMainSubj = this.id;
  var preElement = document.getElementById(curMainSubj).parentNode;
  preElement.classList.remove("main_subj__item--active");

  var element = document.getElementById(this.id).parentNode;
  element.classList.add("main_subj__item--active");

  localStorage.setItem(curCourse + "_main_subj", curMainSubj);
  showTopic();

  const tmp_main_subject_links = document.querySelectorAll(".main_subj__photo");
  for (let i = 0; i < tmp_main_subject_links.length; i++) {
    tmp_main_subject_links[i].addEventListener("click", setMainSubject);
  }

  let left_test_links = document.querySelectorAll(".detail_left_subj");
  for (let i = 0; i < left_test_links.length; i++) {
    left_test_links[i].addEventListener("click", startLeft);
  }

  let small_test_links = document.querySelectorAll(".test-button");
  for (let i = 0; i < small_test_links.length; i++) {
    small_test_links[i].addEventListener("click", startQuiz);
  }

  let conver_test_links = document.querySelectorAll(
    ".conversation-test-button"
  );
  for (let i = 0; i < conver_test_links.length; i++) {
    conver_test_links[i].addEventListener(
      "click",
      function () {
        startAudio(conver_test_links[i].id);
      },
      false
    );
  }

  let small_wrong_links = document.querySelectorAll(".wrong-button");
  for (let i = 0; i < small_wrong_links.length; i++) {
    small_wrong_links[i].addEventListener("click", startWrong);
  }

  // let small_class_links = document.querySelectorAll(".class-button");
  // for (let i = 0; i < small_class_links.length; i++) {
  //   small_class_links[i].addEventListener("click", startClass);
  // }
}

let left_test_links = document.querySelectorAll(".detail_left_subj");
for (let i = 0; i < left_test_links.length; i++) {
  left_test_links[i].addEventListener("click", startLeft);
}

//0.4. Set Small Course
let small_test_links = document.querySelectorAll(".test-button");
for (let i = 0; i < small_test_links.length; i++) {
  small_test_links[i].addEventListener("click", startQuiz);
}

let conver_test_links = document.querySelectorAll(".conversation-test-button");
for (let i = 0; i < conver_test_links.length; i++) {
  conver_test_links[i].addEventListener(
    "click",
    function () {
      startAudio(conver_test_links[i].id);
    },
    false
  );
}

let small_wrong_links = document.querySelectorAll(".wrong-button");
for (let i = 0; i < small_wrong_links.length; i++) {
  small_wrong_links[i].addEventListener("click", startWrong);
}

// let small_class_links = document.querySelectorAll(".class-button");
// for (let i = 0; i < small_class_links.length; i++) {
//   small_class_links[i].addEventListener("click", startClass);
// }

function pronClick() {
  var audioFile;
  if (curQuizType.includes("mp3")) {
    audioFile = base_filename + ".mp3";
  } else {
    audioFile = base_filename + ".m4a";
  }

  if (UrlExists(audioFile)) {
    var quizPlayer = document.getElementById("radio");
    quizPlayer.hidden = false;
    quizPlayer.src = audioFile;
    quizPlayer.currentTime = questions[que_count].option1; // jumps to 29th secs
    quizPlayer.ontimeupdate = function () {
      if (quizPlayer.currentTime > questions[que_count].option2) {
        quizPlayer.pause();
      }
    };
    quizPlayer.play();
    // }
  } else {
    var msg = new SpeechSynthesisUtterance();

    // Set the text.
    msg.text = questions[que_count].question.replace(".mp3", "");

    // Set the attributes.
    msg.volume = 1;
    msg.rate = 1;
    msg.pitch = 1;
    if (curCourse == "chinese") msg.lang = "zh-CN";
    else if (curCourse == "korean") msg.lang = "ko-KR";
    else if (curCourse == "japan") msg.lang = "ja-JP";
    else if (curCourse == "english") msg.lang = "en-US";
    window.speechSynthesis.speak(msg);
  }
}

// if Left button clicked
function startLeft() {
  startAudio(this.id);
}

function disableBtnStatus(status) {
  let small_wrong_links = document.querySelectorAll(".wrong-button");
  for (let i = 0; i < small_wrong_links.length; i++) {
    small_wrong_links[i].disabled = status;
  }
  let small_test_links = document.querySelectorAll(".test-button");
  for (let i = 0; i < small_test_links.length; i++) {
    small_test_links[i].disabled = status;
  }
}

// if startQuiz button clicked
function startQuiz() {
  curQuiz = this.id;
  var curQuizArr = curQuiz.split("-");
  curQuizType = curQuizArr[0];
  if (curSelected.length != 0) {
    var tmpSelected;
    tmpSelected = document.getElementById(curSelected);
    if (tmpSelected != undefined) {
      tmpSelected.classList.remove("test-pressed");
    }
  }
  this.classList.add("test-pressed");
  curSelected = curQuiz;
  //0.1 disable all test buttons
  disableBtnStatus(true);

  // let small_wrong_links = document.querySelectorAll(".wrong-button");
  // for (let i = 0; i < small_wrong_links.length; i++) {
  //   small_wrong_links[i].disabled = true;
  // }

  //0.2. disable all test buttons
  //0.直接聽錄音
  if (curQuizType.includes("conversation_youtube")) {
    startAudio(this.id);
    return;
  }
  // } else {
  //   let small_test_links = document.querySelectorAll(".test-button");
  //   for (let i = 0; i < small_test_links.length; i++) {
  //     small_test_links[i].disabled = true;
  //   }
  // }

  if (curQuizType == "game_focus") {
    game_focus();
    return;
  }
  if (curQuizType == "game_word_chain") {
    loadWordChain();
    return;
  }

  if (getQuestions() == false) return;
  ansQuesCnt = 0;
  quiz_box.classList.add("activeQuiz"); //show quiz box
  showQuestions(0); //calling showQestions function
  queCounter(1); //passing 1 parameter to queCounter
  startTimer(); //calling startTimer function
  startTimerLine(); //calling startTimerLine function
}

function startClass() {
  content.classList.add("slight_opacity");

  curQuiz = this.id.substr(0, this.id.length - 5);

  // Get the modal
  var modal = document.getElementById("myModal");

  var modalContent = document.getElementsByClassName("modal-content")[0];
  var myWidth = "600px";
  var myHeight = "600px";
  // When the user clicks on <span> (x), close the modal
  modal.style.display = "block";

  modalContent.innerHTML = '<span class="close">&times;</span><p>';

  modalContent.innerHTML = modalContent.innerHTML + "</p>";
  var imgContent =
    "<img width=" +
    myWidth +
    " height=" +
    myHeight +
    "src='https://indigo-gourd-012.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F0c0b51b8-d77c-4071-80b9-6c081ad9691d%2F002.png?table=block&id=16f8c6eb-d5c7-49fd-b4c0-19ce41ede31b&spaceId=983002ac-733f-40cf-b34f-d13e171ec134&width=1340&userId=&cache=v2'>";

  imgContent =
    "<img src='https://photos.google.com/album/AF1QipPZ9tRkjIAhPkRWgoLdUxPD4a-jG0A5d2hFhmF7/photo/AF1QipMGaxE4yUAS8C6kiydVajnag8BZ3ZgCAtJu8APq' />";

  // imgContent =
  //   "<img src='https://photos.google.com/album/AF1QipPZ9tRkjIAhPkRWgoLdUxPD4a-jG0A5d2hFhmF7/photo/AF1QipMGaxE4yUAS8C6kiydVajnag8BZ3ZgCAtJu8APq'>";

  modalContent.innerHTML += imgContent;

  var span = document.getElementsByClassName("close")[0];
  span.addEventListener("click", closeClass);
}

function closeClass() {
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
  content.classList.remove("slight_opacity");
}

function startWrong() {
  content.classList.add("slight_opacity");

  curQuiz = this.id.substr(0, this.id.length - 5);
  // content.classList.add("slight_opacity");

  // Get the modal
  var modal = document.getElementById("myModal");

  var modalContent = document.getElementsByClassName("modal-content")[0];
  // When the user clicks on <span> (x), close the modal
  modal.style.display = "block";

  var curQuizArr = curQuiz.split("-");

  var curTopicArr = curQuizArr[1].split("_");
  curQuizType = curQuizArr[0];

  var base_left_filename =
    "./data/" + curTopicArr[0] + "/" + curTopicArr[1] + "/" + curTopicArr[2];

  base_filename = base_left_filename + "/" + curTopicArr[3];

  if (
    curQuizType.includes("conversation_m4a") ||
    curQuizType.includes("conversation_mp3")
  ) {
    parseSrt(base_filename + ".srt");
  } else {
    parseCsv(base_filename + ".csv");
  }

  modalContent.innerHTML = '<span class="close">&times;</span><p>';

  var wrongStorage = localStorage.getItem(curQuiz + "_wrong");
  if (wrongStorage == null || wrongStorage == "undefined")
    wrongStorage = "nothing";
  let tmpMessage = "";

  var quesList = [];
  let quesCnt = quesArr.length;
  let ansList = [];
  let tmpCnt = 0;

  for (let k = 0; k < quesCnt; k++) {
    if (quesArr[k].length < 2) continue;
    tmpMessage = k + ",";
    var checkMessage = "," + tmpMessage;
    if (
      wrongStorage != null &&
      wrongStorage != "undefined" &&
      wrongStorage.length > 1
    ) {
      if (!wrongStorage.includes(checkMessage)) {
        continue;
      }
    }
    var curQuizArr = quesArr[k].split("\t");
    modalContent.innerHTML =
      modalContent.innerHTML +
      (k + 1) +
      ". " +
      curQuizArr[0] +
      " : " +
      curQuizArr[1] +
      "<br>";
  }
  modalContent.innerHTML = modalContent.innerHTML + "</p>";
  var span = document.getElementsByClassName("close")[0];
  span.addEventListener("click", closeWrong);
}

function closeWrong() {
  var modal = document.getElementById("myModal");
  modal.style.display = "none";
  content.classList.remove("slight_opacity");
}

let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let nowCursorFocus = 0;
let curQuesType = "";

const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

// if restartQuiz button clicked
restart_quiz.onclick = () => {
  localStorage.setItem(curQuiz + "_right", "");
  result_box.classList.remove("activeResult"); //show result box
  content.classList.remove("slight_opacity");
  disableBtnStatus(false);
  // window.location.reload(); //reload the current window
  return;
  //no-way-here
};

// if quitQuiz button clicked
quit_quiz.onclick = () => {
  // quiz_box.classList.remove("activeQuiz"); //show quiz box
  result_box.classList.remove("activeResult"); //show result box
  content.classList.remove("slight_opacity");
  disableBtnStatus(false);
  // window.location.reload(); //reload the current window
};

const next_btn = document.querySelector("footer .next_btn");
const quit_btn = document.querySelector("footer .quit_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

// if Next Que button clicked
next_btn.onclick = () => {
  if (que_count < questions.length - 1 && que_count < maxQuesCnt - 1) {
    //if question count is less than total question length
    que_count++; //increment the que_count value
    que_numb++; //increment the que_numb value
    showQuestions(que_count); //calling showQestions function
    queCounter(que_numb); //passing que_numb value to queCounter
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine
    startTimer(); //calling startTimer function
    startTimerLine(); //calling startTimerLine function
    timeText.textContent = "還剩"; //change the timeText to Time Left
    next_btn.classList.remove("show"); //hide the next button
  } else {
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine
    showResult(); //calling showResult function
  }
};

// if Quit Que button clicked
quit_btn.onclick = () => {
  clearInterval(counter); //clear counter
  clearInterval(counterLine); //clear counterLine
  showResult(); //calling showResult function
};

function checkFileExist(urlToFile) {
  var xhr = new XMLHttpRequest();
  xhr.open("HEAD", urlToFile, false);
  xhr.send();

  if (xhr.status == "404") {
    return false;
  } else {
    return true;
  }
}
function parseCsv(filename) {
  var displayName;

  if (checkFileExist(filename) == false) {
    alert("Quiz file [" + filename + "] does not exist.");
    return false;
  }

  var read = new XMLHttpRequest();
  read.open("GET", filename, false);
  read.setRequestHeader("Cache-Control", "no-cache");
  read.send();

  displayName = read.responseText.replace(/’/g, "'");

  quesArr = displayName.replace(/\r\n/g, "\n").split("\n");
}

function parseSrt(filename) {
  readSubtitles(filename);
  quesArr = [];
  for (let k = 0; k < subtitles.length; k++) {
    quesArr.push(
      subtitles[k].content +
        "\t\t" +
        subtitles[k].start +
        "\t" +
        subtitles[k].finish
    );
  }
}

function getQuestions() {
  var curQuizArr = curQuiz.split("-");

  cursubject = curQuizArr[1].split("_")[0];
  correctCnt = 0;

  var curTopicArr = curQuizArr[1].split("_");
  curQuizType = curQuizArr[0];

  var base_left_filename =
    "./data/" + curTopicArr[0] + "/" + curTopicArr[1] + "/" + curTopicArr[2];

  base_filename = base_left_filename + "/" + curTopicArr[3];

  if (
    curQuizType.includes("conversation_m4a") ||
    curQuizType.includes("conversation_mp3")
  ) {
    parseSrt(base_filename + ".srt");
  } else {
    parseCsv(base_filename + ".csv");
  }

  var quesList = [];
  let quesCnt = quesArr.length;
  let ansList = [];
  let tmpCnt = 0;

  let tmpArr = [];
  let k = 0;

  var rightStorage = localStorage.getItem(curQuiz + "_right");
  if (rightStorage == null || rightStorage == "undefined")
    rightStorage = "nothing";
  let tmpMessage = "";
  for (let k = 0; k < quesCnt; k++) {
    if (quesArr[k].length < 2) continue;
    tmpMessage = k + ",";
    var checkMessage = "," + tmpMessage;
    if (rightStorage.includes(checkMessage)) {
      correctCnt++;
      continue;
    }
    tmpArr.push(tmpMessage + quesArr[k]);
  }
  quesArr = tmpArr;
  quesCnt = quesArr.length;
  if (quesCnt == 0) {
    curStatus = "allQuesPass";
    showResult();
    return false;
  }

  //1.get random list from file
  while (quesList.length < quesCnt) {
    var r = Math.floor(Math.random() * quesCnt);
    if (quesList.indexOf(r) === -1) quesList.push(r);
  }

  class Question {
    numb;
    question;
    answer;
    option1;
    option2;
    option3;
    option4;
    direct_answers = [];
    quizType;
  }
  //2.generate questions

  questions = [];
  var i;
  var j;
  for (i = 0; i < quesCnt; i++) {
    var ques_comma_pos = quesArr[quesList[i]].indexOf(",");
    var ques_length = quesArr[quesList[i]].length;
    var singQuesArr = quesArr[quesList[i]]
      .substr(ques_comma_pos + 1, ques_length - ques_comma_pos - 1)
      .split("\t");
    let question = new Question();

    question.numb = quesArr[quesList[i]].substr(0, ques_comma_pos);

    if (curQuizType.startsWith("calc")) {
      /* for Math, with random number */
      var digitArr = curTopicArr[3].split("~");
      var varArr = [];
      for (j = 0; j < 3; j++) {
        var newValue = Math.floor(
          //get_random_range_from_filename
          Math.random() * (parseInt(digitArr[2]) - parseInt(digitArr[1]) + 1) +
            parseInt(digitArr[1])
        );

        varArr.push(newValue);
      }
      for (var x = 0; x < singQuesArr.length; x++) {
        // alert(singQuesArr[x]);
        console.log(x + ":(begin):" + singQuesArr[x]);
        singQuesArr[x] = changeVariable(singQuesArr[x], varArr);
        console.log(x + ":(end):" + singQuesArr[x]);
        // alert(singQuesArr[x]);
      }
    }

    /*prepare question & answers*/
    if (singQuesArr[0].includes("[")) {
      /* for partial spell with [] */
      var tmpQues = singQuesArr[0];
      var tmpStart = tmpQues.indexOf("[");
      var tmpEnd = tmpQues.indexOf("]");

      question.question =
        '<span style="color:blue;font-size:20px;">' +
        tmpQues.substr(0, tmpStart) +
        "[";

      for (var z = 0; z < tmpEnd - tmpStart - 1; z++) {
        if (tmpQues.substr(tmpStart + z + 1, 1) == " ")
          question.question = question.question + "_";
        else question.question = question.question + "X";
      }

      question.question =
        question.question +
        "]" +
        tmpQues.substr(tmpEnd + 1, tmpQues.length - tmpEnd - 1) +
        "</span> : " +
        '<span style="color:grey;font-size:20px;">' +
        singQuesArr[1] +
        "</span>";

      question.quizType = "spell";
      question.answer = tmpQues.substr(tmpStart + 1, tmpEnd - tmpStart - 1);
      quesTimer = 60;
    } else if (singQuesArr[2] == "--" || curQuizType.includes("conversation")) {
      /* for all spell  */
      question.question =
        "[" + "X".repeat(singQuesArr[0].length) + "]" + singQuesArr[1];
      question.answer = singQuesArr[0];
      if (curQuizType.includes("conversation")) {
        question.quizType = "audio";
        question.option1 = singQuesArr[2];
        question.option2 = singQuesArr[3];
      } else question.quizType = "spell";
      quesTimer = 60;
    } else if (curQuizType.startsWith("calc") && singQuesArr.length < 3) {
      question.question = singQuesArr[0];
      question.answer = singQuesArr[1];

      question.quizType = "spell";
      quesTimer = 60;
    } else if (curQuizType == "audio") {
      /* for listen Audio */
      question.question = singQuesArr[0];
      question.answer = singQuesArr[0];
      question.quizType = "audio";
      quesTimer = 60;
      question.option1 = singQuesArr[1];
    } else {
      /* for choose  */
      question.question = singQuesArr[0];
      question.answer = singQuesArr[1];
      question.quizType = "choose";
      quesTimer = 60;

      ansList = [];
      while (ansList.length < 4) {
        var r = Math.floor(Math.random() * 4) + 1;
        if (ansList.indexOf(r) === -1) ansList.push(r);
      }

      question.option1 = singQuesArr[ansList[0]];
      question.option2 = singQuesArr[ansList[1]];
      question.option3 = singQuesArr[ansList[2]];
      question.option4 = singQuesArr[ansList[3]];
    }

    questions[i] = question;
  }
}

function UrlExists(url) {
  var http = new XMLHttpRequest();
  http.open("HEAD", url, false);
  http.send();
  return http.status != 404;
}

function confirmClick() {
  let inputAnswer = document.querySelector(".direct_input").value.toLowerCase();
  let correctAnswer = "";
  userInputAns = inputAnswer;
  document.querySelector("#confirmButton").disabled = "true";
  if (curQuesType === "direct_input") {
    correctAnswer = questions[que_count].answer.toString().toLowerCase();
  } else {
    correctAnswer = questions[que_count].question
      .toString()
      .toLowerCase()
      .replace(".mp3", "");
  }
  if (inputAnswer === correctAnswer || inputAnswer == "qqq")
    directSelected("correct", correctAnswer);
  else directSelected("incorrect", correctAnswer);
}

// getting questions and options from array
function showQuestions(index) {
  content.classList.add("slight_opacity");

  const que_text = document.querySelector(".que_text");
  ansQuesCnt++;
  nowCursorFocus = 0;
  //creating a new span and div tag for question and option and passing the value using array index
  let que_tag = "<span>" + questions[index].question + "</span>";

  let option_tag =
    '<div class="option" id="option1"><span>' +
    "1." +
    questions[index].option1 +
    "</span></div>" +
    '<div class="option"  id="option2"><span>' +
    "2." +
    questions[index].option2 +
    "</span></div>" +
    '<div class="option"  id="option3"><span>' +
    "3." +
    questions[index].option3 +
    "</span></div>" +
    '<div class="option"  id="option4"><span>' +
    "4." +
    questions[index].option4 +
    "</span></div>" +
    '<div class="option"  id="option5""><span>' +
    "5.不知道答案" +
    "</span></div>";
  let confirm_button = "";

  if (
    questions[index].quizType == "spell" ||
    questions[index].quizType == "audio"
  ) {
    curStatus = "spell";
    let answer_target =
      '<div><input type="text" class="direct_input" name="direct_input" id="direct_input" value="" placeholder="輸入答案" style="width:40%;height:40px;font-size:20px;padding:10px;">';
    answer_target +=
      "<span> <button id='confirmButton' onclick='confirmClick()' style='width:70px;height:40px;' >確認</button></span> </div>";
    curQuesType = "direct_input";
    if (questions[index].quizType == "audio") {
      // if (questions[index].option1 == null) {
      //   que_tag =
      //     "<span>答案請按右邊發音鈕  <button onclick='pronClick()' class='pronButton' style='width:70px;height:40px;' >發音</button></span>";
      // } else
      que_tag =
        "<span>" +
        questions[index].question +
        // questions[index].option1 +
        "  <button onclick='pronClick();' class='pronButton' style='width:70px;height:40px;' >發音</button></span>";
      que_text.innerHTML = que_tag; //adding new span tag inside que_tag
      pronClick();
    } else if (questions[index].quizType == "spell") {
      que_text.innerHTML = questions[index].question; //adding new span tag inside que_tag
    }

    option_list.innerHTML = answer_target;

    document.querySelector(".direct_input").focus();
    document.removeEventListener("keydown", keydown);
  } else {
    curStatus = "choose";
    que_text.innerHTML = que_tag; //adding new span tag inside que_tag
    option_list.innerHTML = option_tag; //adding new div tag inside option_tag
    const option = option_list.querySelectorAll(".option");

    // set onclick attribute to all available options
    for (var i = 0; i < option.length; i++) {
      option[i].setAttribute("onclick", "optionSelected(this)");
    }
    document.addEventListener("keydown", keydown);
  }

  quit_btn.classList.add("show"); //show the next button if user selected any option
}

// creating the new div tags which for icons
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>  ';
let crossIconTag =
  '<div class="icon cross"><div class="diag1"></div><div class="diag2"></div><i class="fas fa-times"></i></div>';

function directSelected(userAns, correctAns) {
  clearInterval(counter); //clear counter
  clearInterval(counterLine); //clear counterLine

  if (userAns === "correct") {
    //if user selected option is equal to array's correct answer
    userScore += 1; //upgrading score value with 1
    if (curQuesType === "direct_input") {
      document.querySelector(".direct_input").style.backgroundColor = "green";
    }
    keepRightAnswer();

    if (userInputAns == "168") {
      option_list.innerHTML =
        option_list.innerHTML +
        '<div name="answer" style="width:100%;height:40px;font-size:20px;padding:10px;color:blue">' +
        '<span style="color:blue">' +
        "正確答案：" +
        correctAns +
        "</span>";
    }
  } else {
    keepWrongAnswer();
    if (curQuesType !== "direct_input") {
      document.querySelector(".option").classList.add("incorrect");
    } //adding red color to correct selected option
    else {
      // document.querySelector(".direct_input").style.backgroundColor = "red";

      let answer_target = (option_list.innerHTML =
        option_list.innerHTML +
        '<div name="answer" style="width:100%;height:40px;font-size:20px;padding:10px;color:blue">' +
        '<span style="color:blue">' +
        "正確答案：" +
        correctAns +
        "</span>" +
        '<br><span style="color:blue">' +
        "你的答案：" +
        compWrongChar(correctAns, userInputAns) +
        "</span" +
        "</div>");
    }
  }
  next_btn.classList.add("show"); //show the next button if user selected any option
  next_btn.focus();
}

function compWrongChar(answer, user) {
  var result = "<span style='color:blue'>";
  var correct = true;
  var word_cnt = 0;
  var correct_cnt = 0;
  var final_score = 0;
  for (var s = 0; s < answer.length; s++) {
    word_cnt++;
    if (s >= user.length) break;
    if (s > user.length || answer.substr(s, 1) != user.substr(s, 1)) {
      if (correct == true) {
        result = result + "</span><span style='color:red'>";
        correct = false;
      }
      if (s >= user.length) {
        result = result + answer.substr(s, 1);
      } else {
        result = result + user.substr(s, 1);
      }
    } else {
      correct_cnt++;
      if (correct == false) {
        result =
          result + "</span><span style='color:blue'>" + user.substr(s, 1);
        correct = true;
      } else result = result + user.substr(s, 1);
    }
  }
  final_score = (correct_cnt * 100) / word_cnt;
  result =
    result +
    "</span><span style='color:green'><br>" +
    "本題得分：" +
    Math.round(final_score);
  return result;
}

//if user clicked on option
function optionSelected(answer) {
  clearInterval(counter); //clear counter
  clearInterval(counterLine); //clear counterLine
  let userAns = answer.textContent.substr(2, answer.textContent.length - 2); //getting user selected option
  let correcAns = questions[que_count].answer; //getting correct answer from array
  const allOptions = option_list.children.length; //getting all option items

  if (answer === "correct") userAns = correcAns;

  if (userAns == correcAns) {
    //if user selected option is equal to array's correct answer
    userScore += 1; //upgrading score value with 1
    answer.classList.add("correct"); //adding green color to correct selected option
    answer.insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to correct selected option
    console.log("Correct Answer");
    console.log("Your correct answers = " + userScore);
    keepRightAnswer();
  } else {
    keepWrongAnswer();
    answer.classList.add("incorrect"); //adding red color to correct selected option
    answer.insertAdjacentHTML("beforeend", crossIconTag); //adding cross icon to correct selected option
    console.log("Wrong Answer");

    for (var i = 0; i < allOptions; i++) {
      if (
        option_list.children[i].textContent.substr(
          2,
          option_list.children[i].textContent.length - 2
        ) == correcAns
      ) {
        //if there is an option which is matched to an array answer
        option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
        option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
        console.log("Auto selected correct answer.");
      }
    }
  }
  for (i = 0; i < allOptions; i++) {
    option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
  }
  next_btn.classList.add("show"); //show the next button if user selected any option
  curStatus = "nextQues";
}

function keepRightAnswer() {
  var rightStorage = localStorage.getItem(curQuiz + "_right");
  if (
    rightStorage == null ||
    rightStorage == "undefined" ||
    rightStorage.length < 2
  ) {
    rightStorage = "," + questions[que_count].numb + ",";
  } else rightStorage = rightStorage + questions[que_count].numb + ",";
  localStorage.setItem(curQuiz + "_right", rightStorage);
}

function keepWrongAnswer() {
  var wrongStorage = localStorage.getItem(curQuiz + "_wrong");
  var tmpMessage;
  if (
    wrongStorage == null ||
    wrongStorage == "undefined" ||
    wrongStorage.length < 2
  ) {
    wrongStorage = "," + questions[que_count].numb + ",";
  } else {
    tmpMessage = questions[que_count].numb + ",";
    var checkMessage = "," + tmpMessage;
    if (wrongStorage.includes(checkMessage)) return;
    wrongStorage = wrongStorage + questions[que_count].numb + ",";
  }
  localStorage.setItem(curQuiz + "_wrong", wrongStorage);
}

function showResult() {
  quiz_box.classList.remove("activeQuiz"); //hide quiz box
  result_box.classList.add("activeResult"); //show result box
  if (curStatus == "allQuesPass") {
    return;
  }
  const scoreText = result_box.querySelector(".score_text");
  const resultICON = result_box.querySelector(".icon");

  //let final_score = Math.floor((userScore * 100) / questions.length);
  var tmpQuesCnt;
  if (questions.length > maxQuesCnt) tmpQuesCnt = maxQuesCnt;
  else tmpQuesCnt = questions.length;
  let final_score = Math.floor((userScore * 100) / ansQuesCnt);

  // if (myNewScore > myStorageScore)
  //   localStorage.setItem(selCategory + "_" + selLevel, myNewScore);

  if (final_score === 100) {
    // if user scored more than 3
    resultICON.innerHTML = '<i class="fas fa-crown"></i>';
    //creating a new span tag and passing the user score number and total question number
    let scoreTag =
      "<span>恭喜 " +
      userName.innerHTML +
      "🎉, 你得到 <p>" +
      final_score +
      "</p> 分 </span>";

    if (userScore == questions.length) {
      scoreTag += "<span>恭喜";
      scoreTag += userName.innerHTML;
      scoreTag +=
        " ! , 你完成本課程了！！！</span><span style='font-size:6rem;text-align:center'>";
      raiseStarLevel();
      for (var i = 0; i < curLevel; i++) {
        scoreTag += "🏆";
      }
      scoreTag += "</span>";
    }
    scoreText.innerHTML = scoreTag; //adding new span tag inside score_Text
  } else if (final_score >= 80) {
    // if user scored more than 1
    resultICON.innerHTML = '<i class="fas fa-grin-beam-sweat"></i>';
    let scoreTag =
      "<span>不錯 😎, 你得到 <p>" + final_score + "</p> 分 </span>";
    scoreText.innerHTML = scoreTag;
  } else {
    // if user scored less than 1
    resultICON.innerHTML = '<i class="fas fa-tired"></i>';
    let scoreTag =
      "<span>很可惜 😐, 你只得到 <p>" + final_score + "</p> 分 </span>";
    scoreText.innerHTML = scoreTag;
  }
}

function startTimer() {
  var timeSec = document.getElementsByClassName("timer_sec")[0];
  timeSec.innerHTML = quesTimer;
  counter = setInterval(timer, 1000);

  var d = new Date();
  startSecond = d.getTime();

  function timer() {
    var time;
    var d = new Date();
    nowSecond = d.getTime();
    time = quesTimer - Math.floor((nowSecond - startSecond) / 1000);
    if (time >= 0) timeCount.textContent = time; //changing the value of timeCount with time value
    if (time < 10 && time > 0) {
      //if timer is less than 9
      let addZero = timeCount.textContent;
      timeCount.textContent = "0" + addZero; //add a 0 before time value
    }
    if (time < 0) {
      //if timer is less than 0
      clearInterval(counter); //clear counter
      timeText.textContent = "時間到"; //change the time text to time off
      const allOptions = option_list.children.length; //getting all option items
      let correcAns = questions[que_count].answer; //getting correct answer from array
      for (i = 0; i < allOptions; i++) {
        if (option_list.children[i].textContent == correcAns) {
          //if there is an option which is matched to an array answer
          option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
          option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
          console.log("Time Off: Auto selected correct answer.");
        }
      }
      for (var i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
      }
      next_btn.classList.add("show"); //show the next button if user selected any option
    }
  }
}

function startTimerLine() {
  var tmpCount = 100;
  counterLine = setInterval(timer, tmpCount);
  var d = new Date();
  startMilisecond = d.getTime();
  miliWidth = quizWidth / quesTimer / 1000;

  function timer() {
    var d = new Date();
    nowMilisecond = d.getTime();

    var time;
    var oneStep = (nowMilisecond - startMilisecond) * miliWidth;

    time = Math.floor(oneStep);
    // time += 1; //upgrading time value with 1
    if (time > quizWidth) {
      //if time value is greater than 549
      time = quizWidth;
      clearInterval(counterLine); //clear counterLine
    }

    time_line.style.width = time + "px"; //increasing width of time_line with px by time value
  }
}

function queCounter(index) {
  //creating a new span tag and passing the question number and total question
  var tmpCorrect = correctCnt + userScore;
  var tmpTotal = correctCnt + questions.length;
  var tmpScore = (tmpCorrect * 100) / tmpTotal;
  let totalQueCounTag =
    "<span> 問題 (	&nbsp; <p>" +
    index +
    "</p> / <p>" +
    questions.length +
    " )" +
    " -- 總題數 (" +
    tmpTotal +
    ") 己答對 (" +
    tmpCorrect +
    "題) </p></span>";
  bottom_ques_counter.innerHTML = totalQueCounTag; //adding new span tag inside bottom_ques_counter
}

function keydown(e) {
  e.preventDefault();
  switch (e.code) {
    case "Enter":
      if (curStatus == "nextQues") {
        next_btn.click();
      }
      break;
    case "Digit1":
      if (curStatus == "choose") {
        document.getElementById("option1").click();
      }
      break;
    case "Digit2":
      if (curStatus == "choose") {
        document.getElementById("option2").click();
      }
      break;
    case "Digit3":
      if (curStatus == "choose") {
        document.getElementById("option3").click();
      }
      break;
    case "Digit4":
      if (curStatus == "choose") {
        document.getElementById("option4").click();
      }
      break;
    case "Digit5":
      if (curStatus == "choose") {
        document.getElementById("option5").click();
      }
      break;
    default:
      if (curStatus == "spell") {
        document.querySelector(".direct_input").value =
          document.querySelector(".direct_input").value + e.code;
      }
  }
}

function raiseStarLevel() {
  var i;
  var prevLevelStorage;
  var curLevelStorage;
  for (i = 3; i > 0; i--) {
    curLevelStorage = localStorage.getItem(cursubject + "_level_" + i);
    if (
      curLevelStorage == null ||
      curLevelStorage == "undefined" ||
      curLevelStorage.length < 2
    ) {
      prevLevelStorage = "";
      continue;
    }
    if (curLevelStorage.includes(curQuiz + ";")) {
      break;
    }
    prevLevelStorage = curLevelStorage;
  }
  curLevel = i;

  if (curLevel < 3) {
    curLevel++;
    prevLevelStorage = prevLevelStorage + curQuiz + ";";
    localStorage.setItem(cursubject + "_level_" + curLevel, prevLevelStorage);
  }
  localStorage.setItem(curQuiz + "_right", "");
  return;
}

//3. 播放器
function readSubtitles(srtFile) {
  subtitles = [];
  subTitleCnt = 0;

  if (checkFileExist(srtFile) == false) {
    alert("Quiz file [" + srtFile + "] does not exist.");
    return false;
  }

  var read = new XMLHttpRequest();
  read.open("GET", srtFile, false);
  read.setRequestHeader("Cache-Control", "no-cache");
  read.send();

  var displayName = read.responseText.replace(/’/g, "'");
  var quesArr = displayName.replace(/\r\n/g, "\n").split("\n");
  let quesCnt = quesArr.length;
  youtube_url = quesArr[0];

  for (let k = 0; k < quesCnt; k++) {
    if (quesArr[k].includes("-->")) {
      let subtitle = new Subtitle();
      subtitles.push(subtitle);
    }
  }
  if (subtitles.length < 1) return;

  subTitleCnt = 0;
  var nowStatus = 0; //0:nothing,1:start
  bRemainHighlight = false;
  for (let k = 0; k < quesCnt; k++) {
    if (quesArr[k].includes("-->")) {
      var timeArr = quesArr[k].split("-"); //00:01:01,440 --> 00:01:03,232
      subtitles[subTitleCnt].start = getSecond(timeArr[0]);
      var time2Arr = timeArr[2].split(">"); //00:01:01,440 --> 00:01:03,232
      subtitles[subTitleCnt].finish = getSecond(time2Arr[1]);
      subtitles[subTitleCnt].numb = subTitleCnt + 1;
      subtitles[subTitleCnt].content = "";
      nowStatus = 1;
    } else {
      if (nowStatus == 1) {
        if (quesArr[k].length == 0) {
          nowStatus = 0;
          subTitleCnt++;
        } else {
          if (quesArr[k].includes("<em>")) {
            bRemainHighlight = true;
          }
          subtitles[subTitleCnt].content =
            subtitles[subTitleCnt].content + " " + quesArr[k];
        }
      }
    }
  }

  // for (let k = 0; k < quesCnt; k++) {
  //   if (k % 4 == 0) {
  //     subtitles[subTitleCnt].numb = subTitleCnt + 1;
  //   }
  //   if (k % 4 == 1) {
  //     var timeArr = quesArr[k].split("-"); //00:01:01,440 --> 00:01:03,232
  //     subtitles[subTitleCnt].start = getSecond(timeArr[0]);
  //     var time2Arr = timeArr[2].split(">"); //00:01:01,440 --> 00:01:03,232
  //     subtitles[subTitleCnt].finish = getSecond(time2Arr[1]);
  //   }
  //   if (k % 4 == 2) {
  //     subtitles[subTitleCnt].content = quesArr[k];
  //     subTitleCnt = subTitleCnt + 1;
  //   }
  // }
}

function highlight_start(content) {
  var return_content;
  return_content = content;

  return_content = return_content.replaceAll(
    "<em>",
    "<span style='background-color:yellow'>"
  );
  return_content = return_content.replaceAll("</em>", "</span>");

  return return_content;
}

function showTable() {
  var modalContent = document.getElementById("modal-content-audio");
  var tmpAudio_sec_bottom = document.getElementById("audio_sec_bottom");
  if (tmpAudio_sec_bottom != null) {
    modalContent.removeChild(tmpAudio_sec_bottom);
  }

  /* 3. table */
  let t, th, c, r;
  t = document.createElement("table");
  t.setAttribute("class", "audio_table");
  t.setAttribute("id", "my_audio_table");

  var span = document.getElementById("closeAudio");
  span.addEventListener("click", closeAudio);

  var tableRowCnt = 0;
  for (let k = 0; k < subtitles.length; k++) {
    if (bRemainHighlight) {
      if (subtitles[k].content.includes("<em>")) {
        r = t.insertRow(-1);
        tableRowCnt++;
      } else {
        continue;
      }
    } else {
      r = t.insertRow(-1);
      tableRowCnt++;
    }

    r.setAttribute("class", "audio_table_row");
    if (k == 0) r.classList.add("table_font_highlight");
    else r.classList.remove("table_font_highlight");
    c = r.insertCell(-1);
    c.innerHTML = subtitles[k].numb;
    r.onclick = function () {
      selectRow(this);
    };
    c = r.insertCell(-1);
    c.innerHTML = highlight_start(subtitles[k].content);
  }

  if (tableRowCnt > 0) {
    th = t.createTHead();
    r = th.insertRow(0);
    c = r.insertCell(-1);
    c.style.width = "7%";
    c.innerHTML = "#";
    c = r.insertCell(-1);
    c.style.width = "93%";
    c.innerHTML = "句子";
    audio_sec_bottom = document.createElement("div");
    audio_sec_bottom.setAttribute("class", "audio_sec_bottom");
    audio_sec_bottom.setAttribute("id", "audio_sec_bottom");
    modalContent.appendChild(audio_sec_bottom);
    audio_sec_bottom.appendChild(t);
  }
}

function startAudio(curQuiz) {
  var bPlayerList = false;
  subtitles = [];
  //2.generate questions
  document.getElementById(curQuiz).classList.add("test-pressed");
  content.classList.add("slight_opacity");

  var curQuizArr = curQuiz.split("-");
  curQuizType = curQuizArr[0];

  // Get the modal
  var modal = document.getElementById("myAudio");

  var modalContent = document.getElementById("modal-content-audio");
  modalContent.setAttribute("Height", "200px");
  // When the user clicks on <span> (x), close the modal
  modal.style.display = "block";

  var curQuizArr = curQuiz.split("-");
  var curTopicArr = curQuizArr[1].split("_");
  var base_filename, audio_filename, selFile, txtFileName;

  var base_left_filename =
    "./data/" + curTopicArr[0] + "/" + curTopicArr[1] + "/" + curTopicArr[2];

  base_filename = base_left_filename + "/" + curTopicArr[3];

  /*read src file*/
  playlistCnt = 0;
  playlists = [];

  if (curQuiz.includes("Left@@@")) {
    bPlayerList = true;
    parseCsv(base_left_filename + "/all.csv");
    var detailCnt = quesArr.length;
    var r = Math.floor(Math.random() * detailCnt);
    var videoId = quesArr[r].split("=")[1].split("&")[0].split(",")[0];
    youtube_url = "https://www.youtube-nocookie.com/watch?v=" + videoId;

    for (var x = 0; x < quesArr.length; x++) {
      if (quesArr[x].length < 5) {
        continue;
      }
      let playlist = new Playlist();
      playlist.numb = playlistCnt + 1;
      playlist.content = quesArr[x].split(",")[1];
      playlist.video_id = quesArr[x].split(",")[2].split("=")[1].split("&")[0];
      playlists.push(playlist);
      playlistCnt++;
    }
  } else if (curTopicArr[3].includes("all@")) {
    var tmpID = curTopicArr[3]
      .split("@")[1]
      .replace(/&/g, "_")
      .replace(/~/g, "-");
    youtube_url = "https://www.youtube-nocookie.com/watch?v=" + tmpID;
  } else {
    readSubtitles(base_filename + ".srt");
  }

  modalContent.innerHTML =
    '<span class="close" id="closeAudio">&times;</span><p>';

  /* 2. audio player */
  var remainHighlight = document.createElement("input");
  remainHighlight.type = "checkbox";
  remainHighlight.name = "remainHighlight";
  remainHighlight.id = "remainHighlight";
  remainHighlight.classList.add("remainHighlight");
  remainHighlight.checked = bRemainHighlight;
  var lblRemainHighlight = document.createElement("label");
  lblRemainHighlight.innerText = "過濾只留重點列";
  lblRemainHighlight.classList.add("lblRemainHighlight");
  lblRemainHighlight.htmlFor = "remainHighlight";
  remainHighlight.onclick = function () {
    bRemainHighlight = remainHighlight.checked;
    showTable();
  };

  let audio_sec_top;
  audio_sec_top = document.createElement("div");

  if (curQuizType.includes("youtube")) {
    youtube_mode = true;
    audio = document.createElement("video");
  } else {
    youtube_mode = false;
    audio = document.createElement("audio");
    audio.setAttribute("controls", "true");
    audio.setAttribute("display", "true");
    audio.setAttribute("class", "audio");
    source = document.createElement("source");
  }

  var audio_filename;

  if (curQuizType.includes("youtube")) {
    audio_sec_top.classList.add("video_sec_top");
    // x.1. This code loads the IFrame Player API code asynchronously.
    var playerDiv = document.createElement("div");
    playerDiv.setAttribute("id", "player-div");
    playerDiv.classList.add("myPlayerDiv");
    var messageDiv = document.createElement("div");
    audio_sec_top.appendChild(playerDiv);

    // 秀上方訊息
    if (bRemainHighlight) {
      messageDiv.appendChild(remainHighlight);
      messageDiv.appendChild(lblRemainHighlight);
      messageDiv.classList.add("myMessageDiv");
      audio_sec_top.appendChild(messageDiv);
    }
    // 秀上方訊息-結束
    modalContent.appendChild(audio_sec_top);

    // 秀右邊縮圖
    var audio_sec_img = document.createElement("img");
    audio_sec_img.setAttribute("class", "category");
    audio_sec_img.setAttribute("src", "img/hangul_writing.png");

    var flex_container = document.createElement("div");
    flex_container.setAttribute("class", "flex-container");
    for (var z = 0; z < playlistCnt; z++) {
      let playlist = new Playlist();
      var src =
        "linear-gradient(to bottom, rgba(217,167,199,0.4), rgba(255,252,220,0.4)), url('https://img.youtube.com/vi/" +
        playlists[z].video_id +
        "/default.jpg'";

      var flex_box = document.createElement("div");
      flex_box.setAttribute("class", "flex-box");
      flex_box.style.backgroundImage = src;
      flex_box.innerText = playlists[z].content;
      flex_box.setAttribute("id", playlists[z].video_id);

      flex_box.addEventListener("click", function () {
        player.stopVideo();
        player.loadVideoById(this.id);
        player.playVideo();
      });

      flex_container.appendChild(flex_box);
    }

    if (bPlayerList) {
      var tmp_audio_sec_bottom = document.createElement("div");
      tmp_audio_sec_bottom.setAttribute("class", "audio_sec_bottom");
      tmp_audio_sec_bottom.appendChild(flex_container);
      modalContent.appendChild(tmp_audio_sec_bottom);
    }

    // 秀右邊縮圖--結束

    // 3. This function creates an <iframe> (and YouTube player)
    //    after the API code downloads.
    var videoId = youtube_url.split("=")[1].split("&")[0];

    window.YT.ready(function () {
      player = new window.YT.Player("player-div", {
        // height: YT_height,
        // width: YT_width,
        videoId: videoId,
        events: {
          onReady: onPlayerReady,
          // onStateChange: onPlayerStateChange,
        },
      });
    });

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(e) {
      e.target.playVideo();
      youtube_ready = true;
    }

    function stopVideo() {
      player.stopVideo();
    }

    function playVideo() {
      player.playVideo();
    }

    function forwardVideo() {
      // 先抓到目前秒數
      let current = e.target.getCurrentTime();
      // 前進10秒：目前秒數 + 10
      e.target.seekTo(current + 10);
    }
  } else {
    audio_sec_top.classList.add("audio_sec_top");
    if (curQuizType.includes("m4a")) {
      audio_filename = base_filename + ".m4a";
    } else {
      audio_filename = base_filename + ".mp3";
    }
    source.setAttribute("type", "audio/wav");
    source.setAttribute("src", audio_filename);
    audio.appendChild(source);
    audio_sec_top.appendChild(audio);

    modalContent.appendChild(audio_sec_top);
  }

  if (!curQuizType.includes("youtube")) {
    audio.load();
    audio.play();
  } else {
  }
  showTable();

  if (subtitles.length < 1) return; //no subtitle, exit

  const tbody = document.getElementById("my_audio_table");
  myAudioTableRow = document.getElementsByClassName("audio_table_row");

  autoRowSelected = 1;
  rowSelected = myAudioTableRow[autoRowSelected - 1];
  timeoutID = window.setInterval(handleAudioLoop, 50);
  // audio.addEventListener("timeupdate", function () {
  function handleAudioLoop() {
    let currentTime;

    /*pre-check*/
    if (subtitles.length <= 0) return;
    if (autoRowSelected > subtitles.length) return;
    /*pre-check*/

    if (youtube_mode) {
      if (!youtube_ready) return;
      if (player.getPlayerState() != YT.PlayerState.PLAYING) return;
      currentTime = player.playerInfo.currentTime;
    } else currentTime = audio.currentTime;

    if (!nowAudioLoop) {
      if (bRemainHighlight) return;
      if (currentTime > subtitles[autoRowSelected - 1].finish) {
        myAudioTableRow[autoRowSelected - 1].style.color = "blue";
        while (currentTime > subtitles[autoRowSelected].finish) {
          if (autoRowSelected < subtitles.length) {
            autoRowSelected++;
          }
        }

        myAudioTableRow[autoRowSelected].style.color = "red";
        autoRowSelected++;
        rowSelected = myAudioTableRow[autoRowSelected - 1];
        // alert("ben_debug_1639");
        var nowTop =
          (autoRowSelected - 1) * (audio_sec_bottom.scrollHeight / subTitleCnt);
        console.log("nowTop:" + nowTop);
        audio_sec_bottom.scrollTop =
          (autoRowSelected - 1) * (audio_sec_bottom.scrollHeight / subTitleCnt);
      }
    } else {
      if (currentTime > subtitles[autoRowSelected - 1].finish) {
        if (youtube_mode) {
          player.seekTo(Math.floor(subtitles[autoRowSelected - 1].start));
          // player.seekToMillis(subtitles[autoRowSelected - 1].start);
        } else {
          audio.pause();
          audio.currentTime = subtitles[autoRowSelected - 1].start;
          syncDelay(1000);
          audio.play();
        }
      }
    }
  }
}

function getSecond(inputTime) {
  var secondArr = inputTime.split(":");
  var hour = Number(secondArr[0]);
  var minute = Number(secondArr[1]);
  var second2Arr = secondArr[2].split(",");
  var second = Number(second2Arr[0]);
  var milliSecond = Number(second2Arr[1]);
  second = second + minute * 60 + hour * 3600 + milliSecond * 0.001;
  return second;
}

function selectRow(r) {
  if (rowSelected !== undefined) rowSelected.style.color = "blue";
  rowSelected = r;
  rowSelected.style.color = "red";
  var nowRow = Number(r.children[0].innerHTML);

  if (youtube_mode) {
    // player.stopVideo();
    // player.seekToMillis(subtitles[nowRow - 1].start);
    player.seekTo(Math.floor(subtitles[nowRow - 1].start));
  } else {
    audio.pause();
    audio.currentTime = subtitles[nowRow - 1].start;
    audio.play();
  }

  finishTime = subtitles[nowRow - 1].finish;

  if (nowAudioLoop) {
    if (autoRowSelected == nowRow) nowAudioLoop = !nowAudioLoop;
  } else nowAudioLoop = true;

  autoRowSelected = nowRow;
}

function closeAudio() {
  var modal = document.getElementById("myAudio");
  modal.style.display = "none";
  content.classList.remove("slight_opacity");
  disableBtnStatus(false);
  if (youtube_mode) {
    player.stopVideo();
  } else {
    audio.pause();
  }

  clearInterval(timeoutID);
  nowAudioLoop = false;
}

function syncDelay(milliseconds) {
  var start = new Date().getTime();
  var end = 0;
  while (end - start < milliseconds) {
    end = new Date().getTime();
  }
}

/*+++ Math Calc */
function changeVariable(inputString, varArr) {
  var newString;
  if (inputString === undefined) return inputString;
  newString = inputString.replaceAll("{a}", varArr[0]);
  newString = newString.replaceAll("{b}", varArr[1]);
  newString = newString.replaceAll("{c}", varArr[2]);
  // var debug_count = 0;
  while (newString.toString().indexOf("<") > -1) {
    // debug_count++;
    // if (debug_count > 10) {
    //   alert(debug_count + ":" + newString);
    //   break;
    // }
    var begin = newString.indexOf("<");
    var end = newString.indexOf(">");
    var length = newString.length;
    if (end < begin) {
      alert("no } match to {");
      break;
    }
    var calcString = newString.substring(begin + 1, end);
    // alert(inputString);
    // alert(varArr[0] + ":" + varArr[1] + ":" + varArr[2]);
    // alert(calcString);
    var resultString = eval(calcString);
    // alert(begin + ":" + end + ":" + length);
    if (begin == 0 && end == length - 1) {
      newString = resultString;
    } else if (begin == 0) {
      newString = resultString + newString.substring(end + 1, length);
    } else {
      newString =
        newString.substring(0, begin - 1) +
        resultString +
        newString.substring(end + 1, length);
    }
    // alert(newString);
  }

  return newString;
}
