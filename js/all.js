let zoneSelect = document.getElementById('zoneSelect');
let zoneShowList = document.querySelector('.zoneList');
let paginition = document.querySelector('.paginition');
let hotZone = document.querySelector('.hotZone div');
let showData = [];
let originData = [];
//API
var data = new XMLHttpRequest();
data.open('GET','https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json','true');
data.send(null);

data.onload = function(){
    let str = JSON.parse(data.responseText);   
    originData = str.result.records;
    showData = originData;
    showSelectList();
    //updateList(showData);
    pageSet(showData,1);
}

//選單內容顯示
function showSelectList(){
    let str = '';
    let selectList = [];
    for(let i=0;i<showData.length;i++){
        selectList.push(showData[i].Zone);
        selectList = ([...new Set(selectList)]); //不加這行行政區會重複顯示，不太知道為什麼QQ
    }
    for(let j=0;j<selectList.length;j++){
        str+=
        `
            <option value="${selectList[j]}">${selectList[j]}</option>
        `
    }
    zoneSelect.innerHTML += str;
}
//參考資料:https://hsiangfeng.github.io/javascript/20190505/1432256317/
function pageSet(showData, nowPage){
    const perPage = 8;
    let dataLength = showData.length;
    let totalPage = Math.ceil(dataLength / perPage);
    let currentPage = nowPage;

    if(currentPage > totalPage){
        currentPage = totalPage;
    }
    //當前頁面*每頁筆數-當前顯示數量，因從第9筆開始所以再加1
    const minData = (currentPage * perPage) - perPage + 1;
    const maxData = currentPage * perPage;
    
    let data = [];
    showData.forEach((item, index) => {
        let num = index +1;
        if ( num >= minData && num <= maxData) 
        {
            data.push(item);
        }
    })
    const page = {
        totalPage,
        currentPage,
        hasPage: currentPage > 1,
        hasNext: currentPage < totalPage,
    }
    //
    updateList(data);
    pageBtn(page);
}

function pageBtn(page){
    let str= '';
    let total = page.totalPage;
    let currentPage = parseInt(page.currentPage);
    if(page.hasPage){
        str += `<li class="prev"><a href="#" data-page="${Number(page.currentPage) - 1}">Prev</a></li>`;
    }
    for(let i=1;i<=total;i++){
        if(i === currentPage){
            str += `<li><a href="#" class="active" data-page="${i}">${i}</a></li>`;
        }
        else if(Math.ceil(i/8) === Math.ceil(currentPage/8)){
            str += `<li><a href="#" data-page="${i}">${i}</a></li>`;
        }
    }
    if(page.hasNext){
        str += `<li class="next"><a href="#" data-page="${Number(page.currentPage) + 1}">Next</a></li>`;
    }
    paginition.innerHTML = str;
}

function switchPage(e){
    e.preventDefault();
    if(e.target.nodeName !== 'A') {return};
    const page = e.target.dataset.page;
    pageSet(showData, page);
}

//篩選資料後，將資料加入 showData 並作顯示
function showSelectData(e){
    e.preventDefault();
    showData = [];
    let zoneSelected = e.target.value;
    document.querySelector('.zoneName').textContent = zoneSelected;
    for(let i=0;i<originData.length;i++){
        if(zoneSelected == '全部行政區'){
            showData.push(originData[i]);
        }
        else if(zoneSelected == originData[i].Zone){
            showData.push(originData[i]);
        }
    }
    pageSet(showData,1);
}


//更新旅遊區列表
function updateList(items){
    let str = '';
    for(let i=0;i<items.length;i++){
        str +=      
        `
            <li>
                <a href="${items[i].Website}" target="_blank">
                    <div class="zoneImg d-flex ai-end jc-between" style="background: url(${items[i].Picture1});">
                        <h4>${items[i].Name}</h4>
                        <h5>${items[i].Zone}</h5>
                    </div>
                </a>
                <ul class="zoneInfo">
                    <li class="d-flex ai-center">
                        <img src="img/icons_clock.png" alt="icons_clock">
                        <p>${items[i].Opentime}</p>
                    </li>
                    <li class="d-flex ai-center">
                        <img src="img/icons_pin.png" alt="icons_pin">
                        <p>${items[i].Add}</p>
                    </li>                   
                    <li class="d-flex ai-center jc-between">
                        <div class="d-flex ai-center">
                            <img src="img/icons_phone.png" alt="icons_phone">
                            <p>${items[i].Tel}</p>
                        </div>
                        <div class="d-flex ai-center">
                            <img src="img/icons_tag.png" alt="icons_phone">
                            <p>${items[i].Ticketinfo}</p>
                        </div>
                    </li>   
                </ul>
            </li>
            `
    }
    zoneShowList.innerHTML = str;
}


zoneSelect.addEventListener('change',showSelectData,false);
hotZone.addEventListener('click',showSelectData,false);
paginition.addEventListener('click',switchPage,false)