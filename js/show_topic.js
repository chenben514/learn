var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

var curProcCnt = 0;

let search_input = document.getElementById("search__input");
const topic_view = document.querySelector(".main_subj");
const subject_view = document.querySelector(".mid_subj");
let curDetailLeft;

let courseSubjList = [
  { course: "chinese", subj: "word,video" },
  {
    course: "english",
    subj: "word,spell,grammer,listen,video,business,person",
  },
  { course: "japan", subj: "word,spell,video" },
  { course: "korean", subj: "word,spell,listen,writing,grammer,video,news" },
  { course: "computer", subj: "devops,cloud,db" },
  { course: "learn", subj: "calc,game,video" },
];

let subjMap = new Map([
  ["word", "字彙"],
  ["video", "影片"],
  ["person", "個人"],
  ["business", "商業"],
  ["calc", "數學"],
  ["game", "遊戲"],
  ["grammer", "文法"],
  ["listen", "聽力"],
  ["spell", "拼寫"],
  ["writing", "書寫"],
  ["news", "新聞"],
  //電腦
  ["devops", "devops"],
  ["cloud", "雲服務"],
  ["db", "資料庫"],
]);

class Topic {
  numb;
  course;
  main_subj;
  open_course_cnt;
  mid_subj;
  mid_explain;
  quiz_type;
  small_subjs = [];
  small_subj_explains = [];
  small_subj_html = [];
}
var topics = [];

curCourse = localStorage.getItem("lastCourse");
if (curCourse == "undefined" || curCourse == null || curCourse.length == 0)
  curCourse = "korean";

curMainSubj = localStorage.getItem(curCourse + "_main_subj");
if (curMainSubj == "undefined" || curMainSubj == null) curMainSubj = "word";

var element = document.getElementsByClassName("side-nav__item--active");
//getTopic(0);
showTopic();

