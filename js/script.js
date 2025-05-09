/*history: test_0822_0120*/
import disableBtnStatus from "./common.js";
import game_focus from "./game_focus.js";
import game_match from "./game_match.js";
import loadWordChain from "./game_word_chain.js";
window.pronClick = pronClick;
window.confirmClick = confirmClick;
window.optionSelected = optionSelected;
//selecting all required elements
let arrPlayMode = [
	{ value: "ArticleStop", text: "整篇播放" },
	{ value: "SentenceStop", text: "單句停止" },
	{ value: "SentenceRepeat", text: "單句重覆" },
];
let playMode = 0;
let isMD = false;

//subtitleMode
let arrSubtitleMode = [
	{ value: "SingleSrt", text: "單一字幕" },
	{ value: "DoubleSrt", text: "雙字幕" },
	{ value: "MD", text: "文章筆記" },
];
let susplayMode = 0;

let subtitleMode = ""; //srt, md

let audio_sec_top;

const maxQuesCnt = 500;
const start_btn = document.querySelector(".test-button");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const select_list = document.querySelector(".select_list");
// const correct_list = document.querySelector(".correct_list");
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
	content_2;
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
let actualRow = 1;
let startTime, finishTime;
let nowAudioLoop = false;
let subtitles = [];
var subTitleCnt = 0;
let audio, source;
let autoRowSelected = 0;
let myAudioTableRow;
let bRemainHighlight = false;
let bHasHighlight = false;

//subtitleEditable
let bSubtitleEditable = false;
let bSmallWindows = false;
var windowWidth = window.innerWidth;
if (windowWidth < 600) {
	bSubtitleEditable = false;
	bSmallWindows = true;
}
let audio_sec_bottom;
let delBtn, insBtn, saveBtn, readBtn;

/*5.2 subtitle youtube */
let youtube_mode = false,
	youtube_ready = false;
var player;
let youtube_url;

/*5.3 subtitle audio */
let playlistCnt = 0;
let playlists = [];

let tableRowCnt;
//6.1. Set Search
let search_button = document.querySelectorAll(".search__button");
search_button[0].addEventListener("click", showSearch);

let search_input = document.getElementById("search__input");
search_input.addEventListener("input", showSearch);

let oldSearchValue = "";

//7.1. Set Selected
let curSelected = "";

