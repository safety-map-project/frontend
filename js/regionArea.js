$(function() {
    $('#searchBtn').on('click', async function(e) {
        // e.preventDefault();
        const text = $('#searchTxt').val().trim();
        if (!text) {
            alert('검색어를 입력해 주세요');
            return;
        }

        try {
            const url = `http://localhost:8000/api/region?name=${encodeURIComponent(text)}`;
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('서버 오류:', res.status, errorText);
                alert(`서버 오류: ${res.status}`);
                return;
            }

            const data = await res.json();
            console.log("응답 데이터:", data);
            makePolygon(data);

        } catch (err) {
            console.error("요청 실패:", err);
            alert("데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            $('#searchBtn').prop('disabled', false).text('검색'); // 검색 버튼 비활성화
        }

        // 지도에 폴리곤 표시하는 함수
        function makePolygon(responseJsonArr) {
            const coordPairs = responseJsonArr[0]; // 좌표 쌍 배열들을 감싸는 outerArray
            for(let i=0; i<coordPairs.size; i++) {
                console.log(coordPairs[i]);
            }

            var mapContainer = $('#map')[0],
                mapOption = {
                    center: new kakao.maps.LatLng(37.525595035818185, 127.00857798633956),
                    level: 3
                };

            var map = new kakao.maps.Map(mapContainer, mapOption);

            // console.log(coordPairs);

            const polygonPath = coordPairs
                .map(pair => new kakao.maps
                                    .LatLng(pair[1], pair[0])
                        );

            console.log(polygonPath);

           // 지도에 표시할 다각형을 생성합니다
        var polygon = new kakao.maps.Polygon({
            path:polygonPath, // 그려질 다각형의 좌표 배열입니다
            strokeWeight: 3, // 선의 두께입니다
            strokeColor: '#39DE2A', // 선의 색깔입니다
            strokeOpacity: 0.8, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle: 'longdash', // 선의 스타일입니다
            fillColor: '#A2FF99', // 채우기 색깔입니다
            fillOpacity: 0.7 // 채우기 불투명도 입니다
        });

        // 지도에 다각형을 표시합니다
        polygon.setMap(map);        

        } 
    });
});
