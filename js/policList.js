// 파출소 목록 가져오는 js

// 검색창 input
const searchTxt = document.querySelector("#searchTxt");
// 검색창 버튼
const searchBtn = document.querySelector("#searchBtn");
// 검색창 파출소 div
const policeListWrap = document.querySelector("#policeListWrap");

// 검색창 input 값
searchTxt.addEventListener("input", e => {
    console.log(e.target.value);
})

searchBtn.addEventListener("click", e => {
    console.log("클릭");
    policeListWrap.innerHTML = '<ul id="policeUl"></ul>';
});
