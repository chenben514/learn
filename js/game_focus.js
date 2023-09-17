import disableBtnStatus from "./common.js";
window.closeWrong = closeWrong;
window.digitFocus = digitFocus;
window.pressCard = pressCard;

let multiple;
let value;

const gameHeight = document.querySelector("body").offsetHeight;

const content = document.querySelector(".content");
var game = document.getElementsByClassName("game-content")[0];
var digitPos = [];
var nowOrder = 1;
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

// my_game.js
function game_focus() {
	content.classList.add("slight_opacity");

	// Get the modal
	var game_modal = document.getElementById("myGame");
	game_modal.style.display = "block";

	game.innerHTML =
		'<h6>選擇等級</h6><select name="digits" id="digits" class="combo_box" >' +
		'<optgroup label="Swedish Cars">' +
		'<option value="3">3</option>' +
		'<option value="5" selected>5</option>' +
		'<option value="7">7</option>' +
		'<option value="9">9</option>' +
		'<option value="29">2的乘法</option>' +
		'<option value="39">3的乘法</option>' +
		'<option value="49">4的乘法</option>' +
		'<option value="59">5的乘法</option>' +
		'<option value="69">6的乘法</option>' +
		'<option value="79">7的乘法</option>' +
		'<option value="89">8的乘法</option>' +
		'<option value="99">9的乘法</option>' +
		"</optgroup>" +
		"</select>" +
		"<button class='game_button' onclick='digitFocus()'>開始遊戲</button>" +
		'<span class="label_text">己花</span>' +
		'<span class="timer_sec label_text" id="my_game_sec">00</span>' +
		'<span class="label_text" >秒</span>' +
		"<button style='float:right' class='game_button' onclick='closeWrong()'>離開遊戲</button>" +
		"</br><label id='nowOrder'>  </label>";
}

function closeWrong() {
	var modal = document.getElementById("myGame");
	modal.style.display = "none";
	content.classList.remove("slight_opacity");
	disableBtnStatus(false);
	clearInterval(counter); //clear counter
}

function pressCard() {
	if (this.id == "card" + nowOrder) {
		document.getElementById(this.id).classList.add("card_ok"); //show quiz box;
	} else {
		document.getElementById(this.id).classList.add("card_ng"); //show quiz box;
	}
}

function pressCardup() {
	if (this.id == "card" + nowOrder) {
		document.getElementById(this.id).classList.remove("card_ok"); //show quiz box;
		nowOrder++;
		var target = document.getElementById("nowOrder");
		if (multiple > 1) target.innerText = "請按右邊數字 " + nowOrder * multiple;
		else target.innerText = "請按右邊數字 " + nowOrder;
		if (nowOrder == nowMax + 1) {
			clearInterval(counter); //clear counter
			target.innerText = "你花了 " + quesTimer + " 秒完成";
		}
	} else {
		document.getElementById(this.id).classList.remove("card_ng"); //show quiz box;
	}
}

function digitFocus() {
	nowOrder = 1;
	multiple;
	var e = document.getElementById("digits");
	value = e.options[e.selectedIndex].value;
	curLevelIdx = e.selectedIndex;
	var text = e.options[e.selectedIndex].text;
	var game_table = document.getElementById("game_table");
	var target = document.getElementById("nowOrder");
	if (value < 10) {
		target.innerText = target.innerText = "請從數字 1 按到數字" + value * value;
		multiple = 1;
	} else {
		multiple = Math.floor(value / 10);
		text = 3;
		target.innerText = target.innerText =
			"請從數字" + multiple + "按到數字" + multiple * multiple;
	}

	var tmpResult;
	tmpResult = "<table id='game_table' class='table-top'>";

	var cardWidth = Math.round((gameHeight - 300) / text);
	if (game_table != null) game_table.remove();

	quesTimer = 0;

	var d = new Date();
	startSecond = Math.floor(d.getTime() / 1000);

	digitPos = [];
	for (var i = 1; i <= text * text; i++) {
		digitPos.push(i);
	}

	shuffle(digitPos);
	nowMax = text * text;
	for (var i = 0; i < text; i++) {
		tmpResult += "<tr>";
		for (var j = 0; j < text; j++) {
			tmpResult += "<td class='card_container' style='width:";
			tmpResult += cardWidth;
			tmpResult += "px;height:";
			tmpResult += cardWidth;
			tmpResult += "px' id='card";
			tmpResult += digitPos[i * text + j];
			tmpResult += "'>";

			tmpResult += digitPos[i * text + j] * multiple;
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
	startTimer();
}

function startTimer() {
	var e = document.getElementById("digits");

	e.selectedIndex = curLevelIdx;

	counter = setInterval(timer, 1000);
	function timer() {
		var timeSec = document.getElementById("my_game_sec");

		var d = new Date();
		nowSecond = Math.floor(d.getTime() / 1000);

		quesTimer = nowSecond - startSecond;

		if (quesTimer < 10 && quesTimer > 0) {
			timeSec.innerText = "0" + quesTimer;
		} else timeSec.innerText = quesTimer;
	}
}

export default game_focus;