function getTopic() {
  var selFile =
    "./data/" +
    curCourse +
    "/" +
    curMainSubj +
    "/topics_" +
    curMainSubj +
    ".csv";
  // alert(selFile);

  var read = new XMLHttpRequest();
  read.open("GET", selFile, false);
  read.setRequestHeader("Cache-Control", "no-cache");
  read.send();
  var displayName = read.responseText;
  var topicArr = displayName.replace(/\r\n/g, "\n").split("\n");
  let topicCnt = topicArr.length;
  let tmpCnt = 0;

  let tmpArr = [];
  let k = 0;
  for (let k = 0; k < topicCnt; k++) {
    if (topicArr[k].length > 1 && topicArr[k][0] != "#")
      tmpArr.push(topicArr[k]);
  }
  topicArr = tmpArr;
  topicCnt = topicArr.length;

  //2.generate topic
  var i;
  var j;
  for (i = 0; i < topicCnt; i++) {
    var singTopicArr = topicArr[i].split(",");
    let topic = new Topic();
    topic.numb = i + 1;
    topic.course = singTopicArr[0];
    topic.main_subj = singTopicArr[1];
    topic.open_course_cnt = singTopicArr[2];
    topic.mid_subj = singTopicArr[3];
    topic.mid_explain = singTopicArr[4];
    topic.quiz_type = singTopicArr[5];

    if (singTopicArr[6] == "all.csv") {
      var allFile =
        "./data/" +
        topic.course +
        "/" +
        topic.main_subj +
        "/" +
        topic.mid_subj +
        "/all.csv";

      var allRead = new XMLHttpRequest();
      read.open("GET", allFile, false);
      read.setRequestHeader("Cache-Control", "no-cache");
      read.send();
      var allDisplayName = read.responseText;
      if (allDisplayName.includes("<title>Error</title>")) {
        alert("can not get all.csv file : " + allFile);
      }
      var allTopicArr = allDisplayName.replace(/\r\n/g, "\n").split("\n");
      for (j = 0; j < allTopicArr.length; j++) {
        var allSingTopicArr = allTopicArr[j].split(",");
        if (allTopicArr[j].length < 2) continue;
        if (!allSingTopicArr[2].includes("=")) {
          alert("lack of = error :", allSingTopicArr[2]);
        }
        var eqlVideoId = allSingTopicArr[2].split("=")[1];
        if (eqlVideoId == undefined) {
          alert("video url error:" + allTopicArr[j]);
        }
        var allVideoId = allSingTopicArr[2]
          .split("=")[1]
          .split("&")[0]
          .replace(/_/g, "&")
          .replace(/-/g, "~");
        topic.small_subjs.push("all@" + allVideoId + "@" + allSingTopicArr[0]);

        if (
          allSingTopicArr[1].length > 5 ||
          allSingTopicArr[1].includes("\\")
        ) {
          topic.small_subj_explains.push(
            Number(j + 1) + "." + allSingTopicArr[1]
          );
        } else {
          topic.small_subj_explains.push(
            Number(j + 1) + "\n" + allSingTopicArr[1]
          );
        }

        topic.small_subj_html.push("NA");
      }
    } else {
      //handle [1-n-x] auto loop case (n:全部,x:己校正)
      // alert("153:" + singTopicArr[6]);
      if (singTopicArr[6] == undefined) {
        alert("逗點分隔，找不到第7欄位，或第7欄位非 all.csv -- " + topicArr[i]);
      }
      if (singTopicArr[6].includes("-")) {
        var loopArr = singTopicArr[6].split("-");
        for (j = loopArr[0]; j <= loopArr[1]; j++) {
          topic.small_subjs.push(j.toString());
          topic.small_subj_explains.push(j.toString());
          topic.small_subj_html.push("NA");
        }
        if (loopArr.length > 2) {
          for (j = loopArr[0]; j <= loopArr[2]; j++) {
            topic.small_subj_explains[j - 1] = "*" + j.toString();
          }
        }
      } else {
        for (j = 6; j < singTopicArr.length; j += 2) {
          topic.small_subjs.push(singTopicArr[j]);
          topic.small_subj_explains.push(singTopicArr[j + 1]);
          if (j + 2 < singTopicArr.length) {
            if (singTopicArr[j + 2].startsWith("http")) {
              topic.small_subj_html.push(singTopicArr[j + 2]);
              j += 1;
            } else {
              topic.small_subj_html.push("NA");
            }
          } else {
            topic.small_subj_html.push("NA");
          }
        }
      }
      //end
    }
    topics[i] = topic;
  }
}

