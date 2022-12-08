import disableBtnStatus from "./common.js";

window.closeWrong = closeWrong;
window.matchFocus = matchFocus;
window.pressCard = pressCard;
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

let multiple;
let value;
let quesArr = [];
let quesCnt;
class Question {
	numb;
	question;
	answer;
}
let bGameStart = false;
let rowLen, colLen;
let cardWidth, fontWidth;
let nowQuiz, prevTimer;

const content = document.querySelector(".content");
var game = document.getElementsByClassName("game-content")[0];
var digitPos = [];
var nowOrder = 0;
var nowMax = 0;
var quesTimer = 0;
var counter;
var curLevelIdx = 0;
var startSecond;
var nowSecond;

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

function closeWrong() {
	var modal = document.getElementById("myGame");
	modal.style.display = "none";
	content.classList.remove("slight_opacity");
	disableBtnStatus(false);
	clearInterval(counter); //clear counter
}

function pressCard() {
	if (this.id.length < 1) return;
	if (bGameStart == false) {
		document.getElementById(this.id).classList.add("card_ok"); //show quiz box;
		var pressID = this.id.substring(4, this.id.length);

		var msg = new SpeechSynthesisUtterance();

		// Set the text.
		msg.text = quesArr[pressID].answer;

		// Set the attributes.
		msg.volume = 1;
		msg.rate = 1;
		msg.pitch = 1;
		if (curCourse == "chinese") msg.lang = "zh-CN";
		window.speechSynthesis.speak(msg);
	} else {
		if (this.id == "card" + nowOrder) {
			document.getElementById(this.id).classList.add("card_ok"); //show quiz box;
		} else {
			document.getElementById(this.id).classList.add("card_ng"); //show quiz box;
		}
	}
}

function pressCardup() {
	if (bGameStart == false) {
		document.getElementById(this.id).classList.remove("card_ok");
		return;
	}
	if (this.id == "card" + nowOrder) {
		document.getElementById(this.id).classList.remove("card_ok"); //show quiz box;
		nowOrder++;
		var target = document.getElementById("nowOrder");
		target.innerText = "己完成 " + nowOrder + " / " + quesCnt;
		if (nowOrder == nowMax) {
			clearInterval(counter); //clear counter
			prevTimer = quesTimer;
			game_match(nowQuiz);
			var target = document.getElementById("nowOrder");
			target.innerText = "你花了 " + prevTimer + " 秒完成";
			return;
		}
		speakAnswer();
	} else {
		document.getElementById(this.id).classList.remove("card_ng"); //show quiz box;
	}
}

function matchFocus() {
	if (bGameStart == false) {
		var gameButton = document.querySelector(".game_button");
		gameButton.innerText = "停止游戲";
		bGameStart = true;
		var target = document.getElementById("nowOrder");
		target.innerText = "己完成 " + nowOrder + " / " + quesCnt;

		startTimer();
		speakAnswer();
	} else {
		var gameButton = document.querySelector(".game_button");
		gameButton.innerText = "重新游戲";
		bGameStart = false;
		clearInterval(counter);
	}
}

function game_match(curQuiz) {
	nowQuiz = curQuiz;
	bGameStart = false;
	//0.set UI
	content.classList.add("slight_opacity");
	var game_modal = document.getElementById("myGame");
	game_modal.style.display = "block";

	game.innerHTML =
		"<button class='game_button' onclick='matchFocus()'>開始遊戲</button>" +
		'<span class="label_text">己花</span>' +
		'<span class="timer_sec label_text" id="my_game_sec">00</span>' +
		'<span class="label_text" >秒</span>' +
		"<button style='float:right' class='game_button' onclick='closeWrong()'>離開遊戲</button>" +
		"</br><label id='nowOrder'>  </label>";

	//1.open file
	var curQuizArr = curQuiz.split("-");

	var curTopicArr = curQuizArr[1].split("_");
	var base_filename =
		"./data/" +
		curTopicArr[0] +
		"/" +
		curTopicArr[1] +
		"/" +
		curTopicArr[2] +
		"/" +
		curTopicArr[3];

	parseCsv(base_filename + ".csv");

	//2.generate table
	var game_table = document.getElementById("game_table");
	var target = document.getElementById("nowOrder");
	target.innerText = "己完成 " + nowOrder + " / " + quesCnt;

	nowOrder = 0;

	if (game_table != null) game_table.remove();

	quesTimer = 0;

	var d = new Date();
	startSecond = Math.floor(d.getTime() / 1000);

	if (quesCnt <= 1) {
		colLen = 1;
	} else if (quesCnt <= 4) {
		colLen = 2;
	} else if (quesCnt <= 9) {
		colLen = 3;
	} else if (quesCnt <= 16) {
		colLen = 4;
	} else if (quesCnt <= 25) {
		colLen = 5;
	} else if (quesCnt <= 36) {
		colLen = 6;
	} else if (quesCnt <= 49) {
		colLen = 7;
	} else if (quesCnt <= 64) {
		colLen = 8;
	} else if (quesCnt <= 81) {
		colLen = 9;
	} else {
		alert("太多項目，看表格是否再擴充");
	}
	rowLen = quesCnt / colLen;
	cardWidth =
		0.7 *
		Math.min(
			Math.round(windowHeight / colLen),
			Math.round(windowWidth / colLen)
		);
	// cardWidth = Math.round((gameHeight - 300) / colLen);

	fontWidth = cardWidth * 0.5;

	nowMax = quesCnt;
	showCard();
}

