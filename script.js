// script.js
// Implements scroll navigation, section progress indicator, the interactive
// demo and quiz for the AvantisFi educational site.

document.addEventListener('DOMContentLoaded', () => {
  const sections = Array.from(document.querySelectorAll('.section'));
  const dots = Array.from(document.querySelectorAll('.progress-dot'));
  const nextButtons = Array.from(document.querySelectorAll('.next-btn'));

  /**
   * Scroll to a specific section by index.
   * @param {number} idx
   */
  function scrollToSection(idx) {
    if (sections[idx]) {
      sections[idx].scrollIntoView({ behavior: 'smooth' });
    }
  }

  /**
   * Update which dot is active based on scroll position.
   */
  function updateProgress() {
    let activeIndex = 0;
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + scrollY;
      if (scrollY + viewportHeight / 2 >= sectionTop) {
        activeIndex = index;
      }
    });
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIndex);
    });
  }

  // Attach click handlers to progress dots
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => scrollToSection(idx));
  });

  // Attach click handlers to "Next" buttons
  nextButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const currentSection = btn.parentElement;
      const currentIndex = sections.indexOf(currentSection);
      scrollToSection(currentIndex + 1);
    });
  });

  // Update progress on scroll
  window.addEventListener('scroll', updateProgress);
  updateProgress();

  /* Demo logic */
  const demoSteps = [
    {
      title: 'Step 1: Choose wallet mode',
      description:
        'Two options: (A) Smart wallet enabled → deposit a small amount of ETH for gas; USDC stays in your EOA. (B) No smart wallet → trade directly from your EOA.'
    },
    {
      title: 'Step 2: Select asset & leverage',
      description:
        'Pick a market—crypto, forex or metals—and choose your leverage. AvantisFi offers leverage up to 500× on select assets.'
    },
    {
      title: 'Step 3: Execute trade',
      description:
        'With gas abstraction (smart wallet mode), opening/closing requires no extra signatures. In EOA-only mode, you sign normally.'
    },
    {
      title: 'Step 4: Track P/L',
      description:
        'Monitor your position in real time. When you are ready, close your trade and withdraw your gains back to your wallet. Fees are only taken from profits.'
    }
  ];
  const demoContainer = document.getElementById('demo-container');
  let demoIndex = 0;

  function renderDemoStep() {
    demoContainer.innerHTML = '';
    const step = demoSteps[demoIndex];
    const stepEl = document.createElement('div');
    stepEl.className = 'demo-step active';
    const header = document.createElement('h3');
    header.textContent = step.title;
    const para = document.createElement('p');
    para.textContent = step.description;
    const buttons = document.createElement('div');
    buttons.className = 'demo-buttons';
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Back';
    prevBtn.disabled = demoIndex === 0;
    prevBtn.addEventListener('click', () => {
      if (demoIndex > 0) {
        demoIndex--;
        renderDemoStep();
      }
    });
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = demoIndex === demoSteps.length - 1 ? 'Finish' : 'Next';
    nextBtn.addEventListener('click', () => {
      if (demoIndex < demoSteps.length - 1) {
        demoIndex++;
        renderDemoStep();
      }
    });
    buttons.appendChild(prevBtn);
    buttons.appendChild(nextBtn);
    stepEl.appendChild(header);
    stepEl.appendChild(para);
    stepEl.appendChild(buttons);
    demoContainer.appendChild(stepEl);
  }
  renderDemoStep();

  /* Quiz logic */
  const quizQuestions = [
    {
      question: 'Which asset classes can you trade on AvantisFi?',
      options: [
        'Only crypto tokens',
        'Crypto & forex',
        'Crypto, forex & commodities'
      ],
      answer: 2
    },
    {
      question: 'What is the maximum leverage AvantisFi offers on select assets?',
      options: ['10×', '100×', '500×'],
      answer: 2
    },
    {
      question: 'Which mechanism provides a rebate on certain losses?',
      options: ['Gas refund', 'Loss rebates', 'Liquidity mining'],
      answer: 1
    },
    {
      question: 'How are gas and trade funds handled with gas abstraction?',
      options: [
        'USDC in smart wallet; ETH in EOA',
        'ETH in smart wallet for gas; USDC stays in EOA',
        'Both ETH and USDC in smart wallet'
      ],
      answer: 1
    },
    {
      question: 'Can you trade without a smart wallet?',
      options: [
        'No, smart wallet is mandatory',
        'Yes, directly from your EOA',
        'Only for closing trades'
      ],
      answer: 1
    },
    {
      question: 'How can liquidity providers customise their exposure?',
      options: [
        'By selecting risk tranches and time locks',
        'By choosing random tokens',
        'They cannot customise exposure'
      ],
      answer: 0
    }
  ];
  const quizContainer = document.getElementById('quiz-container');
  let quizIndex = 0;
  let quizScore = 0;
  // Store the user's selected answer for each question so we can
  // display which were missed and what the correct answers were.  When
  // the user retakes the quiz, this array will be reset.
  let userAnswers = [];

  function renderQuiz() {
    quizContainer.innerHTML = '';
    if (quizIndex < quizQuestions.length) {
      const q = quizQuestions[quizIndex];
      const wrapper = document.createElement('div');
      wrapper.className = 'quiz-question';
      const h3 = document.createElement('h3');
      h3.textContent = `Q${quizIndex + 1}. ${q.question}`;
      wrapper.appendChild(h3);
      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'quiz-options';
      q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.addEventListener('click', () => handleQuizAnswer(idx));
        optionsDiv.appendChild(btn);
      });
      wrapper.appendChild(optionsDiv);
      quizContainer.appendChild(wrapper);
    } else {
      // Quiz completed: show score, missed questions and correct answers,
      // and provide a button to retake the quiz.
      const resultWrapper = document.createElement('div');
      resultWrapper.className = 'quiz-result';
      // Score summary
      const scoreEl = document.createElement('p');
      scoreEl.textContent = `You scored ${quizScore} out of ${quizQuestions.length}!`;
      resultWrapper.appendChild(scoreEl);
      // Details for questions answered incorrectly
      quizQuestions.forEach((q, idx) => {
        if (userAnswers[idx] !== q.answer) {
          const missEl = document.createElement('div');
          missEl.style.marginTop = '1rem';
          missEl.innerHTML =
            `<strong>Q${idx + 1}: ${q.question}</strong><br>` +
            `Your answer: ${q.options[userAnswers[idx]] ?? 'No answer'}<br>` +
            `Correct answer: ${q.options[q.answer]}`;
          resultWrapper.appendChild(missEl);
        }
      });
      // Retake button to restart the quiz
      const retakeBtn = document.createElement('button');
      retakeBtn.style.marginTop = '1.5rem';
      retakeBtn.textContent = 'Retake Quiz';
      retakeBtn.addEventListener('click', () => {
        quizIndex = 0;
        quizScore = 0;
        userAnswers = [];
        renderQuiz();
      });
      resultWrapper.appendChild(retakeBtn);
      quizContainer.appendChild(resultWrapper);
    }
  }

  function handleQuizAnswer(selected) {
    const current = quizQuestions[quizIndex];
    // Record the user's answer for this question
    userAnswers[quizIndex] = selected;
    if (selected === current.answer) {
      quizScore++;
    }
    quizIndex++;
    renderQuiz();
  }
  renderQuiz();
});