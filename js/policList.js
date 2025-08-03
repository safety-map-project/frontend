// 파출소 목록 가져오는 js

// 검색창 input
const searchTxt = document.querySelector("#searchTxt");
// 검색창 버튼
const searchBtn = document.querySelector("#searchBtn");
// 검색창 파출소 div
const policeListWrap = document.querySelector("#policeListWrap");
let input = null;
let filterdData = [];

const sampleData = [
    { name: "강남 파출소", address: "서울 강남구 어딘가" },
    { name: "서초 파출소", address: "서울 서초구 어딘가" },
    { name: "종로 파출소", address: "서울 종로구 어딘가" },
    { name: "용산1 파출소", address: "서울 용산구1 어딘가" },
    { name: "중랑1 파출소", address : "서울 중랑구1 어딘가" },
    { name: "용산2 파출소", address: "서울 용산구2 어딘가" },
    { name: "중랑2 파출소", address : "서울 중랑구2 어딘가" },
    { name: "용산3 파출소", address: "서울 용산구3 어딘가" },
    { name: "중랑3 파출소", address : "서울 중랑구3 어딘가" },
    { name: "용산4 파출소", address: "서울 용산구4 어딘가" },
    { name: "중랑4 파출소", address : "서울 중랑구4 어딘가" },
    { name: "중랑5 파출소", address : "서울 중랑구5 어딘가" },
    { name: "중랑6 파출소", address : "서울 중랑구6 어딘가" }
  ];

// 주소 입력하고 검색 버튼 클릭 시
searchBtn.addEventListener("click", e => {

    // 입력창 값
    input = searchTxt.value.trim();
    console.log(input);

    // 주소 입력하지 않으면 alert창 출력
    if(!input){
        alert("주소를 입력하세요!");
        return;
    }

    filterdData = sampleData.filter(police => police.address.includes(input));
    if(filterdData.length === 0){
        alert("검색결과가 없습니다!");
        return;
    }
    

    renderIndex = 0;
    // policeListWrap div 표시됨
    policeListWrap.style.display = "block";

    console.log("클릭");

    // police 검색 리스트 ui html 추가
    policeListWrap.innerHTML = '<ul id="policeUl"></ul>';

    const ul = document.querySelector("#policeUl");

    renderNextLi(ul);

    // 렌더 완료 후 다음 이벤트 루프에서 크기 체크해서 추가 렌더링
    setTimeout(() => {
        // 컨텐츠 전체 높이가 실제 보여지는 크기보다 작고
        // 아직 렌더링되지 않은 데이터가 남아있으면
        if (policeListWrap.scrollHeight <= policeListWrap.clientHeight && renderIndex < sampleData.length) {
            // 리스트 다시 랜더링해서 스크롤 생성
            renderNextLi(ul);
        }
    }, 100);

});

policeListWrap.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = policeListWrap;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      const ul = document.querySelector("#policeUl");
      renderNextLi(ul);
    }
  });


  let renderIndex = 0; // 현재 렌더링된 인덱스
  const initIndex = 4; // 한 번에 보여줄 데이터 수
  
  
  function renderNextLi(ul) {
      // 더 이상 렌더링할 데이터가 없으면 종료
      if (renderIndex >= sampleData.length) return;
  
      const nextData = filterdData.slice(renderIndex, renderIndex + initIndex);
  
      nextData.forEach(police => {
          const li = document.createElement("li");
          li.className = "police-item";
          li.innerHTML = `
            <img src="/css/assets/before_list_police_icon.png" alt="파출소 아이콘">
            <div class="police-div">
              <p class="police-name">${police.name}</p>
              <p class="police-address">${police.address}</p>
            </div>
          `;
          ul.appendChild(li);
      });
  
      renderIndex += initIndex;
  
      console.log("현재 렌더링 index:", renderIndex);
  }
  