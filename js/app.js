/**
 * Deutsch Grammatik Master v2.0
 */

const APP = {
  version: '2.0.0',
  storageKey: 'grammatikMaster_v2',

  init() {
    this.initTheme();
    this.initNavigation();
    this.initTabs();
    this.initSearch();
    this.loadProgress();
    this.updateUI();
    this.updateThemeIcon();
  },

  initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    this.updateThemeIcon();
  },

  updateThemeIcon() {
    const btn = document.getElementById('themeBtn');
    if (!btn) return;
    const current = document.documentElement.getAttribute('data-theme');
    btn.textContent = current === 'dark' ? '☀️' : '🌙';
    btn.title = current === 'dark' ? 'Light Mode' : 'Dark Mode';
  },

  initNavigation() {
    const toggle = document.querySelector('.nav-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('show');
    });
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('show');
    });
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar-nav a').forEach(a => {
      if (a.getAttribute('href').includes(path)) a.classList.add('active');
    });
  },

  initTabs() {
    document.querySelectorAll('.tabs').forEach(tabGroup => {
      const tabs = tabGroup.querySelectorAll('.tab');
      const panels = tabGroup.parentElement.querySelectorAll('.tab-panel');
      tabs.forEach((tab, i) => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          panels.forEach(p => p.classList.remove('active'));
          tab.classList.add('active');
          if (panels[i]) {
            panels[i].classList.add('active');
            // Trigger init for exercises in this panel
            this.initExercisesForPanel(panels[i]);
          }
        });
      });
    });
  },

  initExercisesForPanel(panel) {
    // Initialize any exercise containers in this panel
    const quizContainer = panel.querySelector('[id$="-quiz"]');
    const inputContainer = panel.querySelector('[id$="-input"]');
    const testContainer = panel.querySelector('[id$="-test"]');
    const flashContainer = panel.querySelector('[id$="-flashcards"]');
    const satzContainers = panel.querySelectorAll('[id^="sa"]');

    if (quizContainer && !quizContainer.dataset.init && typeof window.initQuiz === 'function') {
      window.initQuiz(quizContainer.id);
    }
    if (inputContainer && !inputContainer.dataset.init && typeof window.initInput === 'function') {
      window.initInput(inputContainer.id);
    }
    if (testContainer && !testContainer.dataset.init && typeof window.initTest === 'function') {
      window.initTest(testContainer.id);
    }
    if (flashContainer && !flashContainer.dataset.init && typeof window.initFlash === 'function') {
      window.initFlash(flashContainer.id);
    }
    if (satzContainers.length > 0 && !satzContainers[0].dataset.init && typeof window.initSatz === 'function') {
      window.initSatz();
    }
  },

  initSearch() {
    const input = document.getElementById('globalSearch');
    const resultsBox = document.getElementById('searchResults');
    if (!input) return;
    const pages = [
      { title: 'Dashboard', url: 'index.html', snippets: ['Ubersicht', 'Fortschritt', 'Lernpfad'] },
      { title: 'Wortarten Grundlagen', url: 'pages/wortarten-grundlagen.html', snippets: ['Nomen', 'Adjektiv', 'Pronomen', 'Partikel', 'Verb'] },
      { title: 'Nomen', url: 'pages/nomen.html', snippets: ['Genus', 'Plural', 'Kasus', 'Nominativ', 'Akkusativ', 'Dativ', 'Genitiv', 'Deklination'] },
      { title: 'Adjektiv', url: 'pages/adjektiv.html', snippets: ['Steigerung', 'Deklination', 'Komparativ', 'Superlativ'] },
      { title: 'Pronomen', url: 'pages/pronomen.html', snippets: ['Personalpronomen', 'Relativpronomen', 'Possessivpronomen', 'Demonstrativpronomen'] },
      { title: 'Partikel', url: 'pages/partikel.html', snippets: ['Adverb', 'Konjunktion', 'Praposition', 'Interjektion', 'Wechselpraposition'] },
      { title: 'Verben', url: 'pages/verben.html', snippets: ['Stammformen', 'Zeiten', 'Konjunktiv', 'Modalverb', 'Imperativ'] },
      { title: 'Aktiv & Passiv', url: 'pages/aktiv-passiv.html', snippets: ['Passiv', 'Vorgangspassiv', 'Zustandspassiv', 'werden'] },
      { title: 'Indirekte Rede', url: 'pages/indirekte-rede.html', snippets: ['Konjunktiv I', 'Konjunktiv II', 'wurde-Form'] },
      { title: 'Uebungen', url: 'pages/uebungen.html', snippets: ['Quiz', 'Luckentext', 'Prufung'] },
      { title: 'Prufungssimulation', url: 'pages/pruefung.html', snippets: ['Test', 'Prufung', 'Simulation'] },
      { title: 'Zusammenfassung', url: 'pages/zusammenfassung.html', snippets: ['Merkblatt', 'Zusammenfassung', 'Lernen'] },
    ];
    input.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) { resultsBox.classList.remove('show'); return; }
      const matches = pages.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.snippets.some(s => s.toLowerCase().includes(q))
      );
      if (matches.length === 0) {
        resultsBox.innerHTML = '<div style="padding:1rem;color:var(--text-muted);text-align:center;">Keine Ergebnisse</div>';
      } else {
        resultsBox.innerHTML = matches.map(m =>
          '<a href="' + m.url + '" class="search-result-item">' +
          '<div class="search-result-title">' + m.title + '</div>' +
          '<div class="search-result-snippet">' + m.snippets.slice(0, 3).join(' &middot; ') + '</div>' +
          '</a>'
        ).join('');
      }
      resultsBox.classList.add('show');
    });
    document.addEventListener('click', (e) => {
      if (!input.contains(e.target) && !resultsBox.contains(e.target)) {
        resultsBox.classList.remove('show');
      }
    });
  },

  progress: {},

  loadProgress() {
    try { this.progress = JSON.parse(localStorage.getItem(this.storageKey)) || {}; }
    catch { this.progress = {}; }
  },

  saveProgress() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
    this.updateUI();
  },

  getProgress(category, section) {
    if (!this.progress[category]) this.progress[category] = {};
    if (section) {
      if (!this.progress[category][section]) this.progress[category][section] = { completed: 0, total: 0 };
      return this.progress[category][section];
    }
    const cat = this.progress[category];
    let completed = 0, total = 0;
    Object.values(cat).forEach(v => {
      if (typeof v === 'object' && v.total !== undefined) {
        completed += v.completed || 0;
        total += v.total || 0;
      }
    });
    return { completed, total };
  },

  addProgress(category, section, correct) {
    const p = this.getProgress(category, section);
    p.total++;
    if (correct) p.completed++;
    this.saveProgress();
  },

  addWrongQuestion(category, question, correctAnswer, explanation) {
    if (!this.progress._wrong) this.progress._wrong = [];
    this.progress._wrong.push({ category, question, correctAnswer, explanation, date: Date.now() });
    this.saveProgress();
  },

  markVisited(page) {
    if (!this.progress._visited) this.progress._visited = [];
    if (!this.progress._visited.includes(page)) {
      this.progress._visited.push(page);
    }
    if (!this.progress._days) this.progress._days = {};
    const today = new Date().toISOString().split('T')[0];
    if (!this.progress._days[today]) this.progress._days[today] = 0;
    this.progress._days[today]++;
    this.saveProgress();
  },

  updateUI() {
    document.querySelectorAll('[data-stat]').forEach(el => {
      const key = el.dataset.stat;
      if (key === 'visited') el.textContent = (this.progress._visited || []).length;
      if (key === 'totalExercises') {
        let total = 0;
        Object.keys(this.progress).forEach(k => {
          if (!k.startsWith('_')) total += this.getProgress(k).total;
        });
        el.textContent = total;
      }
    });
    document.querySelectorAll('[data-progress-category]').forEach(el => {
      const cat = el.dataset.progressCategory;
      const section = el.dataset.progressSection || null;
      const p = this.getProgress(cat, section);
      const pct = p.total ? Math.round((p.completed / p.total) * 100) : 0;
      const fill = el.querySelector('.progress-bar-fill');
      if (fill) fill.style.width = pct + '%';
      const txt = el.querySelector('.progress-text');
      if (txt) txt.textContent = pct + '%';
    });
  },

  resetProgress() {
    if (confirm('Mochtest du wirklich ALLES zurucksetzen?')) {
      this.progress = {};
      localStorage.removeItem(this.storageKey);
      location.reload();
    }
  }
};

