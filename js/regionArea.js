$(function() {
    $('#searchBtn').on('click', async function() {
        try {
            const text = $('#searchTxt').val();
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

            const data =  await res.json();
            // console.log("응답 데이터:", data);
            // panTo(37.496486063, 127.028361548);
            makePolygon(data);

        } catch (err) {
            console.error("요청 실패:", err);
            alert("데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            $('#searchBtn').prop('disabled', false); // 검색 버튼 비활성화
        }

         
    });

        // 지도에 폴리곤 표시하는 함수
        function makePolygon(responseJsonArr) {

            var container = $('#map')[0];
            var options = {
                center: new kakao.maps.LatLng(37.496486063, 127.028361548),
                level: 7
            };

            var map = new kakao.maps.Map(container, options);

            const polygonPath = responseJsonArr
                .map(coordPair => 
                    new kakao.maps.LatLng(coordPair[0], coordPair[1])
            );

           // 지도에 표시할 다각형을 생성합니다
            var polygon = new kakao.maps.Polygon({
                    map: map,
                    path:polygonPath, // 그려질 다각형의 좌표 배열입니다
                    strokeWeight: 3, // 선의 두께입니다
                    strokeColor: '#ed2415', // 선의 색깔입니다
                    strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
                    strokeStyle: 'solid', // 선의 스타일입니다
                    fillColor: '#ed2415', // 채우기 색깔입니다
                    fillOpacity: 0.3 // 채우기 불투명도 입니다
            });

            // 지도에 다각형을 표시합니다
            polygon.setMap(map);        
            map.relay;
            // console.log(polygon.getMap());

        }

        // 사용자가 입력한 구의 중심좌표로 이동하는 함수
        // (나중에 중심좌표 구하는 거 구현해야됨)
        function panTo(lat, lng) {
            var moveLatLon = new kakao.maps.LatLng(lat, lng);
            map.panTo(moveLatLon);
        }
});
