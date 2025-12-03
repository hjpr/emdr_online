# beforeigohome.com

## A free, online, self-administered trauma management app for nurses.

### Concept

Following a code, patient death, assault, or other distressing event, a nurse would visit this page to engage in a quick and easy session guiding them through putting the stress in a "box", and following a calm dot back and forth across a screen similar to how EMDR functions. The session will break to a crisis management mode if distress is too high.

## Dev notes:

- This is a streamlined, logic-driven layout designed specifically for a React Single Page Application (SPA).

- To achieve the "decompression" feel, the developer should use a library like Framer Motion to handle AnimatePresence. This allows Checkpoint A to dissolve or slide away softly while Checkpoint B enters, avoiding any jarring page reloads.

- To preserve privacy, entries should not be remembered aside from variables that assist in page transitions and app logic.

### Global App State (React Context)

- sudsScore (Integer: 0-10)

- currentStage (String: 'triage', 'grounding', 'session', 'closing')

- currentCheckpoint (Integer: Index of the current view)
  
  

### Stage 1: Triage

Goal: Immediate assessment to determine safety and readiness.

#### Checkpoint 1: The Pulse Check

**UI Elements:**

- Text: "Rate your current distress level."

- Component: A minimal, horizontal slider or a circular dial (0 = Calm, 10 = Maximum Distress).

- Dynamic Text: As the slider moves, the label changes (e.g., "Manageable", "Distressed", "Overwhelmed").

- Button: "Continue" (Fade in only after the slider is touched).

- Logic Gate: If Score ≥ 7: Transition to SOS Grounding. If Score < 7: Transition to Checkpoint 2 (The Container).

#### Checkpoint 1.5: SOS Grounding (Conditional Branch)

Triggered only if distress is high.

**UI Elements:**

- Animation: A "Breathing Sphere" expanding (4s), holding (4s), and contracting (4s).

- Text Guide: "Inhale... Hold... Exhale..."

- Timer: Runs for 3 cycles (approx 45 seconds).

**Action:**

- After the timer ends, a button appears: "I feel steady enough to proceed."

- Transition: Soft fade into Checkpoint 2 (The Container).



### Stage 2: The Session

Goal: Containment, Resourcing, and Regulation (EMDR Phase 2).

#### Checkpoint 2: The Container

**UI Elements:**

- Visual: An open box, chest, or vault in the center of the screen.

- Text: "Visualize the event or image bothering you. Put it inside the container for now."

- Feedback: The lid snaps shut with a solid, reassuring sound (a heavy click). A padlock icon appears.

- Transition: Once locked, the container shrinks and fades away, transitioning to the next screen.

**Action:**

- User must perform a specific gesture (Long Press) to "Close" the lid. A circular "loading" indicator appears around the container similar that completes the circle as the user holds on the container

#### Checkpoint 3: The Safe Place

**UI Elements:**

- Text: "Bring to mind a place where you feel calm and safe."

- Input (Optional): A text field asking "What is this place?" (e.g., 'The Ocean').

- Visual: A soft, glowing icon representing the mind's eye.

**Action:**

- Button: "I'm there" or "Ready."

- Transition: The background color of the app subtly shifts to the user's preferred calming color (e.g., from dark grey to deep sage or ocean blue) to signal entry into the regulation phase.

#### Checkpoint 4: Decompression (Bilateral Stimulation)

**UI Elements:**

- The Ball: A soft circle moving smoothly from the left edge to the right edge of the screen.

- Speed: Slow and rhythmic (approx 1 pass every 3 seconds). Note: Fast movement is for processing trauma; Slow movement is for soothing.

- Text overlay (fades out after 5s): "Follow the ball with your eyes. Tap your feet left and right if you can. Just breathe."

- Timer: Runs for 60 seconds.

- Haptics softly vibrates the screen when the ball hits the left and right side of the screen.

- Transition: Auto-transition to Closing after the timer completes.



### Stage 3: Closing

Goal: Re-entry to the shift or home life.

#### Checkpoint 5: The Anchor

**UI Elements:**

- Background: Static, calm color.

- Content: A single, centered affirmation that fades in slowly.

- Content Library: "I did my best today," "I am safe now," "That moment is over."
  Interaction:

- A "Hold to Absorb" button. The user presses and holds for 3 seconds; a ring fills up around their finger.

- Transition: When the ring is full, the screen clears to the final checkpoint.

#### Checkpoint 6: Resources (The Exit)

**UI Elements:**
A clean, list-style dashboard.

- Button A: "Repeat Decompression" (Loops back to Checkpoint 4).

- Button B: "Peer Support / Crisis Line" (Clickable phone links).

- Button C: "End Session" (Resets the app to the start screen).

**Technical Note for the Agent (Developer)**

- Transitions: Use Framer Motion with AnimatePresence.

- Exit Animation: opacity: 0, x: -50 (Slide left out).

- Entry Animation: opacity: 0, x: 50 (Slide in from right).

This creates a feeling of forward momentum through the stages.

- Haptics: Use the Navigator.vibrate() API for the Decompression stage.

- Dark Mode: The app should default to dark mode (dark greys/blacks) to avoid blinding a nurse in a dim room/break area.