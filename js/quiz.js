// quiz.js — Quiz page logic

let quizData = null;
let quizDiff = 'beginner';
let score = 0;
let total = 0;

function initQuiz() {
  updateScore();
  document.getElementById('diff-beginner').classList.add('active');
}

function setDiff(diff, el) {
  quizDiff = diff;
  document.querySelectorAll('#diff-chips .cx-chip').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
}

async function generateQuiz() {
  setBtnState('quiz-btn', true);
  const qEl = document.getElementById('quiz-question');
  const optsEl = document.getElementById('quiz-options');
  const resEl = document.getElementById('quiz-result');

  qEl.textContent = '> GENERATING ' + quizDiff.toUpperCase() + ' CHALLENGE...';
  qEl.style.color = 'var(--yellow)';
  optsEl.innerHTML = '';
  resEl.textContent = '';
  quizData = null;

  const prompt = `Generate a single ${quizDiff} level cybersecurity MCQ question.
Topic can be anything from: OSI model, networking, ethical hacking phases, tools (nmap/metasploit/burp suite), attack types (SQLi/XSS/ARP/DDoS), cryptography, Linux commands, CEH concepts, ports/protocols.
Respond ONLY with valid JSON (no markdown, no backticks, no extra text):
{"q":"question text","options":["A. option","B. option","C. option","D. option"],"answer":"A","explanation":"why A is correct and others wrong in 2-3 sentences"}`;

  try {
    const text = await askGroq(prompt,
      'You are a cybersecurity quiz generator. Return ONLY valid compact JSON. No markdown. No backticks. No explanation outside the JSON.');
    const data = safeParseJSON(text);
    if (!data || !data.q || !data.options || !data.answer) throw new Error('Invalid quiz format received. Try again.');

    quizData = data;
    qEl.textContent = data.q;
    qEl.style.color = 'var(--yellow)';
    optsEl.innerHTML = '';

    data.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = opt;
      btn.onclick = () => checkAnswer(opt[0].toUpperCase(), btn);
      optsEl.appendChild(btn);
    });

    total++;
    updateScore();
  } catch (e) {
    qEl.textContent = '[ERROR] ' + e.message;
    qEl.style.color = 'var(--red)';
  }

  setBtnState('quiz-btn', false);
}

function checkAnswer(selected, clickedBtn) {
  if (!quizData) return;
  const opts = document.querySelectorAll('.quiz-option');
  opts.forEach(b => { b.disabled = true; });

  const correct = selected === quizData.answer.toUpperCase();

  if (correct) {
    clickedBtn.classList.add('correct');
    score++;
    Stats.inc('quiz_correct');
  } else {
    clickedBtn.classList.add('wrong');
    opts.forEach(b => {
      if (b.textContent[0].toUpperCase() === quizData.answer.toUpperCase()) {
        b.classList.add('correct');
      }
    });
  }

  const resEl = document.getElementById('quiz-result');
  resEl.style.color = correct ? 'var(--green)' : 'var(--red)';
  resEl.textContent = (correct ? '✓ CORRECT — ' : '✗ WRONG — ') + quizData.explanation;

  updateScore();
  Stats.inc('quiz_total');
}

function updateScore() {
  const el = document.getElementById('quiz-score');
  if (el) el.textContent = score + ' / ' + total;
}

function resetScore() {
  score = 0;
  total = 0;
  updateScore();
  document.getElementById('quiz-question').textContent = '[ Tap GENERATE CHALLENGE to start ]';
  document.getElementById('quiz-question').style.color = 'var(--yellow)';
  document.getElementById('quiz-options').innerHTML = '';
  document.getElementById('quiz-result').textContent = '';
}
