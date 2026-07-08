// 1. DOM 요소 선택
const timeLeftDisplay = document.querySelector('#time-left');
const statusText = document.querySelector('#status-text');
const startBtn = document.querySelector('#start-btn');
const pauseBtn = document.querySelector('#pause-btn');
const resetBtn = document.querySelector('#reset-btn');
const recordList = document.querySelector('#record-list');
const totalCountDisplay = document.querySelector('#total-count');
const clearRecordsBtn = document.querySelector('#clear-records-btn');

// 2. 타이머 상태 변수
let timerId = null;
let timeInSeconds = 1500; //기본 25분
let isFocusMode = true; // true: 집중, false: 휴식

// 3. LocalStorage에서 기존 기록 불러오기
let focusRecords = JSON.parse(localStorage.getItem('focusRecords')) || [];

// 초기 화면 갱신
updateRecordDOM();
document.body.classList.add('focus-mode');

// --- 타이머 기능 로직 ---

function updateDisplay() {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    // 00:00 형태로 포맷팅
    timeLeftDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startTimer() {
    if (timerId !== null) return; // 이미 실행 중이면 중복 실행 방지

    timerId = setInterval(() => {
        timeInSeconds--;
        updateDisplay();

        if (timeInSeconds <= 0) {
            clearInterval(timerId);


            if (isFocusMode) {
                // 집중 완료 시 기록 저장
                saveRecord();
                alert('25분 집중 완료! 5분간 휴식하세요.');

                // 휴식 모드로 전환
                isFocusMode = false;
                statusText.textContent = '휴식 시간 ☕';
                timeInSeconds = 5 * 60; // 5분
                document.body.classList.replace('focus-mode', 'break-mode');
            } else {
                alert('휴식 끝! 다시 집중해볼까요?');

                // 집중 모드로 전환
                isFocusMode = true;
                statusText.textContent = '집중 시간!';
                timeInSeconds = 25 * 60; // 25분
                document.body.classList.replace('break-mode', 'focus-mode');
            }
            updateDisplay();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerId);
    timerId = null;
}

function resetTimer() {
    pauseTimer();
    isFocusMode = true;
    statusText.textContent = '집중 시간!';
    timeInSeconds = 25 * 60;
    document.body.className = ''; // 클래스 리셋 후
    document.body.classList.add('focus-mode');
    updateDisplay();
}

// --- LocalStorage 및 DOM 조작 로직 ---

function saveRecord() {
    const now = new Date();
    // 현재 시간 포맷 (예: 14:35)
    const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    focusRecords.push({
        id: Date.now(),
        time: timestamp,
        message: '25분 집중 완료'
    });

    localStorage.setItem('focusRecords', JSON.stringify(focusRecords));
    updateRecordDOM();
}

function updateRecordDOM() {
    // 기존 목록 비우기
    recordList.innerHTML = '';

    // 기록 채우기
    focusRecords.forEach((record) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${record.message}</span> <small>${record.time}</small>`;
        recordList.appendChild(li);
    });

    // 총 횟수 업데이트
    totalCountDisplay.textContent = focusRecords.length;
}

function clearRecords() {
    if (confirm('모든 집중 기록을 삭제하시겠습니까?')) {
        focusRecords = [];
        localStorage.removeItem('focusRecords');
        updateRecordDOM();
    }
}


// 4. 이벤트 리스너 등록 (addEventListener)
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
clearRecordsBtn.addEventListener('click', clearRecords);