function showTopic() {
  // 1. show main_subj view
  var i;
  var curSubj;
  var first = topic_view.firstElementChild;
  while (first) {
    first.remove();
    first = topic_view.firstElementChild;
  }

  var first_subj = subject_view.firstElementChild;
  while (first_subj) {
    first_subj.remove();
    first_subj = subject_view.firstElementChild;
  }

  curMainSubj = localStorage.getItem(curCourse + "_main_subj");
  if (curMainSubj == "undefined" || curMainSubj == null) curMainSubj = "word";
  for (var i = 0; i < courseSubjList.length; i++) {
    if (courseSubjList[i].course != curCourse) continue;
    var courseSubjArr = courseSubjList[i].subj.split(",");

    for (var j = 0; j < courseSubjArr.length; j++) {
      var curFigure = document.createElement("figure");
      if (courseSubjArr[j] != curMainSubj)
        curFigure.setAttribute("class", "main_subj__item");
      else
        curFigure.setAttribute(
          "class",
          "main_subj__item main_subj__item--active"
        );

      // var curImg = document.createElement("img");
      // curImg.setAttribute(
      //   "src",
      //   "img/empty_book_128_" + courseSubjArr[j] + ".png"
      // );
      var curImg = document.createElement("a");
      curImg.innerText = subjMap.get(courseSubjArr[j]);
      curImg.setAttribute("class", "main_subj__photo");
      curImg.setAttribute("id", courseSubjArr[j]);

      curFigure.appendChild(curImg);
      topic_view.appendChild(curFigure);
    }
  }
  // 2. show mid_subj / detail view

  getTopic();
  var bCourse = false;

  var curRightCnt;
  var curMidCnt = 0;
  for (i = 0; i < topics.length; i++) {
    curRightCnt = 0;
    if (topics[i].course != curCourse) continue;

    // 2. show mid_subj view
    if (topics[i].main_subj != curMainSubj) continue;
    var curDetail = document.createElement("detail");
    curDetail.setAttribute("class", "detail");

    // 2.1. curDetailLeft
    curMidCnt++;
    curDetailLeft = document.createElement("detail-left-side");
    curDetailLeft.setAttribute("class", "detail-left-side");
    var curLeftID =
      "Left@@@" +
      topics[i].quiz_type +
      "-" +
      topics[i].course +
      "_" +
      topics[i].main_subj +
      "_" +
      topics[i].mid_subj;
    curDetailLeft.setAttribute("id", curLeftID);

    /*    
    var curDetailLeftImg = document.createElement("img");
    curDetailLeftImg.setAttribute("class", "category");
    curDetailLeftImg.setAttribute("src", "img/hangul_writing.png");
*/
    var curDetailMidSbj = document.createElement("detail_mid_subj");
    curDetailMidSbj.setAttribute("class", "detail_mid_subj");

    curDetailMidSbj.innerText = curMidCnt.toString() + ". \n";
    topics[i].mid_explain = topics[i].mid_explain.replaceAll("\\", "\n");
    curDetailMidSbj.innerText += topics[i].mid_explain;

    if (topics[i].quiz_type.includes("youtube")) {
      curDetailLeft.classList.add("detail_left_subj");
      curDetailLeft.disabled = true;
    }

    // alert(windowWidth);
    /*  
    if (windowWidth > 600) {
      curDetailLeft.appendChild(curDetailLeftImg);
    }
*/
    curDetailLeft.appendChild(curDetailMidSbj);

    // 2.2. curDetailRight
    var curDetailRight = document.createElement("detail-right-side");
    curDetailRight.setAttribute("class", "detail-right-side");
    curProcCnt = 0;

    var midSearch = false;
    if (search_input.value.length > 0) {
      // alert(topics[i].mid_explain);
      if (
        topics[i].mid_explain
          .toLowerCase()
          .includes(search_input.value.toLowerCase()) > 0
      ) {
        midSearch = true;
      }
    }

    var maxLength = 0;
    // alert(topics[i].small_subjs.length);
    for (j = 0; j < topics[i].small_subjs.length; j++) {
      // alert(topics[i].small_subj_explains);
      if (topics[i].small_subj_explains[j].length > maxLength) {
        maxLength = topics[i].small_subj_explains[j].length;
      }
    }

    for (j = 0; j < topics[i].small_subjs.length; j++) {
      var curButton = document.createElement("button");
      var c, r, t;

      t = document.createElement("table");

      //1.test button
      r = t.insertRow(0);
      c = r.insertCell(0);
      var curBaseID =
        topics[i].quiz_type +
        "-" +
        topics[i].course +
        "_" +
        topics[i].main_subj +
        "_" +
        topics[i].mid_subj +
        "_" +
        topics[i].small_subjs[j];

      curButton.setAttribute("class", "test-button");
      if (maxLength > 10) {
        curButton.classList.add("test-high-button");
      }

      curButton.setAttribute("background-color", "lightblue");
      curButton.setAttribute("id", curBaseID);
      // curButton.setAttribute("class", "test-button");
      if (curProcCnt >= topics[i].open_course_cnt) {
        curButton.innerText = "🔒";
        curButton.disabled = true;
      } else {
        topics[i].small_subj_explains[j] = topics[i].small_subj_explains[
          j
        ].replaceAll("\\", "\n");
        if (topics[i].small_subj_explains[j].includes("*")) {
          topics[i].small_subj_explains[j] = topics[i].small_subj_explains[
            j
          ].replaceAll("*", "");
          curButton.classList.add("class", "test-checked");
        }
        curButton.innerText += topics[i].small_subj_explains[j];
      }

      var tmpLevel = getStarLevel(curButton.id);
      if (tmpLevel >= 3) {
        curButton.classList.add("test-finish");
        curButton.innerText += "😃";
      } else if (tmpLevel > 0) {
        curButton.classList.add("test-no-pass");
      } else curProcCnt++;

      if (search_input.value.length > 0) {
        if (
          !curButton.innerText.includes(search_input.value) > 0 &&
          midSearch == false
        ) {
          continue;
        }
      }

      c.appendChild(curButton);
      curRightCnt++;

      //2. wrong button
      var curWrongStorage;

      curWrongStorage = localStorage.getItem(curBaseID + "_wrong");

      if (
        curProcCnt < topics[i].open_course_cnt &&
        topics[i].main_subj != "video" &&
        topics[i].main_subj != "game" &&
        topics[i].main_subj != "advanced"
      ) {
        if (
          curWrongStorage != null &&
          curWrongStorage != "undefined" &&
          curWrongStorage.length > 2
        ) {
          curButton = document.createElement("button");
          r = t.insertRow(1);
          c = r.insertCell(0);

          curButton.setAttribute("id", curBaseID + "wrong");

          c.appendChild(curButton);

          curButton.setAttribute("class", "wrong-button test-wrong");
          curButton.innerText = "錯題";
          c.appendChild(curButton);
        }
      }

      //3. star
      r = t.insertRow(1);
      c = r.insertCell(0);
      c.setAttribute("style", "text-align:center");

      var tmpMessage = "";

      var k;
      if (
        curProcCnt < topics[i].open_course_cnt &&
        topics[i].main_subj != "game" &&
        topics[i].main_subj != "advanced" &&
        topics[i].main_subj != "video" &&
        !topics[i].quiz_type.includes("conversation")
      ) {
        var curClassID = curBaseID + "_class";
        if (topics[i].small_subj_html[j].startsWith("http")) {
          tmpMessage =
            '<button  onclick="location.href =' +
            "'" +
            topics[i].small_subj_html[j] +
            "'" +
            '"' +
            'class="class-button" id ="" ' +
            curClassID +
            ">課程 </button><span style='color:blue;'>";
        }

        if (
          topics[i].quiz_type.includes("conversation_m4a") ||
          topics[i].quiz_type.includes("conversation_mp3")
        ) {
          tmpMessage =
            '<button  class="conversation-test-button" id =" ' +
            curClassID +
            '">課程 </button><span style="color:blue;">';
        }

        tmpMessage =
          tmpMessage +
          "<span style='color:blue;'" +
          'id="' +
          curClassID +
          '_star" >';

        tmpMessage += showStar(tmpLevel);

        tmpMessage += "</span>";
        c.innerHTML = tmpMessage;
      }

      // curDetailRight.appendChild(curButton);
      curDetailRight.appendChild(t);
    }

    // 2.X. curDetail
    if (curRightCnt > 0) {
      curDetail.appendChild(curDetailLeft);
      curDetail.appendChild(curDetailRight);
      subject_view.appendChild(curDetail);
    }
  }
}

function getStarLevel(tmpQuiz) {
  var i;
  var curLevelStorage;

  for (i = 3; i > 0; i--) {
    curLevelStorage = localStorage.getItem(curCourse + "_level_" + i);

    if (
      curLevelStorage == null ||
      curLevelStorage == "undefined" ||
      curLevelStorage.length < 2
    ) {
      prevLevelStorage = curLevelStorage;
      continue;
    }
    if (curLevelStorage.includes(tmpQuiz + ";")) {
      break;
    }
  }

  return i;
}

function showStar(tmpLevel) {
  var returnStar = "";
  for (k = 0; k < tmpLevel; k++) {
    returnStar += "★";
  }
  for (; k < 3; k++) {
    returnStar += "✩";
  }
  return returnStar;
}
