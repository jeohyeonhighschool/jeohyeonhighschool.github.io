/**
 * MRC 로봇 동아리 웹페이지 스크립트
 * 모바일 우선 디자인 및 스크롤 애니메이션 적용
 */
document.addEventListener('DOMContentLoaded', function() {
    // 모든 기능 초기화
    initFeatures();
});

/**
 * 모든 기능 초기화
 */
function initFeatures() {
    // 토글 버튼 기능 초기화
    initToggleButtons();
    
    // 스크롤 애니메이션 및 인디케이터 초기화
    initScrollFeatures();
    
    // 헤더 인터랙션 효과 초기화
    initHeaderInteraction();
    
    // Letters Effect 초기화
    initLettersEffect();
    
    // 이미지 로딩 에러 처리
    handleImageErrors();
}

/**
 * 이미지 로딩 에러 처리
 */
function handleImageErrors() {
    // 모든 이미지에 에러 핸들러 추가
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            // 이미지 로드 실패 시 처리
            console.warn(`이미지 로드 실패: ${img.src}`);
            
            // 요소 유형에 따른 대체 처리
            if (img.parentElement.classList.contains('intro-icon')) {
                handleIntroIconError(img);
            } else if (img.parentElement.classList.contains('project-image')) {
                handleProjectImageError(img);
            }
        });
    });
}

/**
 * 인트로 아이콘 에러 처리
 */
function handleIntroIconError(img) {
    // 이모지로 대체
    const emojiMap = {
        '설계 제작 아이콘.png': '🔧',
        '프로그래밍 아이콘.png': '🤖',
        '드론 이미지.png': '✈️'
    };
    
    // 파일명 추출
    const filename = img.src.split('/').pop();
    
    // 해당 이모지로 대체하거나 기본 이모지 사용
    const emoji = emojiMap[filename] || '📌';
    
    // 부모 요소를 이모지로 대체
    img.parentElement.innerHTML = emoji;
    img.parentElement.style.cssText = 'font-size: 2.5rem; display: flex; align-items: center; justify-content: center;';
}

/**
 * 프로젝트 이미지 에러 처리
 */
function handleProjectImageError(img) {
    // 프로젝트 이미지인 경우 기본 단색 배경으로 대체
    img.parentElement.style.background = '#4361EE';
    
    // 프로젝트 설명에 따라 적절한 아이콘 표시
    const projectTitle = img.parentElement.parentElement.querySelector('h3').textContent.toLowerCase();
    let icon = '🤖'; // 기본 아이콘
    
    if (projectTitle.includes('ev3') || projectTitle.includes('로봇')) {
        icon = '🤖';
    } else if (projectTitle.includes('아두이노') || projectTitle.includes('게임')) {
        icon = '🎮';
    } else if (projectTitle.includes('자동차')) {
        icon = '🚗';
    }
    
    // 아이콘 요소 생성
    const iconElement = document.createElement('div');
    iconElement.textContent = icon;
    iconElement.style.cssText = 'font-size: 5rem; color: white; display: flex; align-items: center; justify-content: center; height: 100%;';
    
    // 이미지 부모 요소에 아이콘 추가
    img.parentElement.appendChild(iconElement);
    img.style.display = 'none';
}

/**
 * 토글 버튼 기능 초기화
 */
function initToggleButtons() {
    // 모든 토글 버튼에 이벤트 리스너 추가
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 현재 버튼의 부모 요소(meaning-box 또는 project-content)
            const box = this.parentElement;
            
            // 박스 확장/축소 상태 전환
            box.classList.toggle('expanded');
            
            // 버튼 텍스트 변경
            this.textContent = box.classList.contains('expanded') ? '접기' : '더 보기';
        });
    });
}

/**
 * Letters Effect 초기화
 */
