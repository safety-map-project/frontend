// 파출소 목록 가져오는 js

// 검색창 input
const searchTxt = document.querySelector("#searchTxt");
// 검색창 버튼
const searchBtn = document.querySelector("#searchBtn");
// 검색창 파출소 div
const policeListWrap = document.querySelector("#policeListWrap");

// 주소 입력하고 검색 버튼 클릭 시
searchBtn.addEventListener("click", e => {

    // 입력창 값
    const input = searchTxt.value.trim();
    console.log(input);

    // 주소 입력하지 않으면 alert창 출력
    if(!input){
        alert("주소를 입력하세요!");
        return;
    }

    
    // policeListWrap div 표시됨
    policeListWrap.style.display = "block";

    console.log("클릭");

    // police 검색 리스트 ui html 추가
    policeListWrap.innerHTML = '<ul id="policeUl"></ul>';
});
