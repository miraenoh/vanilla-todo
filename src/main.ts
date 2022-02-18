import "./style.css";

// 오늘 날짜 표시
const date = document.querySelector<HTMLHeadingElement>("#date");
date ? (date.innerText = new Date().toISOString().split("T")[0]) : null;
