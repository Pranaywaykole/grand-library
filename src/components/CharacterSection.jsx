// const characters = [
//   {
//     id: 1,
//     name: "The Scholar",
//     emoji: "🧙",
//     desc: "Loves classics and philosophy. Always found in the Grand Hall.",
//     count: 245,
//     status: "online",
//     cardClass: "scholar-card",

//     effects: (
//       <>
//         <div className="green-flash" />
//         <div className="trail trail1" />
//         <div className="trail trail2" />
//         <div className="trail trail3" />
//         <div className="magic-bolt" />
//       </>
//     ),
//   },

//   {
//     id: 2,
//     name: "The Detective",
//     emoji: "🕵️",
//     desc: "Mystery lover. Usually spotted in the coffee shop with a notebook.",
//     count: 189,
//     status: "online",
//     cardClass: "detective-card",

//     effects: (
//       <>
//         <div className="muzzle" />
//         <div className="smoke" />
//         <div className="bullet" />
//       </>
//     ),
//   },

//   {
//     id: 3,
//     name: "The Wanderer",
//     emoji: "🧝",
//     desc: "Reads everything. No fixed spot — roams all rooms freely.",
//     count: 312,
//     status: "offline",
//     cardClass: "wanderer-card",

//     effects: (
//       <>
//         <div className="page page1" />
//         <div className="page page2" />
//         <div className="page page3" />

//         <div className="step step1" />
//         <div className="step step2" />
//         <div className="step step3" />
//         <div className="step step4" />
//         <div className="step step5" />
//       </>
//     ),
//   },
// ];

// function CharacterSection({ chosenCharacter, onCharacterSelect }) {
//   return (
//     <section className="character-section" id="characters">
//       <h2>Create Your Character</h2>

//       <p className="section-subtitle">
//         Choose who you are before you enter the library
//       </p>

//       <div className="character-preview-container">

//         {characters.map((char) => (

//           <div
//             key={char.id}
//             className={`character-card ${char.cardClass} ${
//               chosenCharacter?.name === char.name
//                 ? "selected-character"
//                 : ""
//             }`}
//             onClick={() =>
//               onCharacterSelect({
//                 name: char.name,
//                 emoji: char.emoji,
//               })
//             }
//           >

//             {/* Animation effect elements */}
//             {char.effects}

//             <div className={`character-status ${char.status}`} />

//             <div className="character-avatar">
//               {char.emoji}
//             </div>

//             <h3>{char.name}</h3>

//             <p>{char.desc}</p>

//             <span className="character-tag">
//               {char.count} readers chose this
//             </span>

//           </div>
//         ))}

//       </div>
//     </section>
//   );
// }

// export default CharacterSection;

function CharacterSection({ chosenCharacter, onCharacterSelect }) {
  const characters = [
    {
      id: 1,
      name: "The Scholar",
      emoji: "🧙",
      desc: "Loves classics and philosophy. Always found in the Grand Hall.",
      count: 245,
      status: "online",
      cardClass: "scholar-card",
      effects: (
        <>
          <div className="magic-circle"></div>
          <div className="sparkle">✦</div>
          <div className="moon-symbol">☾</div>
        </>
      ),
    },
    {
      id: 2,
      name: "The Detective",
      emoji: "🕵️",
      desc: "Mystery lover. Usually spotted in the coffee shop with a notebook.",
      count: 189,
      status: "online",
      cardClass: "detective-card",

      effects: (
        <>
          <div className="flashlight-beam"></div>{" "}
          <div className="fingerprint"></div> <div className="scan-line"></div>{" "}
          <div className="evidence-line line1"></div>{" "}
          <div className="evidence-line line2"></div>{" "}
          <div className="clue-paper paper1"></div>{" "}
          <div className="clue-paper paper2"></div>{" "}
          <div className="smoke smoke1"></div>{" "}
          <div className="smoke smoke2"></div>
        </>
      ),
    },
    {
      id: 3,
      name: "The Wanderer",
      emoji: "🧝",
      desc: "Reads everything. No fixed spot — roams all rooms freely.",
      count: 312,
      status: "offline",
      cardClass: "wanderer-card",

      effects: (
        <>
          <div className="wander-particle particle-1"></div>
          <div className="wander-particle particle-2"></div>
          <div className="wander-particle particle-3"></div>
          <div className="ambient-glow wanderer-glow" />
          <div className="leaf leaf1">🍃</div>
          <div className="leaf leaf2">🍂</div>
          <div className="leaf leaf3">🍃</div>
          <div className="firefly f1"></div>
          <div className="firefly f2"></div>
          <div className="firefly f3"></div>
          <div className="floating-page page1"></div>
          <div className="floating-page page2"></div>
        </>
      ),
    },
  ];

  return (
    <section className="character-section" id="characters">
      <h2>Create Your Character</h2>

      <p className="section-subtitle">
        Choose who you are before you enter the library
      </p>

      <div className="character-preview-container">
        {characters.map((char) => (
          <div
            key={char.id}
            className={`character-card ${char.cardClass} ${
              chosenCharacter?.name === char.name ? "selected-character" : ""
            }`}
            onClick={() =>
              onCharacterSelect({
                name: char.name,
                emoji: char.emoji,
              })
            }
          >
            {/* status */}
            <div className={`character-status ${char.status}`} />

            {/* visual zone */}
            <div className="character-visual">
              <div className="avatar-anchor">
                <div className="character-effects">{char.effects}</div>

                <div className="character-avatar">{char.emoji}</div>
              </div>
            </div>

            {/* content */}
            <div className="character-content">
              <h3>{char.name}</h3>

              <p>{char.desc}</p>
            </div>

            {/* footer */}
            <span className="character-tag">
              {char.count} readers chose this
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CharacterSection;
