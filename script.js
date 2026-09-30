/* =============================================
   Milan Yadav — Portfolio JavaScript
   script.js
   ============================================= */

// ── Custom Cursor ──────────────────────────────
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx - 6 + 'px';
  cursor.style.top  = my - 6 + 'px';
});

function animateRing() {
  rx += (mx - rx - 18) * 0.12;
  ry += (my - ry - 18) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

document.addEventListener('mousedown', () => cursor.classList.add('clicked'));
document.addEventListener('mouseup',   () => cursor.classList.remove('clicked'));

document.querySelectorAll('a, button, .filter-btn, .tech-pill, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

// ── Scroll Reveal ──────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Skill Bar Animation ────────────────────────
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-fill').forEach(fill => {
        fill.style.width = fill.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));

// ── Project Filter ─────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ── Active Nav Link on Scroll ──────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--accent)'
      : '';
  });
});

// ── Typewriter for Hero Tag ────────────────────
const tagEl  = document.querySelector('.hero-tag');
const phrases = ['Available for opportunities', 'Open to freelance', 'Open to internships'];
let pIdx = 0, cIdx = 0, deleting = false;

function typeLoop() {
  const phrase   = phrases[pIdx];
  const textNode = tagEl.childNodes[tagEl.childNodes.length - 1];

  if (!deleting) {
    textNode.textContent = ' ' + phrase.slice(0, ++cIdx);
    if (cIdx === phrase.length) {
      deleting = true;
      setTimeout(typeLoop, 2000);
      return;
    }
  } else {
    textNode.textContent = ' ' + phrase.slice(0, --cIdx);
    if (cIdx === 0) {
      deleting = false;
      pIdx = (pIdx + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, deleting ? 40 : 80);
}
setTimeout(typeLoop, 1200);

// ── Contact Form (Backend-Ready) ───────────────
async function handleSubmit(e) {
  e.preventDefault();

  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const message = document.getElementById('fmessage').value.trim();
  const status  = document.getElementById('formStatus');
  const btn     = document.getElementById('submitBtn');

  // Client-side validation
  if (!name || !email || !message) {
    status.className = 'form-status error';
    status.textContent = '⚠ Please fill in all required fields.';
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    status.className = 'form-status error';
    status.textContent = '⚠ Please enter a valid email address.';
    return;
  }

  // Loading state
  btn.classList.add('loading');
  btn.textContent = 'Sending...';
  status.className = 'form-status';
  status.textContent = '';

  try {
    await sendContactForm({ name, email, message });

    status.className = 'form-status success';
    status.textContent = "✓ Message sent! I'll get back to you within 24 hours.";
    btn.textContent = 'Sent ✓';

    // Clear form
    document.getElementById('fname').value    = '';
    document.getElementById('femail').value   = '';
    document.getElementById('fmessage').value = '';
    document.getElementById('fsubject').value = '';

  } catch (err) {
    status.className = 'form-status error';
    status.textContent = '✕ Something went wrong. Please try emailing directly.';
    btn.textContent = 'Send Message →';
  } finally {
    btn.classList.remove('loading');
  }
}

/**
 * sendContactForm()
 * -----------------
 * Replace the body of this function with a real fetch() call to your backend.
 *
 * Example with a Node/Express backend:
 *   return fetch('/api/contact', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(data)
 *   }).then(res => { if (!res.ok) throw new Error('Server error'); });
 *
 * Example with Formspree (no backend needed):
 *   return fetch('https://formspree.io/f/YOUR_FORM_ID', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(data)
 *   }).then(res => { if (!res.ok) throw new Error('Formspree error'); });
 */
function sendContactForm(data) {
  return new Promise((resolve) => {
    // ← REPLACE THIS with your real fetch() call above
    console.log('Form data to send:', data);
    setTimeout(() => resolve({ success: true }), 1600);
  });
}

// ── Academic Record ────────────────────────────
// Edit this object with your real results. To add a semester, copy one block.
// `pdf` is optional: leave it '' to hide the link, or point to a file,
// e.g. 'assets/gradesheets/sem1.pdf' (remove ID/DOB details first).
const academicRecord = {
  cgpa: '3.33',
  semesters: [
    {
      name: 'Semester 1', sgpa: '3.18', pdf: '',
      subjects: [
        { name: 'English Grammar and Composition',       credits: 3, grade: 'B+' },
        { name: 'Calculus and Analytical Geometry',      credits: 3, grade: 'B'  },
        { name: 'Programming Fundamentals and C Programming', credits: 3, grade: 'B+' },
        { name: 'Information Technology Fundamentals',   credits: 3, grade: 'B+' },
        { name: 'Electronic Principles (TH)',            credits: 3, grade: 'B-' },
        { name: 'Electronic Principles (PR)',            credits: 1, grade: 'A+' },
      ]
    },
    {
      name: 'Semester 2', sgpa: '3.51', pdf: '',
      subjects: [
        { name: 'Digital Logic Design',                  credits: 3, grade: 'B'  },
        { name: 'Microprocessor System',                 credits: 3, grade: 'A'  },
        { name: 'Data Structure and Algorithms',         credits: 3, grade: 'A'  },
        { name: 'Linear Algebra',                        credits: 3, grade: 'A'  },
        { name: 'Mechanics and Electrodynamics (TH)',    credits: 3, grade: 'B+' },
        { name: 'Mechanics and Electrodynamics (PR)',    credits: 1, grade: 'A+' },
      ]
    },
    {
      name: 'Semester 3', sgpa: '3.32', pdf: '',
      subjects: [
        { name: 'Computer Organization and Architecture', credits: 3, grade: 'B'  },
        { name: 'Introduction to Management',            credits: 3, grade: 'B+' },
        { name: 'Operating System',                      credits: 3, grade: 'A'  },
        { name: 'Discrete Structures',                   credits: 3, grade: 'B+' },
        { name: 'Object Oriented Programming with C++',  credits: 3, grade: 'B+' },
        { name: 'Statistics and Probability',            credits: 3, grade: 'B+' },
      ]
    },
  ]
};

(function renderAcademics() {
  const summary = document.getElementById('acadSummary');
  const list    = document.getElementById('semesterList');
  if (!summary || !list) return;

  const totalCredits = academicRecord.semesters
    .flatMap(s => s.subjects)
    .reduce((sum, x) => sum + x.credits, 0);

  summary.innerHTML = `
    <div class="acad-stat"><div class="acad-stat-num">${academicRecord.cgpa}</div><div class="acad-stat-label">CGPA</div></div>
    <div class="acad-stat"><div class="acad-stat-num">${academicRecord.semesters.length}</div><div class="acad-stat-label">Semesters</div></div>
    <div class="acad-stat"><div class="acad-stat-num">${totalCredits}</div><div class="acad-stat-label">Credit Hours</div></div>`;

  list.innerHTML = academicRecord.semesters.map((sem, i) => `
    <details class="semester"${i === 0 ? ' open' : ''}>
      <summary>${sem.name}<span class="semester-sgpa">SGPA ${sem.sgpa}</span></summary>
      <div class="semester-body">
        <table class="grade-table">
          <thead><tr><th>Subject</th><th>Credits</th><th>Grade</th></tr></thead>
          <tbody>
            ${sem.subjects.map(x => `<tr><td>${x.name}</td><td>${x.credits}</td><td class="grade">${x.grade}</td></tr>`).join('')}
          </tbody>
        </table>
        ${sem.pdf ? `<a class="gradesheet-link" href="${sem.pdf}" target="_blank" rel="noopener">View gradesheet (PDF) ↗</a>` : ''}
      </div>
    </details>`).join('');

  // custom cursor hover effect for the generated elements
  list.querySelectorAll('summary, a').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
})();