/* ===== EXERCISE ENGINE ===== */
class ExerciseEngine {
  constructor(containerId, questions, category, section) {
    this.container = document.getElementById(containerId);
    this.questions = questions;
    this.category = category;
    this.section = section || 'quiz';
    this.current = 0;
    this.correct = 0;
    this.showQuestion();
  }

  showQuestion() {
    if (this.current >= this.questions.length) { this.showResult(); return; }
    const q = this.questions[this.current];
    const pct = (this.current / this.questions.length) * 100;
    const baseUrl = location.pathname.includes('/pages/') ? '../index.html' : 'index.html';

    this.container.innerHTML =
      '<div class="exercise-card animate-in">' +
        '<div class="exercise-progress">' +
          '<div class="exercise-progress-bar"><div class="exercise-progress-fill" style="width:' + pct + '%"></div></div>' +
          '<span class="exercise-progress-text">' + (this.current + 1) + '/' + this.questions.length + '</span>' +
        '</div>' +
        '<div class="exercise-question">' +
          '<div class="exercise-question-text">' + q.question + '</div>' +
          (q.hint ? '<div class="exercise-hint">' + q.hint + '</div>' : '') +
        '</div>' +
        '<div class="exercise-options" id="opts"></div>' +
        '<div class="exercise-feedback" id="feedback"></div>' +
        '<div class="exercise-actions" id="actions" style="display:none;">' +
          '<button class="btn btn-primary" id="nextBtn">Weiter &rarr;</button>' +
        '</div>' +
      '</div>';

    const opts = this.container.querySelector('#opts');
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'exercise-option';
      btn.innerHTML = '<span class="opt-marker">' + String.fromCharCode(65 + i) + '</span><span>' + opt + '</span>';
      btn.addEventListener('click', () => this.checkAnswer(i));
      opts.appendChild(btn);
    });

    this.container.querySelector('#nextBtn').addEventListener('click', () => {
      this.current++; this.showQuestion();
    });
  }

  checkAnswer(selected) {
    const q = this.questions[this.current];
    const opts = this.container.querySelectorAll('.exercise-option');
    const feedback = this.container.querySelector('#feedback');
    const actions = this.container.querySelector('#actions');

    opts.forEach((opt, i) => {
      opt.classList.add('disabled');
      if (i === q.answer) opt.classList.add('correct');
      if (i === selected && i !== q.answer) opt.classList.add('incorrect');
    });

    const isCorrect = selected === q.answer;
    if (isCorrect) this.correct++;
    else APP.addWrongQuestion(this.category, q.question, q.options[q.answer], q.explanation);
    APP.addProgress(this.category, this.section, isCorrect);

    feedback.className = 'exercise-feedback show ' + (isCorrect ? 'correct' : 'incorrect');
    feedback.innerHTML = isCorrect
      ? 'Richtig! ' + (q.explanation || 'Gut gemacht.')
      : 'Falsch. ' + (q.explanation || 'Die richtige Antwort war: <strong>' + q.options[q.answer] + '</strong>');

    actions.style.display = 'flex';
  }

  showResult() {
    const pct = Math.round((this.correct / this.questions.length) * 100);
    let msg = '', icon = '';
    if (pct === 100) { icon = '&#127942;'; msg = 'Perfekt! Alle Fragen richtig beantwortet!'; }
    else if (pct >= 80) { icon = '&#127775;'; msg = 'Sehr gut! Fast alles richtig.'; }
    else if (pct >= 60) { icon = '&#128077;'; msg = 'Gut gemacht! Noch etwas uben.'; }
    else { icon = '&#128170;'; msg = 'Weiter uben! Du wirst immer besser.'; }
    const baseUrl = location.pathname.includes('/pages/') ? '../index.html' : 'index.html';

    this.container.innerHTML =
      '<div class="exercise-card exercise-result animate-in">' +
        '<div style="font-size:4rem;margin-bottom:0.5rem;">' + icon + '</div>' +
        '<h2>Ergebnis</h2>' +
        '<div class="score">' + this.correct + '/' + this.questions.length + '</div>' +
        '<div class="score-label">' + pct + '% richtig</div>' +
        '<p class="score-msg">' + msg + '</p>' +
        '<div class="exercise-actions">' +
          '<button class="btn btn-secondary" onclick="location.reload()">Nochmal uben</button>' +
          '<a href="' + baseUrl + '" class="btn btn-primary">Dashboard</a>' +
        '</div>' +
      '</div>';
  }
}

