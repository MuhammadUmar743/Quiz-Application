
const QUIZ = [
  {id:1, text:'Which HTML element is used for the largest heading?', options:['<head>','<h1>','<heading>','<title>'], correct:1},
  {id:2, text:'Which CSS property controls text color?', options:['font-style','color','text-color','font-color'], correct:1},
  {id:3, text:'Which JavaScript keyword declares a constant?', options:['let','var','const','static'], correct:2},
  {id:4, text:'Which method adds an item to the end of an array?', options:['push','pop','shift','unshift'], correct:0},
  {id:5, text:'What does DOM stand for?', options:['Document Object Model','Data Object Model','Desktop Object Model','Document Oriented Model'], correct:0}
];

const state = { currentIndex: 0, answers: new Array(QUIZ.length).fill(null) };
const root = document.getElementById('quiz-root');
const tpl = document.getElementById('question-template');

function render() {
  root.innerHTML = '';
  const node = tpl.content.cloneNode(true);

  const qText = node.querySelector('[data-qtext]');
  const optsContainer = node.querySelector('[data-options]');
  const prevBtn = node.querySelector('[data-prev]');
  const nextBtn = node.querySelector('[data-next]');
  const currentEl = node.querySelector('[data-current]');
  const totalEl = node.querySelector('[data-total]');
  const progressEl = node.querySelector('[data-progress]');

  const q = QUIZ[state.currentIndex];
  qText.textContent = q.text;

  q.options.forEach((opt, i) => {
    const label = document.createElement('label');
    label.className = 'option';
    const radio = document.createElement('input');
    radio.type = 'radio'; radio.name = 'option'; radio.value = i;

    if (state.answers[state.currentIndex] === i) {
      radio.checked = true; label.classList.add('selected');
    }

    function select() {
      optsContainer.querySelectorAll('.option').forEach(el => el.classList.remove('selected'));
      label.classList.add('selected');
      radio.checked = true;
      state.answers[state.currentIndex] = i;
    }

    label.appendChild(radio);
    const span = document.createElement('span');
    span.innerHTML = opt.replace(/</g,'&lt;').replace(/>/g,'&gt;');
    label.appendChild(span);
    label.addEventListener('click', select);
    label.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' '){e.preventDefault();select();} });
    optsContainer.appendChild(label);
  });

  prevBtn.disabled = state.currentIndex === 0;
  prevBtn.addEventListener('click', ()=>{ if(state.currentIndex>0){state.currentIndex--;render();} });

  nextBtn.addEventListener('click', ()=>{ 
    if(state.currentIndex < QUIZ.length-1){
      state.currentIndex++;
      render();
    } else {
      showResultPage(); // ✅ New function call
    }
  });

  currentEl.textContent = state.currentIndex + 1;
  totalEl.textContent = QUIZ.length;
  progressEl.style.width = Math.round(((state.currentIndex)/(QUIZ.length-1))*100) + '%';

  root.appendChild(node);
}

function showResultPage() {
  root.innerHTML = '';
  let score = 0;
  QUIZ.forEach((question, idx) => {
    if (state.answers[idx] === question.correct) score++;
  });

  const resultDiv = document.createElement('div');
  resultDiv.className = 'result-page';
  resultDiv.style.textAlign = 'center';
  resultDiv.innerHTML = `
    <h2>🎉 Quiz Completed!</h2>
    <p style="font-size:18px;">Your Score: <strong>${score}</strong> / ${QUIZ.length}</p>
    ${score === QUIZ.length 
      ? `<p style="color:var(--success);font-weight:600;">Congratulations! 🏆 You got all answers correct!</p>`
      : `<p style="color:var(--muted);">Brother/Sister Sorry you Failed xx!</p>`
    }
    <button onclick="location.reload()" style="margin-top:15px;padding:10px 20px;border-radius:8px;">Restart Quiz</button>
  `;
  root.appendChild(resultDiv);
}

render();


