let curWeb = "learn";
let defaultCourse = "korean";

let courseSubjList = [
	{ course: "chinese", subj: "word,video" },
	{
		course: "english",
		subj: "word,spell,grammer,listen,video,business,person",
	},
	{ course: "japan", subj: "word,spell,video,news" },
	{ course: "korean", subj: "word,spell,listen,writing,grammer,video,news" },
	{ course: "cejk", subj: "speak,grammer" },
	{ course: "computer", subj: "os,db,programming,data,devops,web" },
	{ course: "learn", subj: "calc,game,video" },
];

let defaultCourseSubjMap = new Map([
	["chinese", "word"],
	["english", "word"],
	["japan", "word"],
	["korean", "word"],
	["cejk", "speak"],
	["computer", "os"],
	["learn", "calc"],
]);

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
	["speak", "會話"],
	//電腦
	["os", "OS"],
	["db", "DB"],
	["data", "Data"],
	["programming", "程式"],
	["web", "Web"],
	["devops", "DevOps"],
]);
