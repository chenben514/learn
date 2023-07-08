let curWeb = "computer";
let defaultCourse = "db";

let courseSubjList = [
	{ course: "os", subj: "linux" },
	{ course: "db", subj: "mariadb,mongodb,cassandra" },
	{ course: "data", subj: "spark,kafka,nats,cloud,etl" },
	{ course: "devops", subj: "azure,docker" },
	{ course: "programming", subj: "proc,c,c++,java,python,dotnet" },
	{ course: "web", subj: "html,css,javascript,react,express,nodejs" },
];

let defaultCourseSubjMap = new Map([
	["os", "linux"],
	["db", "mariadb"],
	["data", "spark"],
	["devops", "azure"],
	["programming", "proc"],
	["web", "html"],
]);

let subjMap = new Map([
	["linux", "Linux"],
	["mariadb", "MariaDB"],
	["mongodb", "MongoDB"],
	["cassandra", "Cassandra"],
	["spark", "Spark"],
	["kafka", "Kafka"],
	["nats", "NATS"],
	["cloud", "Cloud"],
	["azure", "Azure"],
	["docker", "Docker"],
	["proc", "Pro*C"],
	["c", "C"],
	["c++", "C++"],
	["java", "Java"],
	["python", "Python"],
	["dotnet", "DotNet"],
	["html", "HTML"],
	["css", "CSS"],
	["javascript", "JavaScript"],
	["react", "React"],
	["express", "Express"],
	["nodejs", "NodeJS"],
	["etl", "ETL"],
]);
