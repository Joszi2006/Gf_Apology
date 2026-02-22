/* ===== EMAILJS CONFIG — fill these in after setup ===== */
const EMAILJS_PUBLIC_KEY  = 'p-1G0QQbLh9uE2Fqc';
const EMAILJS_SERVICE_ID  = 'service_d5mr5u8';
const EMAILJS_TEMPLATE_ID = 'template_t0f8s3d';

emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

/* ===================================================== */

const openingMessage =
"I want to sincerely apologize for misunderstanding you ";

const apologyLetter = `
Dear Mama, I really messed up, and I'm so sorry for hurting you. I know I should have listened to you when you opened up to me how you felt about our relationship and when I stupidly didn't stressed you because I didn't communicate properly that I wanted to have the date tomorrow and you were eagerly rushing to get back home, and I regret not respecting your feelings. You mean the world to me, and the last thing I want is to cause you pain. Please forgive me for being so thoughtless. I promise to do better and be more considerate of your feelings in the future. I love you so much, and I hope we can move past this together. ❤️
`;

/* ===== TYPEWRITER with blinking cursor ===== */
function typeText(element, text, speed = 40, onDone = null) {
    let i = 0;
    element.innerHTML = '<span class="cursor">|</span>';
    const cursor = element.querySelector('.cursor');

    function typing() {
        if (i < text.length) {
            cursor.insertAdjacentText('beforebegin', text.charAt(i));
            i++;
            setTimeout(typing, speed);
        } else {
            cursor.classList.add('done');
            if (onDone) onDone();
        }
    }

    typing();
}

/* ===== SCENE TRANSITIONS ===== */
const scenes = document.querySelectorAll('.scene');
let currentScene = 0;

function goToScene(n) {
    const leaving = scenes[currentScene];

    /* Fade out current scene */
    leaving.style.opacity = '0';
    leaving.style.pointerEvents = 'none';

    /* After fade-out, swap active scene */
    setTimeout(() => {
        leaving.classList.remove('active');
        leaving.style.opacity = '';       /* reset inline style, let CSS take over */
        leaving.style.pointerEvents = '';

        currentScene = n;
        scenes[n].classList.add('active');
    }, 480);
}

/* ===== MUSIC — first click anywhere ===== */
let musicStarted = false;
window.addEventListener('click', () => {
    if (musicStarted) return;
    musicStarted = true;
    const music = document.getElementById('bgMusic');
    music.volume = 0.3;
    music.play().catch(() => {});
});

/* ===== SCENE 0: Page load — start typing, reveal button when done ===== */
window.onload = () => {
    typeText(document.getElementById('typingText'), openingMessage, 40, () => {
        const btn = document.getElementById('openLetterBtn');
        btn.classList.remove('hidden');
        btn.classList.add('fade-in-up');
    });
};

/* ===== SCENE 0 → 1: Open Letter button ===== */
document.getElementById('openLetterBtn').addEventListener('click', () => {
    goToScene(1);
});

/* ===== SCENE 1: Envelope click ===== */
const envelope3D = document.getElementById('envelope3D');

if (envelope3D) {
    let opened = false;

    envelope3D.addEventListener('click', () => {
        if (opened) return;
        opened = true;

        /* Step 1 — flap rotates (0–700ms) */
        envelope3D.classList.add('open');

        /* Step 2 — paper fades in via CSS at 1.2s delay
           Start typewriter at 1.65s (paper fully visible) */
        setTimeout(() => {
            const letterEl = document.getElementById('letter');

            typeText(letterEl, apologyLetter, 35, () => {
                /* Step 3 — 1 second after letter done, reveal question on same scene */
                setTimeout(() => {
                    const qBox = document.getElementById('questionBox');
                    qBox.classList.remove('hidden');
                    qBox.classList.add('fade-in-up');
                }, 1000);
            });
        }, 1650);
    });
}

/* ===== SCENE 2: No button dodge ===== */
const noBtn = document.getElementById('noBtn');

if (noBtn) {
    noBtn.addEventListener('mouseover', () => {
        const x = Math.random() * 220 - 110;
        const y = Math.random() * 80 - 40;
        noBtn.style.transform = `translate(${x}px, ${y}px)`;
    });

    noBtn.addEventListener('click', () => {
        const x = Math.random() * 300 - 150;
        const y = Math.random() * 100 - 50;
        noBtn.style.transform = `translate(${x}px, ${y}px)`;
    });
}

/* ===== SCENE 1 → 2: Yes button ===== */
document.getElementById('yesBtn').addEventListener('click', () => {
    goToScene(2);
});

/* ===== SCENE 2 → 3: Confirm date ===== */
document.getElementById('forgiveBtn').addEventListener('click', () => {
    const date = document.getElementById('dateChoice').value;
    const time = document.getElementById('timeChoice').value;

    if (!date) {
        alert('Please pick a date ❤️');
        return;
    }

    document.getElementById('dateResult').innerText =
        `${date} — ${time} ❤️`;

    /* Send email notification via EmailJS */
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        picked_date: date,
        picked_time: time,
    }).catch(() => {}); /* silently ignore if not configured yet */

    const calendarLink = document.getElementById('calendarLink');
    const eventText    = 'Our Date ❤️';
    const googleCalendarURL =
        'https://calendar.google.com/calendar/render?action=TEMPLATE' +
        '&text=' + encodeURIComponent(eventText) +
        '&dates=' + date.replace(/-/g, '') + '/' + date.replace(/-/g, '');

    calendarLink.textContent = '❤️ Add this date to your calendar (optional)';
    calendarLink.href = googleCalendarURL;

    goToScene(3);
});

/* ===== FLOATING HEARTS ===== */
const heartEmojis = ['❤️', '🩷', '💕', '💗', '💖'];

function spawnHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left             = (Math.random() * 95) + 'vw';
    heart.style.fontSize         = (Math.random() * 16 + 10) + 'px';
    heart.style.animationDuration = (Math.random() * 5 + 6) + 's';
    heart.style.opacity          = (Math.random() * 0.4 + 0.2).toFixed(2);
    document.body.appendChild(heart);
    heart.addEventListener('animationend', () => heart.remove());
}

setTimeout(() => {
    spawnHeart();
    setInterval(spawnHeart, 2200);
}, 1200);
