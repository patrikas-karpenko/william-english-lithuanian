# William – anglų kalbos mokytojas (Project Explore)

Katinas William moko anglų kalbos lietuvius mokinius. Du kursai pagal *Project Explore 1* ir *Project Explore 2*
(Oxford): 53 pamokos (Intro, 1A–6D), žodžiai ir frazės su vertimu į lietuvių kalbą, gramatika paaiškinta
lietuviškai. William kalba lietuviškai, praktika – angliškai.

Šalia Williamo yra taškų skaitiklis: už kiekvieną teisingą atsakymą +1. Pasiekus 5/5 William apsiverčia ore,
o skaitiklis vėl rodo 0/5. William prisistato tik pirmą kartą; norint, kad prisistatytų dar kartą,
atidaryk puslapį su `?new` adreso gale.

## Paleisti (GitHub Codespaces)
1. Pridėk modelio raktą kaip Codespaces paslaptį `LLM_API_KEY`
   (GitHub → Settings → Codespaces → Secrets) ir leisk šiam repozitorijui ją naudoti.
2. Codespace terminale:
   ```
   pip install -r requirements.txt
   uvicorn app:app --reload --port 8000
   ```
3. Atidaryk 8000 prievadą skiltyje **Ports**.

## Sandara
- `app.py` – serveris (tas pats variklis kaip kinų kalbos versijoje).
- `static/` – puslapis.
- `course/project-explore-1.json`, `course/project-explore-2.json` – kursai. Bet kuris tokio paties formato
  failas `course/` aplanke tampa kursu.

Niekada nekelk vadovėlių PDF ar `.env` failo su raktu į GitHub.
