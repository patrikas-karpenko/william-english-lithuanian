// chat.js – what happens in the browser

const chat = document.getElementById("chat");
const form = document.getElementById("form");
const input = document.getElementById("input");
const cat = document.getElementById("cat");
const bubble = document.getElementById("bubble");
const button = form.querySelector("button");
const courseSelect = document.getElementById("course");
const lessonSelect = document.getElementById("lesson");
const scoreBox = document.getElementById("score");

let ui = {};   // the words on the page (buttons, headings) in the course's language

// Has this browser met William before? Open the page with ?new to make him introduce himself again.
if (location.search.includes("new")) localStorage.removeItem("met-william");
let firstTime = !localStorage.getItem("met-william");

// 1. Draw William
const EYES = { normal: "o   o", happy: "^   ^", think: "-   o", wink: "^   -" };

function drawCat(mood) {
  cat.textContent = [
    "    /\\_____/\\",
    `   /  ${EYES[mood]}  \\`,
    "  ( ==  ^  == )",
    "   )         (     (",
    "  (           )     )",
    " ( (  )   (  ) )   /",
    "(__(__)___(__)__)_/",
  ].join("\n");
}

drawCat("normal");

// 2. William's tricks: a speech bubble and a flip
function say(text, ms = 3000) {
  bubble.textContent = text;
  bubble.classList.add("show");
  setTimeout(() => bubble.classList.remove("show"), ms);
}

function flip() {
  cat.classList.remove("flip");
  void cat.offsetWidth;            // restart the animation if it is already running
  cat.classList.add("flip");
  drawCat("happy");
  setTimeout(() => { cat.classList.remove("flip"); drawCat("wink"); }, 1100);
  setTimeout(() => drawCat("normal"), 2000);
}

cat.addEventListener("click", flip);   // click William and he flips

// The score next to William: every right answer adds 1. At 5/5 he flips and it starts again at 0/5.
const GOAL = 5;
let points = 0;

function showScore() {
  scoreBox.textContent = `${points}/${GOAL}`;
  scoreBox.classList.remove("bump");
  void scoreBox.offsetWidth;       // restart the little "bump" animation
  scoreBox.classList.add("bump");
}

function addPoint() {
  points += 1;
  showScore();
  if (points === GOAL) {
    flip();
    say(ui.perfect, 3000);
    setTimeout(() => { points = 0; showScore(); }, 2500);
  }
}

// 3. Put a message on the screen
function addMessage(who, text) {
  const div = document.createElement("div");
  div.className = "msg " + who;   // "msg me" or "msg william"
  div.textContent = text;         // textContent, never innerHTML: typed text can't break the page
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

// 4. The conversation so far. The model remembers nothing, so we send all of it every time.
const history = [];

// 5. Ask William: send the course, the lesson and the conversation, show his answer
async function askWilliam() {
  drawCat("think");
  button.disabled = true;

  let data;
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        course: courseSelect.value,
        lesson: Number(lessonSelect.value),
        messages: history,
        first_time: firstTime,
      }),
    });
    data = await response.json();
    if (firstTime && response.ok) {        // William has introduced himself: never again
      firstTime = false;
      localStorage.setItem("met-william", "yes");
    }
  } catch (error) {
    data = { reply: ui.no_server || "Miau… the server isn't answering.", mark: null };
  }

  history.push({ role: "assistant", content: data.reply });
  addMessage("william", data.reply);

  drawCat("happy");
  setTimeout(() => drawCat("normal"), 1500);
  if (data.mark === "right") addPoint();   // William said the answer was right
  button.disabled = false;
  input.focus();
}

// 6. When you press Send
form.addEventListener("submit", async (event) => {
  event.preventDefault();          // stop the browser from reloading the page
  const text = input.value.trim();
  if (!text || button.disabled) return;

  input.value = "";
  addMessage("me", text);
  history.push({ role: "user", content: text });
  await askWilliam();
});

// 7. The lesson card: everything new in this lesson, built from the course file
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function showCard(lesson) {
  const card = el("section", "card");
  card.appendChild(el("h2", "", lesson.title));
  card.appendChild(el("p", "subtitle", lesson.title_learner));

  if (lesson.grammar.length) {
    const goals = lesson.grammar.map((g) => g.name).join(" · ");
    card.appendChild(el("p", "goals", `${ui.you_will_learn} ${goals}`));
  }

  if (lesson.words.length) {
    card.appendChild(el("h3", "", ui.new_words));
    const table = el("table", "words");
    for (const w of lesson.words) {
      const row = el("tr");
      row.appendChild(el("td", "text", w.text));
      if (w.pron) row.appendChild(el("td", "pron", w.pron));   // only if the course has pronunciation
      row.appendChild(el("td", "meaning", w.meaning));
      table.appendChild(row);
    }
    card.appendChild(table);
  }

  if (lesson.grammar.length) {
    card.appendChild(el("h3", "", ui.grammar));
    for (const g of lesson.grammar) {
      const box = el("div", "grammar");
      box.appendChild(el("p", "g-name", g.name));
      box.appendChild(el("p", "g-explain", g.explain));
      box.appendChild(el("p", "g-pattern", g.pattern));
      for (const ex of g.examples.slice(0, 2)) {
        const parts = [ex.text, ex.pron, ex.meaning].filter(Boolean);
        box.appendChild(el("p", "g-example", parts.join("  –  ")));
      }
      card.appendChild(box);
    }
  }

  chat.appendChild(card);
}

// 8. Start a lesson: card first, then William opens it
async function startLesson() {
  chat.innerHTML = "";             // clear the screen
  history.length = 0;              // forget the old conversation
  points = 0;                      // new lesson, new score
  scoreBox.textContent = `0/${GOAL}`;
  localStorage.setItem("course", courseSelect.value);
  localStorage.setItem("lesson-" + courseSelect.value, lessonSelect.value);

  const response = await fetch(`/api/courses/${courseSelect.value}/lessons/${lessonSelect.value}`);
  const data = await response.json();
  ui = data.ui;
  input.placeholder = ui.placeholder;
  button.textContent = ui.send;

  showCard(data.lesson);           // the handout first...
  await askWilliam();              // ...then William opens the lesson
  chat.scrollTop = 0;              // start reading at the top of the card
}

// 9. Fill the lesson menu for the chosen course
async function loadLessons() {
  const response = await fetch(`/api/courses/${courseSelect.value}/lessons`);
  const lessons = await response.json();
  lessonSelect.innerHTML = "";
  for (const lesson of lessons) {
    const option = document.createElement("option");
    option.value = lesson.id;
    option.textContent = `${lesson.title} · ${lesson.title_learner}`;
    lessonSelect.appendChild(option);
  }
  lessonSelect.value = localStorage.getItem("lesson-" + courseSelect.value) || lessons[0].id;
  await startLesson();
}

// 10. Fill the course menu (hidden when there is only one course)
async function loadCourses() {
  const response = await fetch("/api/courses");
  const courses = await response.json();
  for (const course of courses) {
    const option = document.createElement("option");
    option.value = course.id;
    option.textContent = course.name;
    courseSelect.appendChild(option);
  }
  courseSelect.hidden = courses.length < 2;
  const saved = localStorage.getItem("course");
  if (courses.some((c) => c.id === saved)) courseSelect.value = saved;
  await loadLessons();
}

courseSelect.addEventListener("change", loadLessons);
lessonSelect.addEventListener("change", startLesson);
loadCourses();