let ansList = [];

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
	localStorage.setItem(curWeb + "lastCourse", curCourse);
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
	let left_test_mp3_links = document.querySelectorAll(".detail_left_subj_mp3");
	for (let i = 0; i < left_test_mp3_links.length; i++) {
		left_test_mp3_links[i].addEventListener("click", startLeftMp3);
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
			startQuiz
			// function () {
			// 	startAudio(conver_test_links[i].id);
			// },
			// false
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

	let left_test_mp3_links = document.querySelectorAll(".detail_left_subj_mp3");
	for (let i = 0; i < left_test_mp3_links.length; i++) {
		left_test_mp3_links[i].addEventListener("click", startLeftMp3);
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
			startQuiz
			// function () {
			// 	startAudio(conver_test_links[i].id);

			// },
			// false
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

let left_test_mp3_links = document.querySelectorAll(".detail_left_subj_mp3");
for (let i = 0; i < left_test_mp3_links.length; i++) {
	left_test_mp3_links[i].addEventListener("click", startLeftMp3);
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
		startQuiz
		// function () {
		// 	startAudio(conver_test_links[i].id);
		// },
		// false
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

// if Left button clicked
function startLeftMp3() {
	let tmpSubject = this.id.split("-")[1].split("_")[1];
	let tmpLesson = this.id.split("-")[1].split("_")[2];

	var numOfMp3 = this.parentNode.children[1].children.length;

	//let audioNum = t;
	var baseName = "./data/" + curCourse + "/" + tmpSubject + "/" + tmpLesson;
	var audioName;
	var audioFiles = [];

	const randomArray = new Array(numOfMp3);
	for (let i = 0; i < numOfMp3; i++) {
		// 生成 0 到 1 之间的随机数并乘以 10
		// 然后使用 Math.floor() 函数将其向下取整为整数
		randomArray[i] = Math.floor(Math.random() * numOfMp3);
	}

	for (let k = 0; k < numOfMp3; k++) {
		var tmpName =
			this.parentNode.children[1].children[
				randomArray[k]
			].children[0].children[0].children[0].children[0].id.split("_")[4];
		audioName = baseName + "/" + tmpName + ".mp3";
		// console.log("ok:" + audioName);
		audioFiles.push(audioName);
	}
	let currentIndex = 0;
	let audio = new Audio(audioFiles[currentIndex]);

	audio.addEventListener("ended", function () {
		currentIndex++;
		if (currentIndex < audioFiles.length) {
			audio.src = audioFiles[currentIndex];
			audio.play();
		}
	});

	audio.play();
}

// if startQuiz button clicked
function startQuiz() {
	que_count = 0;
	userScore = 0; //upgrading score value with 1
	que_numb = 1;
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

	//0.2. disable all test buttons
	//0.直接聽錄音
	if (curQuizType.startsWith("conversation")) {
		startAudio(this.id);
		return;
	}

	if (curQuizType == "game_focus") {
		game_focus();
		return;
	}
	if (curQuizType == "game_match") {
		game_match(curQuiz);
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

	var base_left_filename = "./";

	if (curWeb.includes("computer")) {
		base_left_filename = "./computer/";
	}

	var base_left_filename =
		base_left_filename +
		"data/" +
		curTopicArr[0] +
		"/" +
		curTopicArr[1] +
		"/" +
		curTopicArr[2];

	var fileNameArr = curTopicArr[3].split("^");
	base_filename = base_left_filename + "/" + fileNameArr[0];

	if (
		curQuizType.includes("conversation_m4a") ||
		curQuizType.includes("conversation_mp3")
	) {
		subtitleMode = "SingleSrt";
		parseSrt(base_filename + ".srt");
	} else {
		subtitleMode = "MD";
		parseCsv(base_filename + ".md");
	}

	modalContent.innerHTML = '<span class="close">&times;</span><p>';

	var wrongStorage = localStorage.getItem(curQuiz + "_wrong");
	if (wrongStorage == null || wrongStorage == "undefined")
		wrongStorage = "nothing";
	let tmpMessage = "";

	var quesList = [];
	let quesCnt = quesArr.length;
	ansList = [];
	let tmpCnt = 0;
	for (let k = 0; k < quesCnt; k++) {
		if (quesArr[k].length < 2) continue;
		if (
			curQuizType.includes("conversation_m4a") ||
			curQuizType.includes("conversation_mp3")
		) {
			if (!quesArr[k].includes("[")) {
				continue;
			}
		}
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

// const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

// if restartQuiz button clicked
// restart_quiz.onclick = () => {
// 	localStorage.setItem(curQuiz + "_right", "");
// 	result_box.classList.remove("activeResult"); //show result box
// 	content.classList.remove("slight_opacity");
// 	disableBtnStatus(false);
// 	return;
// };

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
		if (subtitles[k].content.length < 2) continue;
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

	// var
	var curTopicArr;
	if (curQuizArr[1].includes("(")) {
		curTopicArr = curQuizArr[1].split(/_()/);
	} else {
		curTopicArr = curQuizArr[1].split(/_/);
	}

	curQuizType = curQuizArr[0];

	var base_left_filename = "./";

	if (curWeb.includes("computer")) {
		base_left_filename = "./computer/";
	}

	var base_left_filename =
		base_left_filename +
		"data/" +
		curTopicArr[0] +
		"/" +
		curTopicArr[1] +
		"/" +
		curTopicArr[2];

	base_filename = base_left_filename + "/" + curTopicArr[3];

	if (
		curQuizType.includes("conversation_m4a") ||
		curQuizType.includes("conversation_mp3") ||
		curQuizType.includes("conversation_youtube")
	) {
		subtitleMode = "SingleSrt";
		parseSrt(base_filename + ".srt");
	} else if (curQuizType.includes("conversation_lesson")) {
		subtitleMode = "MD";
		parseCsv(base_filename + ".md");
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
		if (curQuizType.includes("conversation")) {
			if (!quesArr[k].includes("[")) continue;
		}
		tmpMessage = k + ",";
		var checkMessage = "," + tmpMessage;
		if (rightStorage.includes(checkMessage)) {
			correctCnt++;
			continue;
		}
		tmpArr.push(tmpMessage + quesArr[k]);
	}
	quesArr = tmpArr;
	quesCnt = tmpArr.length;
	if (quesCnt == 0) {
		alert("錯誤！！沒有任何的題目");
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
				singQuesArr[x] = changeVariable(singQuesArr[x], varArr);
			}
		}

		/*prepare question & answers*/
		if (
			curQuizType.includes("conversation") ||
			(curQuizType == "spell" && singQuesArr[0].includes("["))
		) {
			var tmpQues = singQuesArr[0];
			question.question = '<span style="color:blue;font-size:20px;">';
			question.answer = "";
			while (tmpQues.includes("[")) {
				var tmpStart = tmpQues.indexOf("[");
				var tmpEnd = tmpQues.indexOf("]");
				var tmpNewQues;

				question.question =
					question.question + tmpQues.substr(0, tmpStart) + "[";

				for (var z = 0; z < tmpEnd - tmpStart - 1; z++) {
					if (tmpQues.substr(tmpStart + z + 1, 1) == " ")
						question.question = question.question + "_";
					else question.question = question.question + "X";
				}
				question.question = question.question + "]";
				if (question.answer.length > 0) question.answer += " / ";
				question.answer =
					question.answer + tmpQues.substr(tmpStart + 1, tmpEnd - tmpStart - 1);

				if (tmpQues.length > tmpEnd) {
					var tmpNewQues = tmpQues.substr(tmpEnd + 1, tmpQues.length - tmpEnd);
					if (tmpNewQues.includes("[")) {
						tmpQues = tmpNewQues;
					} else {
						question.question = question.question + tmpNewQues;
						tmpQues = "";
					}
				} else tmpQues = "";
				question.quizType = "spell";
			}
			question.question =
				question.question +
				"</span> : " +
				'<span style="color:grey;font-size:20px;">' +
				singQuesArr[1] +
				"</span>";

			if (curQuizType.includes("conversation")) {
				question.quizType = "audio";
				question.option1 = singQuesArr[2];
				question.option2 = singQuesArr[3];
			}

			quesTimer = 60;
		} else if (
			curQuizType == "spell" ||
			singQuesArr[2] == "--" ||
			curQuizType.includes("conversation")
		) {
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
		} else if (curQuizType == "rearrange") {
			question.question = singQuesArr[0];
			question.answer = singQuesArr[0];
			question.quizType = "rearrange";
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
	let inputAnswer = "";
	let correctAnswer = "";
	document.querySelector("#confirmButton").disabled = "true";
	if (curQuesType === "direct_input") {
		var ansCnt = questions[que_count].answer.split("/").length;
		for (var j = 0; j < ansCnt; j++) {
			if (j > 0) inputAnswer = inputAnswer + " / ";
			inputAnswer =
				inputAnswer +
				document
					.querySelector("#direct_input" + j.toString())
					.value.toLowerCase()
					.trim();
		}
		correctAnswer = questions[que_count].answer.toString().toLowerCase();
	} else {
		correctAnswer = questions[que_count].question
			.toString()
			.toLowerCase()
			.replace(".mp3", "");
	}
	userInputAns = inputAnswer;

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

	// correct_list.innerHTML = "";
	select_list.innerHTML = "";

	if (
		questions[index].quizType == "spell" ||
		questions[index].quizType == "audio"
	) {
		curStatus = "spell";
		var ansCnt = questions[index].answer.split("/").length;
		let answer_target = "";
		for (var j = 0; j < ansCnt; j++) {
			answer_target =
				answer_target +
				'<span><input type="text" class="direct_input" name="direct_input" id="direct_input' +
				j.toString() +
				'" value="" placeholder="輸入答案" style="width:200px;height:40px;font-size:20px;padding:10px;margin:5px"></span>';
		}
		answer_target +=
			"<span> <button id='confirmButton' onclick='confirmClick()' style='width:70px;height:40px;' >確認</button></span> ";
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
	} else if (questions[index].quizType == "rearrange") {
		let answer_target = '<div class="option">';
		let answer_option = '<div class="answer" "option">';
		const sentence = questions[index].answer;
		// let wordArr = sentence.split(/([,.\s])/);
		let wordArr = sentence.split("");
		let option_tag;

		let finalWordArr = [];
		for (const word of wordArr) {
			if (word !== " " && word !== "") {
				finalWordArr.push(word);
			}
		}
		let i = 0;
		for (const word of finalWordArr) {
			answer_target += '<span class="target';
			answer_target += " target" + String(i) + '"';
			answer_target += ">&nbsp;</span>";
			questions[index].direct_answers[i++] = word;
		}

		ansList = [];
		while (ansList.length < finalWordArr.length) {
			var r = Math.floor(Math.random() * finalWordArr.length);
			if (ansList.indexOf(r) === -1) ansList.push(r);
		}
		console.log(ansList);
		for (i = 0; i < finalWordArr.length; i++) {
			answer_option += '<span class="my_option"';
			answer_option += ' class="select' + i + '" >';
			answer_option += finalWordArr[ansList[i]];
			answer_option += "</span>";
		}
		console.log(answer_option);
		answer_option += "</div>";
		option_list.innerHTML = answer_target;
		select_list.innerHTML = answer_option;
		// correct_list.innerHTML = "";
		console.log(answer_option);

		for (i = 0; i < finalWordArr.length; i++) {
			answer_option += '<span class="my_option">';
			answer_option += finalWordArr[ansList[i]];
			answer_option += "</span>";
		}

		const answer_options = document.querySelectorAll(".my_option");
		let answer_result = true;
		for (let i = 0; i < answer_options.length; i++) {
			answer_options[i].addEventListener("click", function () {
				let tmpClassName = ".target" + String(nowCursorFocus);
				document.querySelector(tmpClassName).innerText = this.innerText;
				nowCursorFocus++;
				if (nowCursorFocus === answer_options.length) {
					for (let j = 0; j < answer_options.length; j++) {
						if (
							document.querySelector(".target" + String(j)).innerText !==
							questions[index].direct_answers[j]
						) {
							answer_result = false;
						}
					}
					if (answer_result === true) directSelected("correct");
					else directSelected("incorrect");
				}
			});
		}
		const option = option_list.querySelectorAll(".option");

		// set onclick attribute to all available options
		for (i = 0; i < option.length; i++) {
			option[i].setAttribute("onclick", "optionSelected(this)");
		}
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
			var ansCnt = correctAns.split("/").length;
			for (var j = 0; j < ansCnt; j++) {
				document.querySelector(
					"#direct_input" + j.toString()
				).style.backgroundColor = "green";
			}
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
		keepRightAnswer();
	} else {
		keepWrongAnswer();
		answer.classList.add("incorrect"); //adding red color to correct selected option
		answer.insertAdjacentHTML("beforeend", crossIconTag); //adding cross icon to correct selected option

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

			var starMessage;
			if (curQuiz.startsWith("test_")) {
				starMessage = document.getElementById(
					curQuiz.substr(5, curQuiz.length - 5) + "_star"
				);
			} else {
				starMessage = document.getElementById(curQuiz + "_star");
			}
			starMessage.innerText = showStar(curLevel);
		}
		scoreText.innerHTML = scoreTag; //adding new span tag inside score_Text
	} else if (final_score >= 90) {
		// if user scored more than 1
		resultICON.innerHTML = '<i class="fas fa-grin-beam-sweat"></i>';
		let scoreTag =
			"<span>不錯 😎, 你得到 <p>" + final_score + "</p> 分 </span>";
		scoreText.innerHTML = scoreTag;
	} else {
		// if user scored less than 1
		reduceStarLevel();
		var starMessage;
		if (curQuiz.startsWith("test_")) {
			starMessage = document.getElementById(
				curQuiz.substr(5, curQuiz.length - 5) + "_star"
			);
		} else {
			starMessage = document.getElementById(curQuiz + "_star");
		}
		starMessage.innerText = showStar(curLevel);

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

function reduceStarLevel() {
	var i;
	var curLevelStorage;
	for (i = 3; i > 0; i--) {
		curLevelStorage = localStorage.getItem(cursubject + "_level_" + i);
		if (
			curLevelStorage == null ||
			curLevelStorage == "undefined" ||
			curLevelStorage.length < 2
		) {
			continue;
		}
		if (curLevelStorage.includes(curQuiz + ";")) {
			break;
		}
	}
	curLevel = i;
	if (curLevel > 0) {
		curLevelStorage = curLevelStorage.replaceAll(curQuiz + ";", "");
		localStorage.setItem(cursubject + "_level_" + curLevel, curLevelStorage);
		curLevel--;
	}
	localStorage.setItem(curQuiz + "_right", "");
	return;
}

//3. 播放器
function readSubtitles(srtFile) {
	if (srtFile.includes("all@")) {
		var srtArr = srtFile.split("@");
		srtFile = srtArr[0].replace(/all/g, "") + srtArr[srtArr.length - 1];
	}
	if (checkFileExist(srtFile) == false) {
		let subtitle = new Subtitle();
		subtitle.numb = 1;
		subtitle.content = "";
		subtitle.content2 = "";
		subtitle.content3 = "";
		subtitle.content4 = "";
		subtitles.push(subtitle);
		return false;
	}
	var read = new XMLHttpRequest();
	read.open("GET", srtFile, false);
	read.setRequestHeader("Cache-Control", "no-cache");
	read.send();
	var displayName = read.responseText;
	// var displayName = read.responseText.replace(/’/g, "'");
	// var quesArr = displayName.replace(/\r\n/g, "\n").split("\n");
	// youtube_url = quesArr[0];

	setSubtitles(displayName);
}

function add_new_line(line1, line2) {
	var resultStr;
	if (line2.length < 2) return line1;

	if (line1.length > 0) {
		resultStr = line1;
		if (bSmallWindows) {
			if (line1.includes("*")) {
				resultStr += "<br>";
			}
			resultStr += " * ";
		} else {
			if (line1.includes("▪")) {
				resultStr += "<br>";
			}
			//resultStr += "&#20;&#20;▪ ";
			resultStr += "▪ ";
		}

		resultStr += line2;
	} else {
		resultStr = "<h4>" + line2 + "</h4>";
	}
	return resultStr;
}

function setSubtitles(contents) {
	subtitles = [];
	subTitleCnt = 0;
	var quesArr = contents.replace(/\r\n/g, "\n").split("\n");
	let quesCnt = quesArr.length;
	let adjustTime = 0;
	var subColCnt = 1;
	if (quesCnt <= 0) return;

	for (let k = 0; k < quesCnt; k++) {
		if (quesArr[k].includes("(adjust)")) {
			var timeArr = quesArr[k].split("-");
			if (quesArr[k].includes("(minus)")) {
				adjustTime = getSecond(timeArr[1]) * -1;
			} else if (quesArr[k].includes("(add)")) {
				adjustTime = getSecond(timeArr[1]);
			}
		}
		if (subtitleMode.includes("Srt")) {
			if (quesArr[k].includes("-->")) {
				let subtitle = new Subtitle();
				subtitles.push(subtitle);
			}
		} else if (subtitleMode.includes("Csv")) {
			if (quesArr[k].length < 2) continue;
			let subtitle = new Subtitle();
			subtitles.push(subtitle);
		} else if (subtitleMode.includes("MD")) {
			if (quesArr[k].startsWith("#")) {
				if (quesArr[k].includes("#Subtitle4")) {
					continue;
				}
				let subtitle = new Subtitle();
				subtitle.content = "";
				subtitle.content2 = "";
				subtitle.content3 = "";
				subtitle.content4 = "";
				subtitles.push(subtitle);
			}
		}
	}

	subTitleCnt = 0;
	var nowStatus = 0; //0:nothing,1:start

	bRemainHighlight = false;
	bHasHighlight = false;
	var bSubtitle2 = false;
	var bSubtitle4 = false;
	for (let k = 0; k < quesCnt; k++) {
		/*judge double subtitles */
		if (quesArr[k].includes("#Subtitle2")) {
			subtitleMode = "DoubleSrt";
		}
		if (quesArr[k].includes("#Subtitle4")) {
			subtitleMode = "MD4";
			continue;
		}
		/*end*/
		if (subtitleMode.includes("Srt") && quesArr[k].includes("-->")) {
			subTitleCnt++;
			var timeArr = quesArr[k].split("-"); //00:01:01,440 --> 00:01:03,232
			subtitles[subTitleCnt - 1].start = getSecond(timeArr[0]) + adjustTime;
			var time2Arr = timeArr[2].split(">"); //00:01:01,440 --> 00:01:03,232
			subtitles[subTitleCnt - 1].finish = getSecond(time2Arr[1]) + adjustTime;
			subtitles[subTitleCnt - 1].numb = subTitleCnt;
			subtitles[subTitleCnt - 1].content = "";
			subtitles[subTitleCnt - 1].content2 = "";
			nowStatus = 1;
			bSubtitle2 = false;
		} else if (subtitleMode.includes("Csv")) {
			var subtitleArr = quesArr[k].split("\t");
			if (subtitleArr.length < 2) continue;
			subTitleCnt++;
			subtitles[subTitleCnt - 1].numb = subTitleCnt;
			subtitles[subTitleCnt - 1].start = getSecond(subtitleArr[1]) + adjustTime;
			subtitles[subTitleCnt - 1].finish =
				getSecond(subtitleArr[2]) + adjustTime;
			subtitles[subTitleCnt - 1].content = subtitleArr[3];
			if (subtitleArr.length > 4) {
				subtitles[subTitleCnt - 1].content2 = subtitleArr[4];
				if (k == 0) subColCnt = 2;
			}
		} else if (subtitleMode.includes("MD") && quesArr[k].startsWith("#")) {
			// if (nowStatus == 1) {
			subTitleCnt++;
			// }
			subtitles[subTitleCnt - 1].numb = subTitleCnt;
			nowStatus = 1;
			if (!subtitleMode.includes("MD4")) {
				subtitles[subTitleCnt - 1].content = quesArr[k];
			}
		} else {
			if (nowStatus == 1 && quesArr[k] != undefined) {
				if (subtitleMode.includes("Srt") && quesArr[k].length == 0) {
					nowStatus = 0;
					// subTitleCnt++;
				} else {
					// if (subtitles[subTitleCnt].content.length > 0)
					//   subtitles[subTitleCnt].content += "\n";
					if (subtitleMode.includes("DoubleSrt")) {
						var contentArr = quesArr[k].split("--"); //00:01:01,440 --> 00:01:03,232
						if (contentArr.length > 1) {
							subtitles[subTitleCnt - 1].content += contentArr[0];
							subtitles[subTitleCnt - 1].content2 += contentArr[1];
							bSubtitle2 = true;
						} else {
							if (k < quesCnt - 1) {
								if (quesArr[k + 1].includes("-->")) {
									continue;
								}
							}
							if (bSubtitle2) {
								if (subtitles[subTitleCnt - 1].content2.length > 0)
									subtitles[subTitleCnt - 1].content2 += "<br>";
								subtitles[subTitleCnt - 1].content2 += quesArr[k];
							} else {
								if (subtitles[subTitleCnt - 1].content.length > 0)
									subtitles[subTitleCnt - 1].content += "<br>";
								subtitles[subTitleCnt - 1].content += quesArr[k];
							}
						}
					} else if (subtitleMode.includes("MD4")) {
						var contentArr = quesArr[k].split("--");
						if (contentArr.length > 1) {
							subtitles[subTitleCnt - 1].content = add_new_line(
								subtitles[subTitleCnt - 1].content,
								contentArr[0]
							);
							subtitles[subTitleCnt - 1].content2 = add_new_line(
								subtitles[subTitleCnt - 1].content2,
								contentArr[1]
							);
							subtitles[subTitleCnt - 1].content3 = add_new_line(
								subtitles[subTitleCnt - 1].content3,
								contentArr[2]
							);
							subtitles[subTitleCnt - 1].content4 = add_new_line(
								subtitles[subTitleCnt - 1].content4,
								contentArr[3]
							);
							bSubtitle4 = true;
						}
					} else {
						if (subtitles[subTitleCnt - 1].content.length > 0) {
							subtitles[subTitleCnt - 1].content += "\n";
						}
						subtitles[subTitleCnt - 1].content += quesArr[k];
					}
					// if (quesArr[k].includes("[[") && quesArr[k].includes("]]")) {
					// 	bHasHighlight = true;
					// }
					if (quesArr[k].includes("[") && quesArr[k].includes("]")) {
						bHasHighlight = true;
					}
				}
			}
		}
	}
	//add one line if last line's content is not null
	if (subTitleCnt < 1) {
		alert("No subtitles inside");
		return;
	}

	if (subtitleMode == "Csv") {
		if (subColCnt == 2) subtitleMode = "DoubleSrt";
	}

	// if (subtitleMode.includes("MD")) {
	//   subTitleCnt++;
	// }
	if (subtitles[subTitleCnt - 1].content.length > 0) {
		let subtitle = new Subtitle();
		subtitles.push(subtitle);
		subtitles[subTitleCnt].numb = subTitleCnt + 1;
		subtitles[subTitleCnt].start = subtitles[subTitleCnt - 1].finish;
		subtitles[subTitleCnt].finish = subtitles[subTitleCnt - 1].finish;
		subtitles[subTitleCnt].content = "";
		subtitles[subTitleCnt].content2 = "";
		subtitles[subTitleCnt].content3 = "";
		subtitles[subTitleCnt].content4 = "";
		subTitleCnt++;
	}
}

function highlight_start(lineno, content) {
	var return_content;

	if (content == null) return content;
	if (content.length == 0) return content;
	return_content = "";
	//	alert(content);
	if (isMD) {
		content = marked.parse(content);
		return content;
	}

	var lineArr = content.replace(/\r\n/g, "\n").split("\n");

	var tmpColor;
	if (lineno % 2 == 1) {
		tmpColor = "DDD";
	} else {
		tmpColor = "EEE";
	}

	for (var x = 0; x < lineArr.length; x++) {
		var line_content = lineArr[x];

		if (bSubtitleEditable) {
			return_content = return_content + line_content + "<br>";
			continue;
		}

		if (line_content.startsWith("[A]")) {
			line_content =
				'反白右側文字看答案：<span style="color:#' +
				tmpColor +
				'">' +
				line_content.substr(3, line_content.length - 3) +
				"</span>";
		}

		var html;
		if (!subtitleMode.includes("MD4")) {
			//output.innerHTML = marked.parse(input.value);
			//const converter = new showdown.Converter();
			//html = converter.makeHtml(line_content);
			//			alert(line_content);
			//html = marked.parse(line_content);
			html = line_content;
		} else {
			html = line_content;
		}
		line_content = html;
		//alert(line_content);
		//1.replace <image.jpg>
		if (line_content.includes(".jpg>")) {
			var tmpImageName = line_content.substr(
				line_content.indexOf("<img:") + 5,
				line_content.indexOf(".jpg") - line_content.indexOf("<img:")
			);
			var tmpImageString =
				'<img style="display:block;" width="100%" object-fill="scale-down" src="./data/image/' +
				tmpImageName.substring(0, 1) +
				"/";
			line_content = line_content.replaceAll("<img:", tmpImageString);
			line_content = line_content.replaceAll(".jpg>", '.jpg"></img>');
		}
		//2.replace []
		var tmpWhiteString = "<span style='color:#" + tmpColor + "'>";
		line_content = line_content.replaceAll(
			"[",
			"<span style='background-color:yellow'>"
		);
		line_content = line_content.replaceAll("]", "</span>");

		return_content += line_content;
	}

	return return_content;
}

function showTable(isMedia) {
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

	tableRowCnt = 0;
	for (let k = 0; k < subtitles.length; k++) {
		if (bRemainHighlight) {
			if (subtitles[k].content.includes("[")) {
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
		//1.行號
		c = r.insertCell(-1);
		c.innerHTML = subtitles[k].numb;
		c.onclick = function () {
			selectRow(this, 0);
		};
		if (bSmallWindows) {
			c.style.display = "none";
		}

		//2.開始時間
		c = r.insertCell(-1);
		c.innerHTML = changeTimeString(subtitles[k].start);
		c.classList.add("audio_table_time_column");
		c.onclick = function () {
			setSubtitleTime(this, 1);
		};
		if (bSubtitleEditable == false || isMedia == false) {
			c.style.display = "none";
		}

		//3.結束時間
		c = r.insertCell(-1);
		c.classList.add("audio_table_time_column");
		c.innerHTML = changeTimeString(subtitles[k].finish);
		c.onclick = function () {
			setSubtitleTime(this, 2);
		};
		if (bSubtitleEditable == false || isMedia == false) {
			c.style.display = "none";
		}

		//4.句子1
		c = r.insertCell(-1);
		c.onclick = function () {
			selectRow(this, 3);
		};
		c.onkeyup = function () {
			changeRow(this);
		};
		c.innerHTML = highlight_start(k, subtitles[k].content);

		//5.句子2
		if (subtitleMode.includes("DoubleSrt") || subtitleMode.includes("MD4")) {
			c = r.insertCell(-1);
			c.onclick = function () {
				selectRow(this, 4);
			};
			c.onkeyup = function () {
				changeRow(this);
			};
			c.innerHTML = highlight_start(k, subtitles[k].content2);
			if (subtitleMode.includes("MD4")) {
				c = r.insertCell(-1);
				c.onclick = function () {
					selectRow(this, 5);
				};
				c.onkeyup = function () {
					changeRow(this);
				};
				c.innerHTML = subtitles[k].content3;
				c = r.insertCell(-1);
				c.onclick = function () {
					selectRow(this, 6);
				};
				c.onkeyup = function () {
					changeRow(this);
				};
				c.innerHTML = subtitles[k].content4;
			}
		}
	}

	th = t.createTHead();
	r = th.insertRow(0);
	c = r.insertCell(-1);
	c.style.width = "4%";
	c.innerHTML = "#";
	if (bSmallWindows) {
		c.style.display = "none";
	}

	if (bSubtitleEditable == true && isMedia == true) {
		c = r.insertCell(-1);
		c.style.width = "10%";
		c.innerHTML = "開始";
		c = r.insertCell(-1);
		c.style.width = "10%";
		c.innerHTML = "結束";
	}

	c = r.insertCell(-1);
	if (subtitleMode.includes("MD4")) {
		c.style.width = "19%";
		c.innerHTML = "中文";
		c = r.insertCell(-1);
		c.style.width = "19%";
		c.innerHTML = "英文";
		c = r.insertCell(-1);
		c.style.width = "19%";
		c.innerHTML = "日文";
		c = r.insertCell(-1);
		c.style.width = "19%";
		c.innerHTML = "韓文";
	} else if (subtitleMode.includes("DoubleSrt")) {
		c.style.width = "38%";
		c.innerHTML = "句子1";
		c = r.insertCell(-1);
		c.style.width = "38%";
		c.innerHTML = "句子2";
	} else {
		c.style.width = "76%";
		c.innerHTML = "句子";
	}

	audio_sec_bottom = document.createElement("div");
	audio_sec_bottom.setAttribute("class", "audio_sec_bottom");
	if (isMedia == true) {
		audio_sec_bottom.classList.add("audio_sec_bottom_height");
	} else {
		audio_sec_bottom.classList.add("lesson_sec_bottom_height");
	}
	audio_sec_bottom.setAttribute("id", "audio_sec_bottom");
	modalContent.appendChild(audio_sec_bottom);
	audio_sec_bottom.appendChild(t);
	// }

	if (!bSubtitleEditable && tableRowCnt == 0) t.style.display = "none";
}

function resetTableNum() {
	var table = document.getElementById("my_audio_table");
	for (var i = 1, row; (row = table.rows[i]); i++) {
		row.cells[0].innerText = i;
	}
}

const downloadToFile = (content, filename, contentType) => {
	const a = document.createElement("a");
	const file = new Blob([content], { type: contentType });

	a.href = URL.createObjectURL(file);
	a.download = filename;
	a.click();

	URL.revokeObjectURL(a.href);
};

function saveTableContent() {
	var subContent = "";
	// subContent = youtube_url + "\n";
	subContent = subContent + getTableContent();

	downloadToFile(subContent, "1.txt", "text/plain");
}

function getTableContent() {
	var tableContent = "";
	var table = document.getElementById("my_audio_table");

	// tableContent = youtube_url + "\n";
	if (subtitleMode.includes("DoubleSrt")) {
		tableContent = "#Subtitle2\n";
	}

	for (var i = 1, row; (row = table.rows[i]); i++) {
		tableContent = tableContent + row.cells[0].innerText + "\n";
		tableContent =
			tableContent +
			row.cells[1].innerText +
			" --> " +
			row.cells[2].innerText +
			"\n";
		tableContent = tableContent + row.cells[3].innerText;
		if (subtitleMode.includes("DoubleSrt")) {
			tableContent = tableContent + " -- " + row.cells[4].innerText;
		}
		tableContent = tableContent + "\n\n";
	}
	return tableContent;
}

function readTableContent(isMedia) {
	var fileSelector = document.createElement("input");
	fileSelector.setAttribute("type", "file");
	fileSelector.click();

	fileSelector.onchange = function () {
		var file = this.files[0];
		if (file) {
			const reader = new FileReader();
			if (file.name.includes("csv")) subtitleMode = "Csv";
			reader.readAsText(file, "UTF-8");
			reader.onload = (evt) => {
				var fileContent = evt.target.result;
				setSubtitles(fileContent);
				showTable(isMedia);
			};
			reader.onerror = (evt) => {
				alert("error");
			};
		}
	};
}

function insertTableRow(insNum) {
	var table = document.getElementById("my_audio_table");
	var rNew = table.insertRow(insNum);
	rNew.setAttribute("class", "audio_table_row");
	//1.行號
	var cNew = rNew.insertCell(-1);
	cNew.innerHTML = insNum;
	//2.開始時間
	cNew = rNew.insertCell(-1);
	if (insNum > 1) {
		cNew.innerHTML = table.rows[insNum - 1].cells[2].innerText;
	}
	cNew.onclick = function () {
		setSubtitleTime(this, 1);
	};
	//3.結束時間
	cNew = rNew.insertCell(-1);

	if (insNum < table.rows.length - 1) {
		cNew.innerHTML = table.rows[insNum + 1].cells[1].innerText;
	}
	cNew.onclick = function () {
		setSubtitleTime(this, 2);
	};

	//4.句子1
	cNew = rNew.insertCell(-1);
	cNew.onclick = function () {
		selectRow(this, 3);
	};
	cNew.onkeyup = function () {
		changeRow(this);
	};

	cNew.setAttribute("contenteditable", "true");
	//5.句子2
	if (subtitleMode.includes("DoubleSrt") || subtitleMode.includes("MD4")) {
		cNew = rNew.insertCell(-1);
		cNew.onclick = function () {
			selectRow(this, 4);
		};
		cNew.onkeyup = function () {
			changeRow(this);
		};
		cNew.setAttribute("contenteditable", "true");
		if (subtitleMode.includes("MD4")) {
			cNew = rNew.insertCell(-1);
			cNew.onclick = function () {
				selectRow(this, 5);
			};
			cNew.onkeyup = function () {
				changeRow(this);
			};
			cNew.setAttribute("contenteditable", "true");

			cNew = rNew.insertCell(-1);
			cNew.onclick = function () {
				selectRow(this, 6);
			};
			cNew.onkeyup = function () {
				changeRow(this);
			};
			cNew.setAttribute("contenteditable", "true");
		}
	}
}

function startAudio(curQuiz) {
	var bPlayerList = false;
	var isMedia = true;
	var imageName = "";
	subtitles = [];
	isMD = false;
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

	var videoID;
	if (curQuiz.includes("Left@@@") || curQuiz.includes("all@")) {
		videoID = curQuiz.split("@")[1];
	} else {
		videoID = curQuiz.split("-")[1].split("_")[3];
	}

	videoID = videoID.replace(/&/g, "_").replace(/~/g, "-");
	var srtID = curQuiz.split("@")[2];

	var curQuizArr = curQuiz.split("-");

	var curTopicArr = curQuizArr[1].split("_");

	var base_filename, audio_filename, selFile, txtFileName;

	var base_left_filename = "./";

	if (curWeb.includes("computer")) {
		base_left_filename = "./computer/";
	}

	var base_left_filename =
		base_left_filename +
		"data/" +
		curTopicArr[0] +
		"/" +
		curTopicArr[1] +
		"/" +
		curTopicArr[2];

	if (curTopicArr.length > 3) {
		if (curTopicArr[3].includes("^")) {
			var fileNameArr = curTopicArr[3].split("^");
			base_filename = base_left_filename + "/" + fileNameArr[0];
			if (fileNameArr.length > 1) {
				imageName =
					"./data/image/" +
					fileNameArr[1].substring(0, 1) +
					"/" +
					fileNameArr[1] +
					".jpg";
			}
		} else {
			base_filename = base_left_filename + "/" + curTopicArr[3];
		}
	}
	/*read src file*/
	playlistCnt = 0;
	playlists = [];
	if (curQuiz.includes("Left@@@")) {
		bPlayerList = true;
		parseCsv(base_left_filename + "/all.csv");
		var detailCnt = quesArr.length;
		var r = Math.floor(Math.random() * detailCnt);
		if (quesArr[r].includes("=")) {
			videoId = quesArr[r].split("=")[1].split("&")[0].split(",")[0];
		} else {
			videoId = quesArr[r].split(",")[2];
		}

		youtube_url = "https://www.youtube-nocookie.com/watch?v=" + videoId;

		for (var x = 0; x < quesArr.length; x++) {
			if (quesArr[x].length < 5) {
				continue;
			}
			let playlist = new Playlist();
			playlist.numb = playlistCnt + 1;
			playlist.content = quesArr[x].split(",")[1];

			if (quesArr[x].includes("=")) {
				playlist.video_id = quesArr[x]
					.split(",")[2]
					.split("=")[1]
					.split("&")[0];
			} else {
				playlist.video_id = quesArr[x].split(",")[2];
			}
			playlists.push(playlist);
			playlistCnt++;
		}
	} else if (curTopicArr[3].includes("all@")) {
		var tmpID = curTopicArr[3]
			.split("@")[1]
			.replace(/&/g, "_")
			.replace(/~/g, "-");
		base_filename = base_left_filename + "/" + srtID;
		subtitleMode = "SingleSrt";
		if (base_filename.includes("csv")) {
			base_left_filename + "/" + srtID;
			subtitleMode = "Csv";
		} else {
			base_filename = base_left_filename + "/" + srtID + ".srt";
		}
		isMD = false;
		readSubtitles(base_filename);

		//tmpID = tmpID.replacee(/~/g, "_");
		youtube_url = "https://www.youtube-nocookie.com/watch?v=" + videoID;
	} else {
		if (curQuizType.includes("conversation_lesson")) {
			subtitleMode = "MD";
			isMD = true;
			readSubtitles(base_filename + ".md");
		} else {
			subtitleMode = "SingleSrt";
			isMD = false;
			readSubtitles(base_filename + ".srt");
		}
	}

	modalContent.innerHTML =
		'<span class="close" id="closeAudio">&times;</span><p>';

	/* 2. audio player */

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
		var playerDiv = document.createElement("span");
		playerDiv.setAttribute("id", "player-div");
		playerDiv.classList.add("myPlayerDiv");
		audio_sec_top.appendChild(playerDiv);

		showMessage(true);
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
			tmp_audio_sec_bottom.classList.add("audio_sec_bottom_height");
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
					onStateChange: onPlayerStateChange,
				},
			});
		});

		// 4. The API will call this function when the video player is ready.
		function onPlayerReady(e) {
			e.target.playVideo();
			e.target.seekTo(0);
			youtube_ready = true;
		}

		function onPlayerStateChange(event) {
			console.log(event);
			if (event.data == YT.PlayerState.ENDED) {
				var search_flexbox_list = document.querySelectorAll(".flex-box");
				search_flexbox_list[
					Math.floor(Math.random() * search_flexbox_list.length) + 1
				].click();
			}
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
	} else if (curQuizType.includes("mp3") || curQuizType.includes("m4a")) {
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
		showMessage(true);
	} else {
		if (imageName.length > 0 && !bSmallWindows) {
			audio_sec_top.classList.add("image_sec_top");
			// x.1. This code loads the IFrame Player API code asynchronously.
			var playerDiv = document.createElement("div");
			playerDiv.setAttribute("id", "player-div");
			playerDiv.classList.add("myImageDiv");
			var imageDiv = document.createElement("img");
			imageDiv.setAttribute("height", "100%");
			imageDiv.setAttribute("width", "100%");
			imageDiv.setAttribute("object-fit", "scale-down");
			imageDiv.src = imageName;
			playerDiv.appendChild(imageDiv);
			audio_sec_top.appendChild(playerDiv);
			isMedia = true;
		} else {
			isMedia = false;
			audio_sec_top.classList.add("plain_sec_top");
		}
		modalContent.appendChild(audio_sec_top);
		showMessage(isMedia);
	}

	if (!curQuizType.includes("youtube")) {
		audio.load();
		audio.play();
	} else {
	}

	showTable(isMedia);

	if (subtitles.length < 1) return; //no subtitle, exit

	myAudioTableRow = document.getElementsByClassName("audio_table_row");

	autoRowSelected = 1;
	actualRow = 1;
	rowSelected = myAudioTableRow[autoRowSelected - 1];
	timeoutID = window.setInterval(handleAudioLoop, 50);
	// audio.addEventListener("timeupdate", function () {
	function handleAudioLoop() {
		let currentTime;

		/*pre-check*/
		// if (bSubtitleEditable) return;
		if (subtitles.length <= 0) return;
		if (autoRowSelected > subtitles.length) return;
		/*pre-check*/
		if (youtube_mode) {
			if (!youtube_ready) return;
			if (player.getPlayerState() != YT.PlayerState.PLAYING) return;
			currentTime = player.playerInfo.currentTime;
		} else currentTime = audio.currentTime;

		if (
			arrPlayMode[playMode].value == "ArticleStop" ||
			arrPlayMode[playMode].value == "SentenceStop"
		) {
			// if (bRemainHighlight) return;

			/*handle user manual rewind video */
			if (actualRow > 1) {
				while (1) {
					if (actualRow < 2) break;
					if (currentTime < subtitles[actualRow - 1].start) {
						actualRow--;
					} else break;
				}
			}
			/*end*/

			/*handle bRemainHighlight */
			if (bRemainHighlight && arrPlayMode[playMode].value == "ArticleStop") {
				while (1) {
					if (
						subtitles[actualRow - 1].content.includes("[") &&
						subtitles[actualRow - 1].content.includes("]")
					) {
						break;
					} else {
						if (youtube_mode) {
							actualRow++;
							player.seekTo(subtitles[actualRow - 1].start);
						}

						// if (actualRow == myAudioTableRow.length) {
						// 	alert("hello 2497");
						// 	if (youtube_mode) {
						// 		player.pauseVideo();
						// 	} else {
						// 		audio.pause();
						// 	}
						// 	return;
						// }
					}
				}
			}
			/*end*/

			if (currentTime > subtitles[actualRow - 1].finish) {
				if (
					// bSubtitleEditable ||
					arrPlayMode[playMode].value == "SentenceStop"
				) {
					if (youtube_mode) {
						player.seekTo(subtitles[autoRowSelected - 1].start);
						player.pauseVideo();
					}
				} else {
					if (autoRowSelected == myAudioTableRow.length) {
						if (youtube_mode) {
							player.pauseVideo();
						} else {
							audio.pause();
						}

						return;
					}

					myAudioTableRow[autoRowSelected - 1].style.color = "blue";
					actualRow = Number(
						myAudioTableRow[autoRowSelected].cells[0].innerText
					);

					/*handle user manual rewind video */
					if (autoRowSelected > 1) {
						while (1) {
							if (autoRowSelected < 1) break;
							if (currentTime < subtitles[autoRowSelected - 1].finish) {
								autoRowSelected--;
							} else break;
						}
					}
					/*end*/

					myAudioTableRow[autoRowSelected].style.color = "red";
					autoRowSelected++;
					rowSelected = myAudioTableRow[autoRowSelected - 1];
					var tmpTableCnt = myAudioTableRow.length;
					var nowTop =
						(autoRowSelected - 1) *
						(audio_sec_bottom.scrollHeight / tmpTableCnt);

					audio_sec_bottom.scrollTop =
						myAudioTableRow[autoRowSelected - 1].offsetTop;
				}
			}
		} else if (arrPlayMode[playMode].value == "SentenceRepeat") {
			if (currentTime > subtitles[actualRow - 1].finish) {
				if (bSubtitleEditable) {
					audio.pause();
				} else if (youtube_mode) {
					player.pauseVideo();
					player.seekTo(subtitles[actualRow - 1].start);
					player.playVideo();
				} else {
					audio.pause();
					audio.currentTime = subtitles[actualRow - 1].start;
					syncDelay(1000);
					audio.play();
				}
			}
		}
	}
}

function showMessage(isMedia) {
	/* 2.1. 過濾只留重點列 */
	var remainHighlight = document.createElement("input");
	remainHighlight.type = "checkbox";
	remainHighlight.name = "remainHighlight";
	remainHighlight.id = "remainHighlight";
	remainHighlight.classList.add("remainHighlight");
	remainHighlight.checked = bRemainHighlight;
	var lblRemainHighlight = document.createElement("label");
	lblRemainHighlight.innerText = "重點列";
	lblRemainHighlight.classList.add("lblsubtitleEditable");
	lblRemainHighlight.htmlFor = "remainHighlight";
	remainHighlight.onclick = function () {
		bRemainHighlight = remainHighlight.checked;
		showTable(isMedia);
	};

	/* 2.2.2. 字幕編輯模式 */
	var subtitleEditable = document.createElement("input");
	subtitleEditable.type = "checkbox";
	subtitleEditable.name = "subtitleEditable";
	subtitleEditable.id = "subtitleEditable";
	subtitleEditable.classList.add("remainHighlight");
	subtitleEditable.checked = bSubtitleEditable;
	var lblsubtitleEditable = document.createElement("label");
	lblsubtitleEditable.innerText = "編輯字幕";
	lblsubtitleEditable.classList.add("lblsubtitleEditable");
	lblsubtitleEditable.htmlFor = "subtitleEditable";
	subtitleEditable.onclick = function () {
		bSubtitleEditable = subtitleEditable.checked;
		if (!subtitleEditable.checked) {
			dropdownSubtitle.style.display = "none";
			insBtn.style.display = "none";
			delBtn.style.display = "none";
			saveBtn.style.display = "none";
			// readBtn.style.display = "none";
		} else {
			dropdownSubtitle.style.display = "inline";
			insBtn.style.display = "inline";
			delBtn.style.display = "inline";
			saveBtn.style.display = "inline";
			// readBtn.style.display = "inline";
			if (subtitles.length < 1) {
				insertTableRow(0);
				var nowTableContent = getTableContent();
				setSubtitles(nowTableContent);
			}
		}

		showTable(isMedia);
	};

	/* 2.2.3. 字幕搜尋介面 */

	var subtitleSearchTxt = document.createElement("text");
	var subtitleSearchBtn = document.createElement("button");
	var subtitleSearchIcon = document.createElement("svg");
	var subtitleSearchUse = document.createElement("use");

	subtitleSearchTxt.classList.add("search__input");
	subtitleSearchBtn.classList.add("search__button");
	subtitleSearchIcon.classList.add("search__icon");
	subtitleSearchUse.setAttribute(
		"xlink:href",
		"img/sprite.svg#icon-magnifying-glass"
	);
	subtitleSearchIcon.appendChild(subtitleSearchUse);
	subtitleSearchBtn.appendChild(subtitleSearchIcon);

	var messageDiv = document.createElement("div");

	// 秀上方訊息
	/* 2.2.1. 播放模式 */
	if (isMedia == true) {
		var dropdown = document.createElement("select");
		dropdown.classList.add("select-dropdown");
		for (var i = 0; i < arrPlayMode.length; i++) {
			var opt = document.createElement("option");
			opt.text = arrPlayMode[i].text;
			opt.value = arrPlayMode[i].value;
			dropdown.options.add(opt);
			messageDiv.appendChild(dropdown);
		}
		dropdown.selectedIndex = playMode;
		dropdown.onchange = function () {
			playMode = this.selectedIndex;
		};
	}

	/* 2.2.2. 編輯字幕 */
	if (bHasHighlight) {
		messageDiv.appendChild(remainHighlight);
		messageDiv.appendChild(lblRemainHighlight);
	}

	if (windowWidth > 600) {
		messageDiv.appendChild(subtitleEditable);
		messageDiv.appendChild(lblsubtitleEditable);
	}

	/* 2.2.2.1. 編輯模式 */

	var dropdownSubtitle = document.createElement("select");
	dropdownSubtitle.classList.add("select-dropdown");
	for (var i = 0; i < arrSubtitleMode.length; i++) {
		var opt = document.createElement("option");
		opt.text = arrSubtitleMode[i].text;
		opt.value = arrSubtitleMode[i].value;
		dropdownSubtitle.options.add(opt);
	}
	dropdownSubtitle.selectedIndex = subtitleMode;
	dropdownSubtitle.onchange = function () {
		subtitleMode = this[this.selectedIndex].value;
		showTable(isMedia);
	};
	messageDiv.appendChild(dropdownSubtitle);

	insBtn = document.createElement("button");
	insBtn.innerText = "插入上列";
	insBtn.classList.add("myButton");
	insBtn.onclick = function () {
		insertTableRow(autoRowSelected);
		resetTableNum();
		var nowTableContent = getTableContent();
		setSubtitles(nowTableContent);
	};
	messageDiv.appendChild(insBtn);

	delBtn = document.createElement("button");
	delBtn.innerText = "刪除此列";
	delBtn.classList.add("myButton");
	delBtn.onclick = function () {
		rowSelected.remove();
		resetTableNum();
		var nowTableContent = getTableContent();
		setSubtitles(nowTableContent);
	};
	messageDiv.appendChild(delBtn);

	saveBtn = document.createElement("button");
	saveBtn.innerText = "儲存字幕";
	saveBtn.classList.add("myButton");
	saveBtn.onclick = function () {
		saveTableContent();
	};
	messageDiv.appendChild(saveBtn);

	readBtn = document.createElement("button");
	readBtn.innerText = "讀取字幕";
	readBtn.classList.add("myButton");
	readBtn.onclick = function () {
		readTableContent(isMedia);
	};
	if (windowWidth > 600) {
		messageDiv.appendChild(readBtn);
	}

	messageDiv.classList.add("myMessageDiv");
	audio_sec_top.appendChild(messageDiv);

	if (!subtitleEditable.checked) {
		dropdownSubtitle.style.display = "none";
		insBtn.style.display = "none";
		delBtn.style.display = "none";
		saveBtn.style.display = "none";
	}
}
function getSecond(inputTime) {
	if (inputTime == undefined) return 99999;
	if (inputTime.length < 2) {
		return 99999;
	}
	var secondArr = inputTime.split(":");
	var hour = 0;
	var minute = 0;
	var secondString = "";

	if (secondArr.length > 2) {
		hour = Number(secondArr[0]);
		minute = Number(secondArr[1]);
		secondString = secondArr[2];
	} else {
		minute = Number(secondArr[0]);
		secondString = secondArr[1];
	}

	var second2Arr = "";
	if (secondString.includes(",")) {
		second2Arr = secondString.split(",");
	} else if (secondArr[2].includes(".")) {
		second2Arr = secondString.split(".");
	}
	var second = Number(second2Arr[0]);
	var milliSecond = Number(second2Arr[1]);
	second = second + minute * 60 + hour * 3600 + milliSecond * 0.001;
	return second;
}

function setSubtitleTime(iSelectedCol, iCol) {
	let time;
	if (youtube_mode) {
		time = player.getCurrentTime();
	} else {
		time = audio.currentTime;
	}
	iSelectedCol.parentNode.children[iCol].innerHTML = changeTimeString(time);
	var nowRow = Number(iSelectedCol.parentNode.children[0].innerHTML);
	if (iCol == 1) subtitles[nowRow - 1].start = time;
	else if (iCol == 2) subtitles[nowRow - 1].finish = time;
}

function changeTimeString(iTime) {
	if (iTime == undefined) return "00:00,000";
	let hours = iTime / 3600;
	let minutes = (hours - Math.floor(hours)) * 60;
	let seconds = iTime % 60;

	hours = Math.floor(hours);
	minutes = Math.floor(minutes);
	seconds = Math.floor(seconds);

	var returnStr = "";
	if (hours > 0) {
		if ((hours + "").length == 1) {
			hours = "0" + hours;
			returnStr = returnStr + hours + ":";
		}
	}

	if ((minutes + "").length == 1) {
		minutes = "0" + minutes;
	}

	if ((seconds + "").length == 1) {
		seconds = "0" + seconds;
	}

	let millsecond = Math.floor((iTime * 1000) % 1000);

	returnStr = returnStr + minutes + ":" + seconds + "," + millsecond;

	return returnStr;
}

function selectRow(c, iCol) {
	var r = c.parentNode;
	if (subtitleMode.includes("MD4")) {
		speakText(r.children[iCol].innerText, iCol);
	}
	if (rowSelected !== undefined) {
		rowSelected.style.color = "blue";
		if (bSubtitleEditable && rowSelected != r && iCol >= 3) {
			rowSelected.children[iCol].setAttribute("contenteditable", "false");
		}
	}
	rowSelected = r;
	rowSelected.style.color = "red";
	if (bSubtitleEditable) {
		rowSelected.children[3].setAttribute("contenteditable", "true");
		if (subtitleMode.includes("DoubleSrt") || subtitleMode.includes("MD4")) {
			rowSelected.children[4].setAttribute("contenteditable", "true");
			if (subtitleMode.includes("MD4")) {
				rowSelected.children[5].setAttribute("contenteditable", "true");
				rowSelected.children[6].setAttribute("contenteditable", "true");
			}
		}
	}
	var nowRow = c.closest("tr").rowIndex;
	var nowSec = getSecond(r.children[1].innerHTML);
	if (youtube_mode) {
		if (!(bSubtitleEditable && iCol >= 3)) {
			player.seekTo(nowSec);
		}
	} else {
		if (!(bSubtitleEditable && iCol >= 3)) {
			audio.currentTime = nowSec;
		}
	}

	finishTime = getSecond(r.children[2].innerHTML);

	if (nowAudioLoop) {
		if (autoRowSelected == nowRow) nowAudioLoop = !nowAudioLoop;
	} else nowAudioLoop = true;

	autoRowSelected = nowRow;
	actualRow = Number(r.children[0].innerHTML);
}

function speakText(readText, iCol) {
	var mySpeakText;
	var mySpeakArr;
	var msg = new SpeechSynthesisUtterance();
	if (iCol == 3) msg.lang = "zh-TW";
	else if (iCol == 4) msg.lang = "en-GB";
	else if (iCol == 5) msg.lang = "ja-JP";
	else if (iCol == 6) msg.lang = "ko-KR";
	msg.rate = 0.8;

	mySpeakText = readText
		.replaceAll("▪", "")
		.replaceAll("：", ":")
		.replaceAll("*", "")
		.replaceAll("？", "")
		.replaceAll("?", "")
		.replaceAll("。", "");
	// mySpeakText = readText.replaceAll("▪|：|*|?|？", "");

	var lineArr = mySpeakText.replace(/\r\n/g, "\n").split("\n");
	var myFinalSpeakText = "";
	for (var i = 0; i < lineArr.length; i++) {
		var curLineArr = lineArr[i].split(":");
		mySpeakText = curLineArr[curLineArr.length - 1];
		myFinalSpeakText = myFinalSpeakText + mySpeakText + ".";
	}
	msg.text = myFinalSpeakText;
	window.speechSynthesis.speak(msg);
}
function changeRow(c) {
	var r = c.parentNode;
	var nowRow = Number(r.children[0].innerHTML);
	var table = document.getElementById("my_audio_table");
	subtitles[nowRow - 1].content = table.rows[nowRow].children[3].innerText;
	if (subtitleMode.includes("DoubleSrt") || subtitleMode.includes("MD4")) {
		subtitles[nowRow - 1].content2 = table.rows[nowRow].children[4].innerText;
		if (subtitleMode.includes("MD4")) {
			subtitles[nowRow - 1].content3 = table.rows[nowRow].children[5].innerText;
			subtitles[nowRow - 1].content4 = table.rows[nowRow].children[6].innerText;
		}
	}
	if (nowRow == table.rows.length - 1) {
		if (rowSelected.children[3].innerText.length > 0) {
			insertTableRow(nowRow + 1);
			var nowTableContent = getTableContent();
			setSubtitles(nowTableContent);
		}
	}
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
		var begin = newString.indexOf("<");
		var end = newString.indexOf(">");
		var length = newString.length;
		if (end < begin) {
			alert("no } match to {");
			break;
		}
		var calcString = newString.substring(begin + 1, end);
		var resultString = eval(calcString);
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
	}

	return newString;
}
