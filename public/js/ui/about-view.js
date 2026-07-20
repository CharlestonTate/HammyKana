// About screen: credits and tagline.

const ABOUT_CREDITS = [
  { label: 'Lead Dev', value: 'Tate Singleton' },
  { label: 'Hamster', value: 'Cookie' },
  { label: 'Named By', value: 'Hannah Kas' },
  { label: 'SFX', value: 'Stardew Valley' },
  { label: 'Special Thanks', value: 'Grant, Braden, and Mom' }
];

function createAboutRow(credit) {
  const row = document.createElement('div');
  row.className = 'about-row';

  const label = document.createElement('span');
  label.className = 'about-row-label';
  label.textContent = credit.label;

  const value = document.createElement('span');
  value.className = 'about-row-value';
  value.textContent = credit.value;

  row.appendChild(label);
  row.appendChild(value);
  return row;
}

function renderAboutPage(state) {
  const aboutPage = document.createElement('section');
  aboutPage.className = 'about-page';

  const backButton = document.createElement('button');
  backButton.type = 'button';
  backButton.className = 'about-back-button';
  backButton.textContent = 'Back to lessons';
  backButton.addEventListener('click', () => {
    state.activeView = 'path';
    render(state);
  });
  aboutPage.appendChild(backButton);

  const card = document.createElement('div');
  card.className = 'about-card';

  const hero = document.createElement('div');
  hero.className = 'about-hero';

  const heroImage = document.createElement('img');
  heroImage.className = 'about-hero-image';
  heroImage.src = 'img/idle1.png';
  heroImage.alt = 'Hammy the hamster';
  hero.appendChild(heroImage);

  const heading = document.createElement('h1');
  heading.className = 'about-heading';
  heading.textContent = 'HammyKana';
  hero.appendChild(heading);

  const tagline = document.createElement('p');
  tagline.className = 'about-tagline';
  tagline.textContent = 'Learn hiragana and katakana, one lesson at a time.';
  hero.appendChild(tagline);

  card.appendChild(hero);

  const creditsSection = document.createElement('div');
  creditsSection.className = 'about-section';

  const creditsTitle = document.createElement('h2');
  creditsTitle.className = 'about-section-title';
  creditsTitle.textContent = 'Credits';
  creditsSection.appendChild(creditsTitle);

  ABOUT_CREDITS.forEach((credit) => {
    creditsSection.appendChild(createAboutRow(credit));
  });

  card.appendChild(creditsSection);

  const quote = document.createElement('blockquote');
  quote.className = 'about-quote';
  quote.textContent = 'Psalm 55';
  card.appendChild(quote);

  const closing = document.createElement('div');
  closing.className = 'about-closing';

  const thanksLine = document.createElement('p');
  thanksLine.className = 'about-thanks';
  thanksLine.textContent = 'Thank you for learning with HammyKana!';
  closing.appendChild(thanksLine);

  const freeLine = document.createElement('p');
  freeLine.className = 'about-thanks';
  freeLine.textContent = 'This project will always be free.';
  closing.appendChild(freeLine);

  card.appendChild(closing);
  aboutPage.appendChild(card);

  ui.app.appendChild(aboutPage);
}
