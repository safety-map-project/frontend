var container = $('#map')[0];
var options = {
    center: new kakao.maps.LatLng(37.50497887258854, 127.06395865447985),
    level: 7
};
var kakaoMap = new kakao.maps.Map(container, options);

var polygon = null;

$(function() {

    let currentPolygon = null;

    // 리스트 요소를 클릭 했을 경우
    $(document).on('click', '.search-li', async function(e) {

        // console.log("리스트요소 클릭");

        try {
            const text = $('#searchTxt').val();
            const url = `http://localhost:8000/api/region?name=${encodeURIComponent(text)}`;
            $('#searchBtn').prop('disabled', true);
            const res = await fetch(url, {
                method: 'GET',
                // headers: {
                //     'Accept': 'application/json',
                //     "Content-Type": "application/json"
                // }
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('서버 오류:', res.status, errorText);
                return;
            }

            let data =  await res.json();
            console.log("응답 데이터:", data);
            panTo(data.centerCoords[0], data.centerCoords[1]);
            makePolygon(data.coords, data.zone);

        } catch (err) {
            console.error("요청 실패:", err);
            alert("데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            $('#searchBtn').prop('disabled', false);
        }

         
    });

    // 검색 버튼 클릭 시
    // $(document).on('click', '#searchBtn', async function(e) {

    //     console.log("검색버튼 클릭");

    //     let inputText = $('#searchTxt').val();
    //     if(inputText.includes('시') && inputText.includes('구')) { 
    //         try {
    //             const text = $('#searchTxt').val();
    //             const url = `http://localhost:8000/api/region?name=${encodeURIComponent(text)}`;
    //             const res = await fetch(url, {
    //                 method: 'GET',
    //                 headers: {
    //                     'Accept': 'application/json',
    //                     "Content-Type": "application/json"
    //                 }
    //             });
    //             let data = await res.json();
    //             console.log("응답 데이터: ", data);
    //             panTo(data.centerCoords[0], data.centerCoords[1]);
    //             makePolygon(data.coords, data.zone);
    //             $('#searchBtn').prop("disabled", true);

    //         } catch(err) {
    //             console.log("요청 실패: ", err);
    //             alert("데이터를 불러오는 중 오류가 발생했습니다.");
    //         } finally {
    //             $('#searchBtn').prop("disabled", false);
    //         }
    //     } else {
    //         return;
    //     }

    // });
    
    // 지도에 폴리곤 표시하는 함수
    function makePolygon(polygonArr, zoneStatus) {

        if(currentPolygon) {
            currentPolygon.setMap(null);
        }

        const polygonPath = polygonArr.map(coordPair =>
            new kakao.maps.LatLng(coordPair[0], coordPair[1])
        );
    
        const color = zoneStatus === 'danger' ? '#ed2415' : '#48b445'; // 위험지역이면 빨간색으로 표시
    
        const polygon = new kakao.maps.Polygon({
            path: polygonPath,
            strokeWeight: 3,
            strokeColor: color,
            strokeOpacity: 1,
            strokeStyle: 'solid',
            fillColor: color,
            fillOpacity: 0.3
        });
    
        polygon.setMap(map);

        currentPolygon = polygon;
    }
        

    // 사용자가 입력한 구의 중심좌표로 이동하는 함수
    function panTo(lat, lng) {
        map.panTo(new kakao.maps.LatLng(lat, lng));
    }

        
});
