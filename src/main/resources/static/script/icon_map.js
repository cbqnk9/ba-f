// 마커를 클릭했을 때 해당 장소의 상세정보를 보여줄 커스텀오버레이입니다
var placeOverlay = new kakao.maps.CustomOverlay({zIndex:1}),
    contentNode = document.createElement('div'), // 커스텀 오버레이의 컨텐츠 엘리먼트 입니다
    markers = [], // 마커를 담을 배열입니다
    currCategory = ''; // 현재 선택된 카테고리를 가지고 있을 변수입니다

var mapContainer = document.getElementById('map'), // 지도를 표시할 divg
    mapOption = {
        center: new kakao.maps.LatLng(37.557694280190645,126.92660457775837), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

// 지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places(map);

// 지도에 idle 이벤트를 등록합니다
kakao.maps.event.addListener(map, 'idle', searchPlaces);

// 커스텀 오버레이의 컨텐츠 노드에 css class를 추가합니다
contentNode.className = 'placeinfo_wrap';

// 커스텀 오버레이의 컨텐츠 노드에 mousedown, touchstart 이벤트가 발생했을때
// 지도 객체에 이벤트가 전달되지 않도록 이벤트 핸들러로 kakao.maps.event.preventMap 메소드를 등록합니다
addEventHandle(contentNode, 'mousedown', kakao.maps.event.preventMap);
addEventHandle(contentNode, 'touchstart', kakao.maps.event.preventMap);

// 커스텀 오버레이 컨텐츠를 설정합니다
placeOverlay.setContent(contentNode);

// 각 카테고리에 클릭 이벤트를 등록합니다
addCategoryClickEvent();

// 엘리먼트에 이벤트 핸들러를 등록하는 함수입니다
function addEventHandle(target, type, callback) {
    if (target.addEventListener) {
        target.addEventListener(type, callback);
    } else {
        target.attachEvent('on' + type, callback);
    }
}

// 카테고리 검색을 요청하는 함수입니다
function searchPlaces() {
    if (!currCategory) {
        return;
    }

    // 커스텀 오버레이를 숨깁니다
    placeOverlay.setMap(null);

    // 지도에 표시되고 있는 마커를 제거합니다
    removeMarker();

    ps.categorySearch(currCategory, placesSearchCB, {useMapBounds:true});
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {

        // 정상적으로 검색이 완료됐으면 지도에 마커를 표출합니다
        displayPlaces(data);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        // 검색결과가 없는경우 해야할 처리가 있다면 이곳에 작성해 주세요

    } else if (status === kakao.maps.services.Status.ERROR) {
        // 에러로 인해 검색결과가 나오지 않은 경우 해야할 처리가 있다면 이곳에 작성해 주세요

    }
}

// 지도에 마커를 표출하는 함수입니다
function displayPlaces(places) {
    const traUrl =
        "http://openapi.seoul.go.kr:8088/41706d4e7663627136385153447866/json/tbTraficElvtr/1/1000/"
    const url =
        "http://openapi.seoul.go.kr:8088/41706d4e7663627136385153447866/json/trafficSafetyA073PInfo/1/1000/"
    // 몇번째 카테고리가 선택되어 있는지 얻어옵니다
    // 이 순서는 스프라이트 이미지에서의 위치를 계산하는데 사용됩니다
    var order = document.getElementById(currCategory).getAttribute('data-order')
    console.log(order);
    if (order == 6 ){ //가연아 여기가 js 좌표로 찍어주는 거야
        console.log("help");
        fetch(traUrl)
            .then((res) => res.json())
            .then((myJson) => {
                const stores = myJson.tbTraficElvtr.row;

                for (var i = 0; i < stores.length; i++) {
                    var point = myJson.tbTraficElvtr.row[i].NODE_WKT;
                    var test = point.split(/[(|)| ]/);//value에서 좌표만 추출
                    // console.log(test[1],test[2]);
                    // 마커를 생성하고 지도에 표시합니다
                    addMarker(new kakao.maps.LatLng(test[2], test[1]), 6);
                }
            });
    }
    else if (order == 7){
        Proj4js.defs["EPSG:5186"] = "+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +units=m +no_defs";
        Proj4js.defs["EPSG:4326"] = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
        var s_srs = new Proj4js.Proj("EPSG:5186");
        var t_srs = new Proj4js.Proj("EPSG:4326");

        fetch(url)
            .then((res) => res.json())
            .then((myJson) => {
                //console.log(myJson.trafficSafetyA073PInfo.row);
                const stores = myJson.trafficSafetyA073PInfo.row;
                // console.log(stores.length)
                // console.log(stores[4].XCE)
                for(var j = 0; j< stores.length; j++) {
                    var x=stores[j].XCE; //5179 좌표계 x
                    var y=stores[j].YCE; //5179 좌표계 y

                    var pt = new Proj4js.Point(x,y); //포인트 생성
                    var result =Proj4js.transform(s_srs, t_srs, pt); //좌표계 변경
                    // console.log(result.x,result.y); //경도, 위도;

                    // 마커를 생성하고 지도에 표시합니다
                    // addMarker(new kakao.maps.LatLng(test[2], test[1]), 3);
                    addMarker(new kakao.maps.LatLng(result.y,result.x), 7);
                }
            });
    }
    else{
        for ( var i=0; i<places.length; i++ ) {

            // 마커를 생성하고 지도에 표시합니다
            var marker = addMarker(new kakao.maps.LatLng(places[i].y, places[i].x), order);

            // 마커와 검색결과 항목을 클릭 했을 때
            // 장소정보를 표출하도록 클릭 이벤트를 등록합니다
            (function(marker, place) {
                kakao.maps.event.addListener(marker, 'click', function() {
                    displayPlaceInfo(place);
                });
            })(marker, places[i]);
        }
    }
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(position, order) {
    let str = '/static/image/map/icon/here_blue.png';
    if (order == "0"){str = '/static/image/map/icon/subway.png';}
    else if (order == '1'){str = '/static/image/map/icon/hospital.png';}
    else if (order == '2'){str = '/static/image/map/icon/medic.png';}
    else if (order == '3'){str = '/static/image/map/icon/oil.png';}
    else if (order == '4'){str = '/static/image/map/icon/parking.png';}
    else if (order == '5'){str = '/static/image/map/icon/store.png';}
    else if (order == '6'){str = '/static/image/map/icon/elevator.png';}
    else if (order == '7'){str = '/static/image/map/icon/traffic.png';}
    else{
        str = '/static/image/map/icon/here_blue.png';
    }

    var imageSrc = str, // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new kakao.maps.Size(27, 38),  // 마커 이미지의 크기
        imgOptions =  {
            offset: new kakao.maps.Point(13.5, 28) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new kakao.maps.MarkerImage(str, imageSize, imgOptions),
        marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
            image: markerImage
        });

    marker.setMap(map); // 지도 위에 마커를 표출합니다
    markers.push(marker);  // 배열에 생성된 마커를 추가합니다

    return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
    for ( var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }
    markers = [];
}

// 클릭한 마커에 대한 장소 상세정보를 커스텀 오버레이로 표시하는 함수입니다
function displayPlaceInfo (place) {
    var content = '<div class="placeinfo">' +
        '   <a class="title" href="' + place.place_url + '" target="_blank" title="' + place.place_name + '">' + place.place_name + '</a>';

    if (place.road_address_name) {
        content += '    <span title="' + place.road_address_name + '">' + place.road_address_name + '</span>' +
            '  <span class="jibun" title="' + place.address_name + '">(지번 : ' + place.address_name + ')</span>';
    }  else {
        content += '    <span title="' + place.address_name + '">' + place.address_name + '</span>';
    }

    content += '    <span class="tel">' + place.phone + '</span>' +
        '</div>' +
        '<div class="after"></div>';

    contentNode.innerHTML = content;
    placeOverlay.setPosition(new kakao.maps.LatLng(place.y, place.x));
    placeOverlay.setMap(map);
}


// 각 카테고리에 클릭 이벤트를 등록합니다
function addCategoryClickEvent() {
    var category = document.getElementById('category'),
        children = category.children;

    for (var i=0; i<children.length; i++) {
        children[i].onclick = onClickCategory;
    }
}

// 카테고리를 클릭했을 때 호출되는 함수입니다
function onClickCategory() {
    var id = this.id,
        className = this.className;

    placeOverlay.setMap(null);

    if (className === 'on') {
        currCategory = '';
        changeCategoryClass();
        removeMarker();
    } else {
        currCategory = id;
        changeCategoryClass(this);
        searchPlaces();
    }
}

// 클릭된 카테고리에만 클릭된 스타일을 적용하는 함수입니다
function changeCategoryClass(el) {
    var category = document.getElementById('category'),
        children = category.children,
        i;

    for ( i=0; i<children.length; i++ ) {
        children[i].className = '';
    }

    if (el) {
        el.className = 'on';
    }
}

//현재 위치
function currentLocation() {
    // HTML5의 geolocation으로 사용할 수 있는지 확인합니다
    if (navigator.geolocation) {

        // GeoLocation을 이용해서 접속 위치를 얻어옵니다
        navigator.geolocation.getCurrentPosition(function(position) {

            var lat = position.coords.latitude, // 위도
                lon = position.coords.longitude; // 경도

            var locPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
            var message = '<div style="padding:5px;">현위치</div>'; // 인포윈도우에 표시될 내용입니다

            // 마커와 인포윈도우를 표시합니다
            displayMarker(locPosition, message);
        });
    } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

        var locPosition = new kakao.maps.LatLng(37.4812845080678, 126.952713197762),
            message = '현재 위치를 알 수 없어 기본 위치로 이동합니다.'

        currentLatLon['lat'] = 33.450701
        currentLatLon['lon'] = 126.570667

        displayMarker(locPosition, message);
    }
    return true
}

