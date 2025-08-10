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
      title: 'Step 1: Deposit USDC',
      description:
        'Start by depositing USDC into your AvantisFi account. You remain in control of your funds at all times.'
    },
    {
      title: 'Step 2: Select asset & leverage',
      description:
        'Pick a market—crypto, forex or metals—and choose your leverage. AvantisFi offers leverage up to 500× on select assets.'
    },
    {
      title: 'Step 3: Confirm your trade',
      description:
        'Choose long or short and execute your order. Thanks to positive slippage and zero fees, you enter at a fair price.'
    },
    {
      title: 'Step 4: Track P/L',
      description:
        'Watch your position update in real time. When you are ready, close your trade and withdraw your gains back to your wallet.'
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
      question: 'On which network is AvantisFi currently deployed?',
      options: ['Ethereum Mainnet', 'Base', 'Solana'],
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
      const result = document.createElement('div');
      result.className = 'quiz-result';
      result.textContent = `You scored ${quizScore} out of ${quizQuestions.length}!`;
      quizContainer.appendChild(result);
    }
  }

  function handleQuizAnswer(selected) {
    const current = quizQuestions[quizIndex];
    if (selected === current.answer) {
      quizScore++;
    }
    quizIndex++;
    renderQuiz();
  }
  renderQuiz();
});
