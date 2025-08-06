// 중구, 서구, 동구, 남구, 북구 겹치는 지역 검색창 아래 시, 구 출력

import { searchBtn, searchTxt } from "./policList.js";
let value = null; // 검색창에서 받은 input값

// 주소 비교하기 위해 표준화함
function normalizeRegion(str) {
return str
    .replace(/서울특별시|서울시/g, '서울')
    .replace(/인천광역시|인천시/g, '인천')
    .replace(/대구광역시|대구시/g, '대구')
    .replace(/부산광역시|부산시/g, '부산')
    .replace(/대전광역시|대전시/g, '대전')
    .replace(/광역시/g, '')  // 광역시 같은 단어 제거
    .replace(/특별시/g, '')  // 특별시 같은 단어 제거
    .replace(/\s/g, '')      // 공백 제거
}

searchBtn.addEventListener('click', e => {
    
    value = searchTxt.value.trim();
    
    // 입력한 값에 시가 포함되면
    if(value.includes('시')){
        // 중복되는 지역 리스트 숨김
        searchWrap.style.display = "none";
    } else {
        // 시 포함안되면 중복되는 리스트 표시함
        searchWrap.style.display = "block";
    }

    const ul = document.querySelector("#searchWrap ul");

    // 검색 버튼 클릭 하고
    // ul 초기화함
    ul.innerHTML = "";
    
    // 지역테이블의 시, 구를 json형태로 fetch로 가져옴
    fetch("http://localhost:8000/api/region/sigu", {
        method: "GET",
        headers : {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(data => {
        data.forEach(region => {
            // 입력한 값과 지역의 구 이름이 같으면
            if(normalizeRegion(value) == region.gu){
                // li 생성해서 시와 구를 리스트에 출력
                const li = document.createElement("li");
                li.className = "search-li";
                li.innerHTML = `
                    <span>${region.si + " " + region.gu}</span>
                `;
                ul.appendChild(li);
                
                const lis = document.querySelectorAll(".search-li");

                lis.forEach(li => {
                    // li 하나 클릭 시
                    li.addEventListener('click', e => {
                        // 검색창에 클릭한 li text인 시, 구가 들어가고
                        searchTxt.value = li.textContent.trim();
                        // 시, 구 리스트를 표시 안함
                        searchWrap.style.display = "none";
                    })
                })
                // 입력한 값과 지역의 시가 같으면
            } else if(normalizeRegion(value) == region.si){
                // 표시안함
                searchWrap.style.display = "none";
            } 
        });
    })
})