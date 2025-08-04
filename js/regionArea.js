$(function() {
    $('#searchBtn').on('click', async function(e) {
        e.preventDefault();
        const text = $('#searchTxt').val().trim();
        if (!text) {
            alert('검색어를 입력해 주세요');
            return;
        }

        $('#searchBtn').prop('disabled', true).text('검색 중...');
        try {
            const url = `http://localhost:8000/api/region?name=${encodeURIComponent(text)}`;
            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
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

            // 예: 화면에 표시
            // $('#result').text(JSON.stringify(data, null, 2));

        } catch (err) {
            console.error("요청 실패:", err);
            alert("데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            $('#searchBtn').prop('disabled', false).text('검색');
        }
    });
});
