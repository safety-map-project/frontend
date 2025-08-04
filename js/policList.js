// 파출소 목록 가져오는 js

// 검색창 input
const searchTxt = document.querySelector("#searchTxt");
// 검색창 버튼
const searchBtn = document.querySelector("#searchBtn");
// 검색창 파출소 div
const policeListWrap = document.querySelector("#policeListWrap");
let input = null; // 검새창에서 가져온 값
let filterdData = []; // 검색한 결과의 police를 담는 배열
let policeData = []; // fetch로 가져온 police 모든 데이터 담는 배열

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

// 거리계산함수(Haversine 공식)
function getDistance(lat1, lon1, lat2, lon2){
    lat1 = Number(lat1);
    lon1 = Number(lon1);
    lat2 = Number(lat2);
    lon2 = Number(lon2);

    const R = 6371e3; // 지구 반지름
    const q1 = lat1 * Math.PI / 180;
    const q2 = lat2 * Math.PI / 180;
    const dlat = (lat2 - lat1) * Math.PI / 180;
    const dlng = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dlat / 2) ** 2 +
        Math.cos(q1) * Math.cos(q2) *
        Math.sin(dlng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}


// 주소 입력하고 검색 버튼 클릭 시
searchBtn.addEventListener("click", e => {

    // 입력창 값
    input = searchTxt.value.trim();

    // 주소 입력하지 않으면 alert창 출력
    if(!input){
        alert("주소를 입력하세요!");
        return;
    }

    fetch("http://localhost:8000/test2", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
        })
        .then(res => res.json())
        .then(data => {
            policeData = data;
            const normalizedInput = normalizeRegion(input);   
            
            filterdData = policeData.filter(police => {
                if (!police.address) return false;
                const normalizedAddress = normalizeRegion(police.address);
                return normalizedAddress.includes(normalizedInput);
            });

            // 사용자 현재 위치 
            navigator.geolocation.getCurrentPosition(function(pos){
                const userLat = pos.coords.latitude;
                const userLng = pos.coords.longitude;
            
                // 각 파출소와의 거리 계산
                filterdData.forEach(police => {
                    police.distance = getDistance(userLat, userLng, police.lat, police.lng);
                });
            
                // 거리에 따른 오름차순 정렬
                const sorted = filterdData.sort((a, b) => a.distance - b.distance);
            
                // 정렬된 배열로 덮어쓰기
                filterdData = sorted;
            
                if(filterdData.length === 0){
                    alert("검색결과가 없습니다!");
                    return;
                }
            
                // 초기화
                renderIndex = 0;
                // policeListWrap 다시 표시
                policeListWrap.style.display = "block";
                policeListWrap.innerHTML = '<ul id="policeUl"></ul>';
            
                const ul = document.querySelector("#policeUl");
                renderNextLi(ul);
            
                setTimeout(() => {
                    // 컨텐츠 높이보다 실제 보여지는 크기가 똑같거나 크고
                    // 로딩되어야하는 데이터가 있을 경우
                    if (policeListWrap.scrollHeight <= policeListWrap.clientHeight && renderIndex < filterdData.length) {
                        // 남은 데이터 추가 랜더링
                        renderNextLi(ul);
                    }
                }, 100);
            });
            
        })
        .catch(error => console.error("police 데이터 로드 실패:", error))

});

policeListWrap.addEventListener("scroll", () => {
    // 현재 스크롤 위치, 컨텐츠 전체 높이, policeListWrap에서 실제 보여지는 크기 구조분해할당
    const { scrollTop, scrollHeight, clientHeight } = policeListWrap;
    // 거의 끝까지 스크롤하면
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      const ul = document.querySelector("#policeUl");
      // 남은 데이터 추가 랜더링
      renderNextLi(ul);
    }
  });


let renderIndex = 0; // 현재 렌더링된 인덱스
const initIndex = 4; // 한 번에 보여줄 데이터 수
  
function renderNextLi(ul) {
      // 더 이상 렌더링할 데이터가 없으면 종료
      if (renderIndex >= filterdData.length) return;
  
      // 현재 인덱스부터 4개까지 보여줌
      const nextData = filterdData.slice(renderIndex, renderIndex + initIndex);
  
      nextData.forEach(police => {
          const li = document.createElement("li");
          li.className = "police-item";
          li.innerHTML = `
            <img src="/css/assets/before_list_police_icon.png" alt="파출소 아이콘">
            <div class="police-div">
              <p class="police-name">${police.name}</p>
              <span>${police.distance}</span>
              <p class="police-address">${police.address}</p>
            </div>
          `;
          ul.appendChild(li);
      });
  
      renderIndex += initIndex;
  
}
  