/* ===== INPUT EXERCISE ENGINE ===== */
class InputExerciseEngine {
  constructor(containerId, questions, category, section) {
    this.container = document.getElementById(containerId);
    this.questions = questions;
    this.category = category;
    this.section = section || 'input';
    this.showAll();
  }

  showAll() {
    let html = '<div class="exercise-card" style="padding:1.5rem;">';
    html += '<div class="exercise-progress"><div class="exercise-progress-bar"><div class="exercise-progress-fill" id="inputProgress"></div></div></div>';
    html += '<div class="input-exercise">';
    this.questions.forEach((q, i) => {
      const width = Math.max(q.answer.length * 14 + 30, 100);
      html += '<div class="input-row" data-idx="' + i + '">';
      html += '<span class="text-part">' + (i + 1) + '. ' + q.before + '</span>';
      html += '<input type="text" data-answer="' + q.answer + '" autocomplete="off" placeholder="..." style="width:' + width + 'px">';
      if (q.after) html += '<span class="text-part">' + q.after + '</span>';
      html += '</div>';
    });
    html += '</div>';
    html += '<div class="exercise-actions"><button class="btn btn-primary" id="checkInputs">Antworten prufen</button></div>';
    html += '<div id="inputFeedback" style="margin-top:1rem;"></div>';
    html += '</div>';
    this.container.innerHTML = html;
    this.container.querySelector('#checkInputs').addEventListener('click', () => this.checkAnswers());
  }