function showCard() {
	var tmpResult;
	var nowCnt;
	var game_table = document.getElementById("game_table");
	if (game_table != null) game_table.remove();

	tmpResult = "<table id='game_table' class='table-top'>";

	var shuffleArr = [];

	for (var i = 0; i < quesCnt; i++) {
		shuffleArr.push(i);
	}
	shuffle(shuffleArr);

	for (var i = 0; i < rowLen; i++) {
		tmpResult += "<tr>";
		for (var j = 0; j < colLen; j++) {
			nowCnt = i * colLen + j;
			tmpResult += "<td class='card_container' style='width:";
			tmpResult += cardWidth;
			tmpResult += "px;height:";
			tmpResult += cardWidth;
			tmpResult += "px;font-size:";
			tmpResult += fontWidth;
			tmpResult += "px'";
			if (nowCnt < quesCnt) {
				tmpResult += " id='card";
				tmpResult += shuffleArr[nowCnt].toString();
				tmpResult += "'";
			}
			tmpResult += ">";
			if (nowCnt < quesCnt) {
				tmpResult += quesArr[shuffleArr[nowCnt]].question;
			}

			tmpResult += "</td>";
		}
		tmpResult += "</tr>";
	}
	tmpResult += "</table>";
	game.innerHTML = game.innerHTML + tmpResult;

	//0.1. Set Subject
	var card_links = document.querySelectorAll(".card_container");
	for (let i = 0; i < card_links.length; i++) {
		card_links[i].addEventListener("mousedown", pressCard);
		card_links[i].addEventListener("mouseup", pressCardup);
		card_links[i].addEventListener("touchstart", pressCard);
		card_links[i].addEventListener("touchend", pressCardup);
	}
}

function speakAnswer() {
	var msg = new SpeechSynthesisUtterance();

	// Set the text.
	msg.text = quesArr[nowOrder].answer;

	// Set the attributes.
	msg.volume = 1;
	msg.rate = 1;
	msg.pitch = 1;
	if (curCourse == "chinese") msg.lang = "zh-CN";
	window.speechSynthesis.speak(msg);
}

function startTimer() {
	var e = document.getElementById("digits");

	counter = setInterval(timer, 1000);
	function timer() {
		var timeSec = document.getElementById("my_game_sec");

		var d = new Date();
		nowSecond = Math.floor(d.getTime() / 1000);

		quesTimer = nowSecond - startSecond;

		if (quesTimer < 10 && quesTimer > 0) {
			timeSec.innerText = "0" + quesTimer;
		} else timeSec.innerText = quesTimer;

		if (quesTimer % 5 == 1) {
			speakAnswer();
		}
	}
}
function parseCsv(filename) {
	var displayName;

	var read = new XMLHttpRequest();
	read.open("GET", filename, false);
	read.setRequestHeader("Cache-Control", "no-cache");
	read.send();

	displayName = read.responseText.replace(/’/g, "'");

	var tmpCnt;
	var tmpArr = displayName.replace(/\r\n/g, "\n").split("\n");
	tmpCnt = tmpArr.length;

	quesArr = [];
	for (var i = 0; i < tmpCnt; i++) {
		let question = new Question();
		question.numb = i;
		var tmpArr2 = tmpArr[i].split("\t");
		if (tmpArr2.length > 1) {
			question.question = tmpArr2[0];
			question.answer = tmpArr2[1];
			quesArr.push(question);
		}
	}
	shuffle(quesArr);
	quesCnt = quesArr.length;
}

export default game_match;
