// backend/utils/matcher.js

// Skills that CareerPilot knows how to detect
const SKILLS = [
  // Programming Languages
  "java",
  "c",
  "c++",
  "python",
  "javascript",
  "typescript",

  // Web
  "html",
  "css",
  "bootstrap",
  "react",
  "react.js",
  "node.js",
  "node",
  "express",
  "express.js",

  // Web concepts
  "frontend",
  "front end",
  "backend",
  "back end",
  "full stack",
  "full-stack",
  "responsive design",
  "api",
  "apis",
  "rest api",
  "rest apis",
  "restful api",

  // MERN / development concepts
  "mern",
  "mern stack",
  "web development",
  "web application",
  "web applications",

  // Database
  "mysql",
  "mongodb",
  "sql",
  "database",
  "databases",
  "mongoose",

  // Tools
  "git",
  "github",
  "postman",
  "power bi",

  // Development practices
  "debugging",
  "testing",
  "code review",
  "code reviews",
  "documentation"
];


// ---------------------------------------------------------
// Normalize different ways of writing the same skill
// ---------------------------------------------------------

function normalizeSkill(skill) {
  const aliases = {
    "react.js": "react",

    "node": "node.js",

    "express.js": "express",

    "front end": "frontend",

    "back end": "backend",

    "full-stack": "full stack",

    "apis": "api",

    "rest apis": "rest api",

    "restful api": "rest api",

    "databases": "database",

    "code reviews": "code review",

    "mern stack": "mern"
  };

  const normalized = skill
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

  return aliases[normalized] || normalized;
}


// ---------------------------------------------------------
// Convert text into a consistent searchable format
// ---------------------------------------------------------

function normalizeText(text = "") {
  return text
    .toLowerCase()
    .replace(/[-_/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}


// ---------------------------------------------------------
// Escape special regex characters
// ---------------------------------------------------------

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


// ---------------------------------------------------------
// Check whether an exact skill/concept exists in text
// ---------------------------------------------------------

function containsSkill(text = "", skill = "") {
  const normalizedText = normalizeText(text);
  const normalizedSkill = normalizeText(skill);

  const aliases = {
    react: [
      "react",
      "react.js"
    ],

    "node.js": [
      "node.js",
      "node"
    ],

    express: [
      "express",
      "express.js"
    ],

    frontend: [
      "frontend",
      "front end"
    ],

    backend: [
      "backend",
      "back end"
    ],

    "full stack": [
      "full stack",
      "full-stack"
    ],

    api: [
      "api",
      "apis"
    ],

    "rest api": [
      "rest api",
      "rest apis",
      "restful api"
    ],

    database: [
      "database",
      "databases"
    ],

    "code review": [
      "code review",
      "code reviews"
    ],

    mern: [
      "mern",
      "mern stack"
    ]
  };

  const variations =
    aliases[normalizedSkill] || [normalizedSkill];

  return variations.some((variation) => {
    const normalizedVariation = normalizeText(variation);
    const escaped = escapeRegex(normalizedVariation);

    const regex = new RegExp(
      `\\b${escaped}\\b`,
      "i"
    );

    return regex.test(normalizedText);
  });
}


// ---------------------------------------------------------
// Related skill evidence
//
// This allows CareerPilot to understand that some skills
// provide evidence for a broader requirement.
//
// Example:
// Job requires "backend"
// Resume contains "Node.js" + "Express"
// → backend requirement is considered supported.
// ---------------------------------------------------------

const RELATED_SKILLS = {
  backend: [
    "backend",
    "back end",
    "node.js",
    "node",
    "express",
    "express.js",
    "rest api",
    "rest apis",
    "restful api",
    "mern",
    "mern stack",
    "full stack",
    "full-stack"
  ],

  frontend: [
    "frontend",
    "front end",
    "react",
    "react.js",
    "html",
    "css",
    "javascript",
    "bootstrap",
    "responsive design",
    "full stack",
    "full-stack",
    "mern",
    "mern stack"
  ],

  "full stack": [
    "full stack",
    "full-stack",
    "mern",
    "mern stack",
    "frontend",
    "backend",
    "node.js",
    "express",
    "react",
    "mongodb",
    "rest api"
  ],

  mern: [
    "mern",
    "mern stack",
    "mongodb",
    "express",
    "react",
    "node.js"
  ],

  api: [
    "api",
    "apis",
    "rest api",
    "rest apis",
    "restful api"
  ],

  "rest api": [
    "rest api",
    "rest apis",
    "restful api",
    "api",
    "apis"
  ],

  database: [
    "database",
    "databases",
    "mongodb",
    "mysql",
    "sql",
    "mongoose"
  ],

  javascript: [
    "javascript",
    "react",
    "node.js",
    "express",
    "typescript"
  ]
};


// ---------------------------------------------------------
// Check whether the resume has evidence for a skill
// ---------------------------------------------------------

function hasSkillEvidence(text, skill) {
  // First: exact match
  if (containsSkill(text, skill)) {
    return true;
  }

  const normalizedSkill = normalizeSkill(skill);

  const relatedSkills =
    RELATED_SKILLS[normalizedSkill];

  // No related skills defined
  if (!relatedSkills) {
    return false;
  }

  // Check whether any related skill exists
  return relatedSkills.some((relatedSkill) =>
    containsSkill(text, relatedSkill)
  );
}


// ---------------------------------------------------------
// Extract individual keywords from text
// ---------------------------------------------------------

export function extractKeywords(text = "") {
  return [
    ...new Set(
      normalizeText(text)
        .replace(/[^a-z0-9+#.\- ]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length >= 3)
    )
  ];
}


// ---------------------------------------------------------
// Calculate resume ↔ job description match
// ---------------------------------------------------------

export function calculateMatch(
  resumeText = "",
  jobDescription = ""
) {
  // Find skills that actually appear in the job description
  const requiredSkills = [
    ...new Set(
      SKILLS
        .filter((skill) =>
          containsSkill(jobDescription, skill)
        )
        .map(normalizeSkill)
    )
  ];

  const matched = [];
  const missing = [];

  // Compare each required skill against resume
  for (const skill of requiredSkills) {
    if (hasSkillEvidence(resumeText, skill)) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  }

  // Calculate score
  const score = requiredSkills.length
    ? Math.round(
        (matched.length / requiredSkills.length) * 100
      )
    : 0;

  return {
    score: Math.min(score, 100),

    matchedKeywords: [
      ...new Set(matched)
    ].slice(0, 30),

    missingKeywords: [
      ...new Set(missing)
    ].slice(0, 25)
  };
}