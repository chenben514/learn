let curWeb = "learn";
let defaultCourse = "korean";

let courseSubjList = [
	{ course: "chinese", subj: "word,idiom,video,match" },
	{
		course: "english",
		subj: "word,spell,grammer,listen,video,business,person,story,match",
	},
	{ course: "japan", subj: "word,spell,video,news,match" },
	{
		course: "korean",
		subj: "word,spell,listen,writing,grammer,video,news,match,story",
	},
	{ course: "cejk", subj: "speak,word,grammer,song" },
	{ course: "computer", subj: "os,db,programming,data,devops,web" },
	{ course: "learn", subj: "graph,calc,game,video,person" },
];

let defaultCourseSubjMap = new Map([
	["chinese", "word"],
	["english", "word"],
	["japan", "word"],
	["korean", "word"],
	["cejk", "speak"],
	["computer", "os"],
	["learn", "graph"],
]);

let subjMap = new Map([
	["word", "字彙"],
	["video", "影片"],
	["idiom", "成語"],
	["match", "配對"],
	["person", "創作"],
	["business", "商業"],
	["calc", "數學"],
	["game", "遊戲"],
	["grammer", "文法"],
	["listen", "聽力"],
	["spell", "拼寫"],
	["writing", "書寫"],
	["news", "新聞"],
	["speak", "會話"],
	["song", "歌曲"],
	["graph", "圖型"],
	["story", "故事"],
	//電腦
	["os", "OS"],
	["db", "DB"],
	["data", "Data"],
	["programming", "程式"],
	["web", "Web"],
	["devops", "DevOps"],
]);
