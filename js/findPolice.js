// 중구, 서구, 동구, 남구, 북구 겹치는 지역 검색창 아래 시, 구 출력

import { searchBtn, searchTxt } from "./policList.js";
let value = null;

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
    
    searchWrap.style.display = "block";
    const ul = document.querySelector("#searchWrap ul");
    
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
            if(normalizeRegion(value) == region.gu){
                const li = document.createElement("li");
                li.className = "search-li";
                li.innerHTML = `
                    <span>${region.si + " " + region.gu}</span>
                `;
                ul.appendChild(li);
                
                const lis = document.querySelectorAll(".search-li");
                
                lis.forEach(li => {
                    li.addEventListener('click', e => {
                        searchTxt.value = li.textContent;
                        searchWrap.style.display = "none";
                    })
                })
                
            } 
        });
    })
})