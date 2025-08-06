$(function() {

    var container = $('#map')[0];
    var options = {
        center: new kakao.maps.LatLng(37.50497887258854, 127.06395865447985),
        level: 7
    };

    var map = new kakao.maps.Map(container, options);

    $('#searchBtn').on('click', async function(e) {
        e.preventDefault();
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
            console.log("응답 데이터:", data);
            // console.log(data.centerCoord[0], data.centerCoord[1]);

            // if()
            panTo(data.centerCoord[0], data.centerCoord[1]);
            makePolygon(data.coords);

        } catch (err) {
            console.error("요청 실패:", err);
            alert("데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            $('#searchBtn').prop('disabled', false); // 검색 버튼 비활성화
        }

         
    });


        // 지도에 폴리곤 표시하는 함수
        function makePolygon(polygonArr) {
            const polygonPath = polygonArr
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
            // map.relay;
            // console.log(polygon.getMap());

        }

        // 사용자가 입력한 구의 중심좌표로 이동하는 함수
        function panTo(lat, lng) {
            map.panTo(new kakao.maps.LatLng(lat, lng));

            // var markerPosition = new kakao.maps.LatLng(lat, lng);
            // var marker = new kakao.maps.Marker({
            //     position: markerPosition
            // });

            // marker.setMap(map);

        }
});
