# Anti-Gravity Handoff — TTA Designs Digital Showroom

**Date:** 2026-08-25  
**Active Project:** TTA Designs Speculative Prototype (`tta-digital-showroom-prototype`)  
**Parent Role:** Studio Director / Design Director Lead  

---

## 🚨 IMMEDIATE INSTRUCTION FOR THE NEXT AGENT

When the user begins the new chat session:
1. **Acknowledge and Read State:** Confirm you have read this memory handoff.
2. **Expect Incoming Codex Feedback:** The user is copying and pasting the latest creative direction audit and prompt directly from **Codex**.
3. **Do NOT Jump Ahead or Prematurely Mutate:** Wait for the user's input/paste. Listen to Codex's exact critique and instructions (whether it is refining a specific hero territory, selecting a direction, or implementing an isolated WebGL/Canvas refraction shader slice).
4. **Maintain Strict Workspace Discipline:** Work only within the authorized mutation ceilings and follow the evidence-first design approach.

---

## 📌 PROJECT REPOSITORIES & WORKSPACE SYNC

Both project workspaces are fully mirrored and synchronized:
* **Workspace 1:** `c:\Users\Oviks\Documents\NIAJA WEB 1\`
* **Workspace 2:** `C:\Users\Oviks\Documents\WEB 1 Codex\`

All context files, briefs, memory logs, and studies reside in `.agents/` in both locations:
- `.agents/contexts/` (`creative-brief.md`, `evidence-dossier.md`, `hero-exploration-context.md`)
- `.agents/briefs/` (`phase-1a-constructed-axis-refinement.md`)
- `.agents/delegations/` (`tta-logo-motion-delegation.md`, `tta-hero-concept-studies-delegation.md`)
- `.agents/assets/selected-visuals/` (12 authentic TTA video and high-res photo assets)
- `.agents/assets/logo-approved-candidates/` (`tta-wordmark-black-transparent-provisional.png`, `tta-wordmark-white-on-black-provisional.png`)
- `.agents/studies/` (All Phase 1 and Phase 2 prototypes)

---

## 🏗️ CURRENT ACTIVE STATE & DELIVERABLES

### 1. Logo Motion Exploration (Phase 1 & 1A)
* **Selected Winner:** **Concept A ("The Constructed Axis")**
* **Refined Prototype:** `C:\Users\Oviks\Documents\WEB 1 Codex\.agents\studies\logo-motion\A-constructed-axis-refined\`
  * *Audit URL:* `http://localhost:8080/logo-motion/A-constructed-axis-refined/index.html`
  * *Pacing:* `4.50s` total (0.30s stillness $\to$ 0.75s axis datum $\to$ 0.75s D ownership $\to$ 1.10s unified DESIGNS & TTA arrival $\to$ 1.30s still hold).
  * *Key Law:* The vertical hairline inside `D` is the architectural centerline of the studio.

### 2. Hero Concept Studies (Phase 2 — Under Codex Audit)
Three independent risk studies created from the settled wordmark:

| Study | Directory & URL | Technical Approach | Visual Thesis |
| :--- | :--- | :--- | :--- |
| **Study A: The Line Becomes Light** | `studies/hero-concepts/A-line-becomes-light/` | DOM / SVG clip-path mask | The vertical axis inside `D` shifts into 3D perspective and becomes a 2800K integrated ceiling lighting seam that reveals the finished room. |
| **Study B: The Room in Three Truths** | `studies/hero-concepts/B-room-in-three-truths/` | Native CSS 3D perspective planes | Uses authentic portrait media as 3 depth planes (Z=0 Atmosphere, Z=-80px Human intimacy, Z=-160px Process craft). |
| **Study C: The Anamorphic Interior** | `studies/hero-concepts/C-anamorphic-interior/` | Hardware-accelerated CSS 3D planes | Deconstructed spatial depth planes converge through optical perspective registration into one calm, complete room. |
| **Comparison Suite** | `studies/hero-concepts/comparison/` | Side-by-side review | Synchronized replay, full-screen links, resting frames, and telemetry. |

### 3. Canvas UI / WebGL Status
* Per the strict brief approval rules, no third-party npm packages or external WebGL libraries were imported without explicit approval.
* If Codex or the user authorizes an isolated WebGL/Canvas shader experiment (e.g. optical refraction distortion along the vertical seam), build it as a contained, zero-dependency slice.

---

## 🛠️ LOCAL PREVIEW SERVER

To run or restart the preview server:
```powershell
python -m http.server 8080 --directory "C:\Users\Oviks\Documents\WEB 1 Codex\.agents\studies"
```
* **Hero Comparison:** `http://localhost:8080/hero-concepts/comparison/index.html`
* **Logo Comparison:** `http://localhost:8080/logo-motion/comparison/index.html`