function initLettersEffect() {
    // 모든 meaning-box 요소 가져오기
    const meaningBoxes = document.querySelectorAll('.meaning-box');
    
    if (meaningBoxes.length === 0) return;
    
    // Intersection Observer 옵션
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2 // 20% 보이면 콜백 실행
    };
    
    // Intersection Observer 생성
    const boxObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const letters = entry.target.querySelectorAll('h3 .letter');
            
            if (entry.isIntersecting) {
                // 박스가 화면에 들어오면 글자 효과 보이기
                letters.forEach((letter, index) => {
                    setTimeout(() => {
                        letter.classList.remove('ghost');
                    }, 100 * index);
                });
            } else {
                // 박스가 화면에서 벗어나면 글자 효과 숨기기
                letters.forEach(letter => {
                    letter.classList.add('ghost');
                });
            }
        });
    }, observerOptions);
    
    // 각 meaning-box 관찰 시작
    meaningBoxes.forEach(box => {
        boxObserver.observe(box);
        
        // 마우스 호버 효과
        box.addEventListener('mouseenter', () => {
            const letters = box.querySelectorAll('h3 .letter');
            letters.forEach((letter, index) => {
                setTimeout(() => {
                    letter.classList.remove('ghost');
                }, 50 * index);
            });
        });
        
        box.addEventListener('mouseleave', () => {
            // 스크롤 위치가 현재 섹션에 있지 않을 때만 숨기기
            const boxRect = box.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            if (boxRect.top > windowHeight || boxRect.bottom < 0) {
                const letters = box.querySelectorAll('h3 .letter');
                letters.forEach(letter => {
                    letter.classList.add('ghost');
                });
            }
        });
    });
}

/**
 * 스크롤 관련 기능 초기화 (애니메이션 및 인디케이터)
 */
function initScrollFeatures() {
    // 스크롤 애니메이션 초기화
    initScrollAnimations();
    
    // 스크롤 인디케이터 초기화
    initScrollIndicator();
}

/**
 * 스크롤 애니메이션 초기화
 */
function initScrollAnimations() {
    // 애니메이션이 필요한 요소들
    const animatedElements = {
        sections: document.querySelectorAll('section'),
        introItems: document.querySelectorAll('.intro-item'),
        meaningBoxes: document.querySelectorAll('.meaning-box'),
        projectCards: document.querySelectorAll('.project-card'),
        conclusion: document.querySelector('.conclusion'),
        joinContainer: document.querySelector('.join-container')
    };
    
    // Intersection Observer 옵션
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    // 섹션 Intersection Observer
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // 필요 없는 관찰은 중지
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 아이템 Intersection Observer (지연 효과 적용)
    const itemObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // 아이템마다 지연 시간을 다르게 설정
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100); // 100ms 간격으로 나타나도록
                
                // 필요 없는 관찰은 중지
                itemObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 모든 섹션 관찰 시작
    animatedElements.sections.forEach(section => {
        sectionObserver.observe(section);
    });
    
    // 개별 요소 관찰 시작
    Object.entries(animatedElements).forEach(([key, elements]) => {
        if (key !== 'sections' && elements) {
            if (NodeList.prototype.isPrototypeOf(elements)) {
                elements.forEach(element => {
                    itemObserver.observe(element);
                });
            } else if (elements) {
                itemObserver.observe(elements);
            }
        }
    });
}

/**
 * 스크롤 인디케이터 초기화
 */
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (!scrollIndicator) return;
    
    scrollIndicator.addEventListener('click', function() {
        // 첫 번째 섹션으로 부드럽게 스크롤
        const firstSection = document.querySelector('section');
        if (firstSection) {
            window.scrollTo({
                top: firstSection.offsetTop - 20,
                behavior: 'smooth'
            });
        }
    });
    
    // 스크롤 시 인디케이터 숨기기
    window.addEventListener('scroll', function() {
        scrollIndicator.style.opacity = window.scrollY > 100 ? '0' : '1';
    });
}

/**
 * 헤더 인터랙션 효과 초기화
 */
function initHeaderInteraction() {
    const header = document.querySelector('header');
    
    if (!header) return;
    
    const logo = header.querySelector('.logo');
    const tagline = header.querySelector('.tagline');
    
    // 마우스 움직임에 따른 흐름 효과
    header.addEventListener('mousemove', function(e) {
        // 마우스 위치에 따른 상대 위치 (0~1 범위)
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / header.offsetHeight;
        
        // 이동 범위 (픽셀 단위)
        const moveX = 20 * (x - 0.5);
        const moveY = 20 * (y - 0.5);
        
        // 로고 및 태그라인 움직임 (반대 방향으로)
        if (logo) logo.style.transform = `translate(${-moveX}px, ${-moveY}px)`;
        if (tagline) tagline.style.transform = `translate(${-moveX * 0.5}px, ${-moveY * 0.5}px)`;
    });
    
    // 마우스 이벤트 종료 시 원위치
    header.addEventListener('mouseleave', function() {
        if (logo) logo.style.transform = 'translate(0, 0)';
        if (tagline) tagline.style.transform = 'translate(0, 0)';
    });
}