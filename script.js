const timeLeftDisplay = document.querySelector('#time-left'); //dom시간
const startButton = document.querySelector('#start-btn'); //시작버튼
const stopButton = document.querySelector('#pause-btn'); //정지버튼
const resetButton = document.querySelector('#reset-btn'); //리셋버튼
const recordList = document.querySelector('#record-list'); //완료 리스트
const totalCount = document.querySelector('#total-count'); //
const clearButton = document.querySelector('#clear-records-btn'); //리셋버튼
const title = document.querySelector('#title'); //타이틀



let timerId = null; //setInterval()함수가 실행중인지 알기 위한 변수
let isMinutes = 25; //초기 시간 저장(집중시 *25 / 휴식시 * 5 )
let isSeconds = isMinutes * 60; //반복할 때 중복되지 않기 위해 미리 1500초 만들어놓기
let isFocus = true; // 현재 상태 저장(집중or휴식)

//초기화면

document.body.classList.add('focus-mode'); //배경색 집중모드

//localStorage에 있는 문자열을 가져오기 위한 코드
//JSON문자열을 가져온 후 JSON.parse로 js객체에 저장.
let focusRecord = JSON.parse(localStorage.getItem('focusRecord')) || [];
//focusRecord에 저장된 객체를 그려줌.
updateRecodDOM();
//초기화면을 그려줌
updateDisplay();


// 1. 초기화면 그려주기
function updateDisplay() {
    let minutes = Math.floor(isSeconds / 60); //분
    let seconds = isSeconds % 60; //초

    //00:00 형태로 포맷팅
    timeLeftDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    document.title = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds} 🍅뽀모도로`;

}


//1. 타이머 시작
function startTimer() {
    if (timerId !== null) { //타이머가 이미 실행중이면 실행하지 않는다.(중복방지)
        return;
    }
    timerId = setInterval(() => {
        isSeconds--; //화면 시간 -1

        if (isSeconds <= 0) {
            clearInterval(timerId); //setInterval을 종료해줌
            timerId = null;


            if (isFocus) { //isfocus == true 집중상태에서 0초가 되었을 때 들어옴.
                saverecord(); //현재 시간을 저장
                isFocus = false; //현재 상태를 false; ==휴식상태로 바꿈
                isSeconds = 300; //5분타이머 설정
                document.body.classList.remove('focus-mode');
                document.body.classList.add('break-mode'); //화면을 휴식화면으로 바꿔줌
            } else {
                isFocus = true; // isFocus==flase(휴식상태)일 때 타이머가 0초가되면 실행
                isMinutes = 25;
                isSeconds = isMinutes * 60;
                document.body.classList.remove('break-mode');
                document.body.classList.add('focus-mode');
            }
        }

        updateDisplay(); //업데이트된 정보를 화면에 다시 그려줌
    }, 0.1); //1초마다 실행 1000ms

}

function pauseTimer() { //정지버튼
    clearInterval(timerId); //setInterval을 종료해줌
    timerId = null;
}

function resetTimer() { //리셋버튼
    pauseTimer(); //타이머 정지
    isSeconds = 1500; // 타이머 25분으로 초기화
    isFocus = true; //집중상태로 바꿈
    timerId = null; //타이머가 작동하지 않는다는 것을 알려줌
    document.body.classList.add('focus-mode');
    document.body.classList.remove('break-mode'); //배경을 집중상태로 바꿈
    updateDisplay(); //초기화된 정보를 바탕으로 화면을 다시 그림
}
//dom조작

function saverecord() {
    const now = new Date();
    const timeStamp = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    focusRecord.push({
        id: Date.now(),
        time: timeStamp,
        message: '✌️ 집중시간 25분 종료'
    });

    localStorage.setItem('focusRecord', JSON.stringify(focusRecord));
    updateRecodDOM();
}

//list를 다시 그리기 위한 코드
function updateRecodDOM() {
    //원래 있던 요소 비움
    recordList.innerHTML = '';

    focusRecord.forEach(item => {
        const list = document.createElement("li")
        list.innerHTML = `<span>${item.message}</span> <small>${item.time}</small>`
        recordList.appendChild(list);

    });
    totalCount.textContent = focusRecord.length; //총 반복 횟수
};

function clearReacod() {
    if (confirm("정말 삭제하시겠습니까?")) {
        focusRecord = [];
        localStorage.removeItem('focusRecord');
        updateRecodDOM();
    }
}



startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
clearButton.addEventListener('click', clearReacod);