  checkAnswers() {
    const rows = this.container.querySelectorAll('.input-row');
    let correct = 0;
    rows.forEach(row => {
      const input = row.querySelector('input');
      const ans = input.dataset.answer.toLowerCase().trim().split('|');
      const val = input.value.toLowerCase().trim();
      const isCorrect = ans.includes(val) && val !== '';
      input.classList.remove('correct', 'incorrect');
      input.classList.add(isCorrect ? 'correct' : 'incorrect');
      if (isCorrect) correct++;
    });
    const pct = Math.round((correct / rows.length) * 100);
    const fb = this.container.querySelector('#inputFeedback');
    const icon = pct >= 80 ? '&#9989;' : pct >= 60 ? '&#9888;&#65039;' : '&#10060;';
    const color = pct >= 80 ? 'success' : pct >= 60 ? 'warning' : 'error';
    const msg = pct >= 80 ? 'Hervorragend!' : pct >= 60 ? 'Gut, aber noch etwas uben.' : 'Nicht aufgeben! Wiederhole die Theorie.';
    fb.innerHTML = '<div class="callout callout-' + color + '"><span class="callout-icon">' + icon + '</span><div class="callout-content"><p><strong>' + correct + '/' + rows.length + ' richtig</strong> (' + pct + '%) &ndash; ' + msg + '</p></div></div>';
    APP.addProgress(this.category, this.section, pct >= 80);
    this.container.querySelector('#inputProgress').style.width = pct + '%';
  }
}

/* ===== FLASHCARD ENGINE ===== */
class FlashcardEngine {
  constructor(containerId, cards) {
    this.container = document.getElementById(containerId);
    this.cards = cards;
    this.current = 0;
    this.showCard();
  }

  showCard() {
    if (this.current >= this.cards.length) this.current = 0;
    const c = this.cards[this.current];
    this.container.innerHTML =
      '<div class="flashcard" id="fcard" onclick="this.classList.toggle(\'flipped\')">' +
        '<div class="flashcard-inner">' +
          '<div class="flashcard-front">' +
            '<div class="card-title">' + c.front + '</div>' +
            '<div class="card-hint">Tippen zum Aufdecken</div>' +
          '</div>' +
          '<div class="flashcard-back">' +
            '<div class="card-answer">' + c.back + '</div>' +
            (c.detail ? '<div class="card-detail">' + c.detail + '</div>' : '') +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="flashcard-controls">' +
        '<button class="btn btn-secondary btn-sm" id="fcPrev">&larr; Vorherige</button>' +
        '<span style="color:var(--text-muted);font-size:0.875rem;font-weight:600;">' + (this.current + 1) + ' / ' + this.cards.length + '</span>' +
        '<button class="btn btn-secondary btn-sm" id="fcNext">Nachtse &rarr;</button>' +
      '</div>';
    this.container.querySelector('#fcPrev').addEventListener('click', (e) => { e.stopPropagation(); this.current = (this.current - 1 + this.cards.length) % this.cards.length; this.showCard(); });
    this.container.querySelector('#fcNext').addEventListener('click', (e) => { e.stopPropagation(); this.current = (this.current + 1) % this.cards.length; this.showCard(); });
  }
}