currentLocation();

//화면캡쳐 함수
function bodyShot() {
//전체 스크린 샷하기
    html2canvas(document.body)
        //document에서 body 부분을 스크린샷을 함.
        .then(
            function (canvas) {
//canvas 결과값을 drawImg 함수를 통해서
//결과를 canvas 넘어줌.
//png의 결과 값
                drawImg(canvas.toDataURL('image/png'));

//appendchild 부분을 주석을 풀게 되면 body
//document.body.appendChild(canvas);

//특별부록 파일 저장하기 위한 부분.
                saveAs(canvas.toDataURL(), 'file-name.png');
            }).catch(function (err) {
        console.log(err);
    });
}
function drawImg(imgData) {
    console.log(imgData);
//imgData의 결과값을 console 로그롤 보실 수 있습니다.
    return new Promise(function reslove() {
//내가 결과 값을 그릴 canvas 부분 설정
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
//canvas의 뿌려진 부분 초기화
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var imageObj = new Image();
        imageObj.onload = function () {
            ctx.drawImage(imageObj, 10, 10);
//canvas img를 그리겠다.
        };
        imageObj.src = imgData;
//그릴 image데이터를 넣어준다.

    }, function reject() { });

}
function saveAs(uri, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        link.href = uri;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        window.open(uri);
    }
}