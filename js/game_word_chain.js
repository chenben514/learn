import disableBtnStatus from "./common.js";
window.nextWordChain = nextWordChain;
const start_btn = document.querySelector(".word_chain");
const my_word_chain_score = document.querySelector(".word_chain_score");

const content = document.querySelector(".content");
var game = document.getElementsByClassName("game-content")[0];
var game_detail = document.getElementsByClassName("game-content-detail")[0];

let current_word;
let quesCnt;
class Question {
	numb;
	word;
	pron;
}
let questions;
let showups = [];
let current_score = 0;
let game_over = false;

function nextWordChain() {
	// alert("999");
	//ben_test
	//the first run
	var i, current_num;
	var found = false;

	if (showups.length == 0) {
		current_num = Math.floor(Math.random() * questions.length) - 1;
		game_detail.innerHTML =
			game_detail.innerHTML +
			"<span class='word'>" +
			questions[current_num].word +
			"</span><span class='pron'>(" +
			questions[current_num].pron +
			")</span>➜";

		showups.push(questions[current_num].word);
		var length = questions[current_num].word.length;
		current_word = questions[current_num].word.substring(length - 1, length);
		return;
	}
	if (game_over === true) {
		alert("遊戲結束了，找不到字接了");
		return;
	}
	for (i = 0; i < quesCnt; i++) {
		if (current_word === questions[i].word.substring(0, 1)) {
			var tmp_length = questions[i].word.length;
			if (showups.includes(current_word)) {
				continue;
			}
			if (
				current_word === questions[i].word.substring(tmp_length - 1, tmp_length)
			) {
				continue;
			}
			current_num = i;
			found = true;
			var randomCheck = Math.floor(Math.random() * 3);
			if (randomCheck === 1) break;
		}
	}
	if (found === false) {
		game_detail.innerHTML =
			game_detail.innerHTML + "<span class='word'>遊戲結束（找不到字了";
		game_over = true;
	} else {
		game_detail.innerHTML =
			game_detail.innerHTML +
			"<span class='word'>" +
			questions[current_num].word +
			"</span><span class='pron'>(" +
			questions[current_num].pron +
			")</span>➜";
		showups.push(questions[current_num].word);
		var length = questions[current_num].word.length;
		current_word = questions[current_num].word.substring(length - 1, length);
	}
}

// function startWordChain() {
// 	var start = Math.floor(Math.random() * questions.length);
// 	game.innerHTML =
// 		"<span class='word'>" +
// 		questions[start].word +
// 		"</span><span class='pron'>(" +
// 		questions[start].pron +
// 		")</span>➜";

// 	var length = questions[start].word.length;
// 	current_word = questions[start].word.substring(length - 1, length);
// 	showups = [];
// 	current_score = 0;
// 	game_over = false;
// }

function loadWordChain() {
	content.classList.add("slight_opacity");

	var game_modal = document.getElementById("myGame");
	game_modal.style.display = "block";

	//ben_test
	var selFile = "./data/learn/word_chain.csv";

	// var errArr = localStorage.getItem(selCategory + "_" + selLevel + "_err");
	// alert(errArr);
	let tmpCnt = 0;
	let tmpArr = [];
	var quesList = [];
	let ansList = [];

	var read = new XMLHttpRequest();
	read.open("GET", selFile, false);
	read.setRequestHeader("Cache-Control", "no-cache");
	read.send();
	var displayName = read.responseText;

	var quesArr = displayName.replace(/\r\n/g, "\n").split("\n");
	quesCnt = quesArr.length;

	//2.generate questions
	questions = [];
	var i;
	var j;
	for (i = 0; i < quesCnt; i++) {
		var singQuesArr = quesArr[i].split(";");

		let question = new Question();
		question.numb = i + 1;
		question.word = singQuesArr[0];
		question.pron = singQuesArr[1];
		questions[i] = question;
	}
	var start = Math.floor(Math.random() * questions.length);
	game.innerHTML = "";
	game.innerHTML =
		game.innerHTML +
		'<div class="section_course">' +
		'<div class="course-caption">中文-文字接龍' +
		'<button class="myButton" id="restart" >重新開始</button>' +
		'<button class="myButton" id="cpuTurn">電腦接字</button>' +
		'<button class="myButton" id="myTurn" >我要接字</button>' +
		'<input class="word_chain_input" type="text" id="myAnswer" name="myAnswer">' +
		'<span class="word_chain_score" id="myScore" >0</span>' +
		'<span class="word_chain_score_label">分數：</span>' +
		'<button  class="myButton"  onclick="closeWrong()" >離開遊戲</button>' +
		"</div>";

	initLoadWordChain();

	document.getElementById("restart").addEventListener("click", loadWordChain);
	document.getElementById("cpuTurn").addEventListener("click", nextWordChain);
	document.getElementById("myTurn").addEventListener("click", myWordChain);
	// cpu_btn.addEventListener("click", nextWordChain);
	// var length = questions[start].word.length;
	// current_word = questions[start].word.substring(length - 1, length);
}

function initLoadWordChain() {
	game_detail.innerHTML = "";
	nextWordChain();
}

function myWordChain() {
	var i;
	var my_word_input = document.getElementById("myAnswer");
	if (showups.includes(my_word_input.value)) {
		alert("這個字詞己經用過了");
		return;
	}

	if (my_word_input.value.substring(0, 1) !== current_word) {
		alert("你輸入字詞的第一個字，不是前個字詞的最後一個字");
		return;
	}

	for (i = 0; i < quesCnt; i++) {
		if (my_word_input.value === questions[i].word) {
			game_detail.innerHTML =
				game_detail.innerHTML +
				"<span class='word'>" +
				questions[i].word +
				"</span><span class='pron'>(" +
				questions[i].pron +
				")</span>➜";
			var length = questions[i].word.length;
			current_word = questions[i].word.substring(length - 1, length);
			current_score += 1;
			document.getElementById("myScore").innerHTML = current_score;
			break;
		}
	}
	if (i === quesCnt) {
		alert("找不到你輸入的字");
	}
}

export default loadWordChain;