/* ===== WORD SORTER ===== */
class WordSorter {
  constructor(containerId, words, categories, categoryName, section) {
    this.container = document.getElementById(containerId);
    this.words = words;
    this.categories = categories;
    this.categoryName = categoryName;
    this.section = section || 'satzanalyse';
    this.selectedWord = null;
    this.render();
  }

  render() {
    let html = '<div class="word-sorter">';
    html += '<div class="sorter-source" id="sorterSource">';
    this.words.forEach((w, i) => {
      html += '<span class="sorter-word" data-idx="' + i + '" data-word="' + w.word + '">' + w.word + '</span>';
    });
    html += '</div>';
    html += '<div class="sorter-columns">';
    this.categories.forEach(cat => {
      html += '<div class="sorter-column" data-cat="' + cat + '"><div class="sorter-column-header">' + cat + '</div></div>';
    });
    html += '</div>';
    html += '<div class="exercise-actions" style="margin-top:1.5rem;"><button class="btn btn-primary" id="checkSorter">Prufen</button></div>';
    html += '<div id="sorterFeedback" style="margin-top:1rem;"></div>';
    html += '</div>';
    this.container.innerHTML = html;

    this.container.querySelectorAll('.sorter-word').forEach(el => {
      el.addEventListener('click', () => this.selectWord(el));
    });
    this.container.querySelectorAll('.sorter-column').forEach(el => {
      el.addEventListener('click', () => this.placeWord(el));
    });
    this.container.querySelector('#checkSorter').addEventListener('click', () => this.check());
  }

  selectWord(el) {
    if (el.parentElement.classList.contains('sorter-column')) return;
    this.container.querySelectorAll('.sorter-word').forEach(w => w.classList.remove('selected'));
    el.classList.add('selected');
    this.selectedWord = el;
  }

  placeWord(colEl) {
    if (!this.selectedWord) return;
    colEl.appendChild(this.selectedWord);
    this.selectedWord.classList.remove('selected');
    this.selectedWord = null;
  }

  check() {
    let correct = 0;
    this.container.querySelectorAll('.sorter-column').forEach(col => {
      const cat = col.dataset.cat.toLowerCase();
      col.querySelectorAll('.sorter-word').forEach(wordEl => {
        const idx = parseInt(wordEl.dataset.idx);
        const expected = this.words[idx].type.toLowerCase();
        const isCorrect = cat === expected;
        wordEl.style.borderColor = isCorrect ? 'var(--success)' : 'var(--error)';
        wordEl.style.background = isCorrect ? 'var(--success-bg)' : 'var(--error-bg)';
        if (isCorrect) correct++;
      });
    });
    const total = this.words.length;
    const pct = Math.round((correct / total) * 100);
    const fb = this.container.querySelector('#sorterFeedback');
    fb.innerHTML = '<div class="callout callout-' + (pct >= 80 ? 'success' : 'warning') + '"><span class="callout-icon">' + (pct >= 80 ? '&#9989;' : '&#9888;&#65039;') + '</span><div class="callout-content"><p><strong>' + correct + '/' + total + ' richtig</strong> (' + pct + '%)</p></div></div>';
    APP.addProgress(this.categoryName, this.section, pct >= 80);
  }
}

/* ===== SENTENCE ANALYSIS TOOL ===== */
class SatzanalyseTool {
  constructor(containerId, sentence, analysis) {
    this.container = document.getElementById(containerId);
    this.sentence = sentence;
    this.analysis = analysis; // { word: { type, case, genus, num, function } }
    this.render();
  }

  render() {
    const words = this.sentence.split(/(\s+)/);
    let html = '<div class="satzbau">';
    words.forEach(w => {
      if (w.trim() === '') { html += w; return; }
      const info = this.analysis[w.toLowerCase().replace(/[.,;:!?]$/, '')];
      if (info) {
        html += '<span class="satzbau-word">' + w + '<span class="satzbau-tooltip">' + info + '</span></span>';
      } else {
        html += w;
      }
    });
    html += '</div>';
    this.container.innerHTML = html;
  }
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  APP.init();
});
