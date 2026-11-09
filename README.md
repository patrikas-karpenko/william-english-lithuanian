# William – anglų kalbos mokytojas (English File Beginner)

Katinas William moko anglų kalbos lietuvius mokinius. Pamokos eina pagal *English File Beginner*
(4-asis leidimas): 30 pamokų, ~800 žodžių su tarimu ir vertimu į lietuvių kalbą, gramatika paaiškinta
lietuviškai. Visi paaiškinimai ir taisymai – lietuviškai, praktika – angliškai. Pamokos pabaigoje –
5 klausimų testas; už 5/5 William apsiverčia ore.

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
- `course/english-file-beginner.json` – kursas. Bet kuris tokio paties formato failas `course/` aplanke tampa kursu.

Žodžiai *beer*, *wine*, *pub* ir *kiss* praleisti, nes kursas skirtas mokyklai.
Niekada nekelk vadovėlių PDF ar `.env` failo su raktu į GitHub.
