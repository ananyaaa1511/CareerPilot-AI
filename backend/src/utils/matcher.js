// Curated, ATS-relevant terms. Ordinary prose is intentionally not treated as a requirement.
const SKILLS = [
  ["Python", ["python"]], ["Java", ["java"]], ["JavaScript", ["javascript"]], ["TypeScript", ["typescript"]], ["C", ["c"]], ["C++", ["c++", "cpp"]], ["C#", ["c#", "c sharp"]],
  ["HTML", ["html"]], ["CSS", ["css"]], ["React", ["react", "react.js", "reactjs"]], ["Angular", ["angular"]], ["Vue.js", ["vue", "vue.js", "vuejs"]], ["Node.js", ["node", "node.js", "nodejs"]], ["Express", ["express", "express.js", "expressjs"]], ["Django", ["django"]], ["Flask", ["flask"]], ["Spring Boot", ["spring boot"]], ["REST APIs", ["rest api", "rest apis", "restful api", "restful apis"]], ["GraphQL", ["graphql"]],
  ["MongoDB", ["mongodb", "mongo db"]], ["MySQL", ["mysql"]], ["PostgreSQL", ["postgresql", "postgres"]], ["SQL", ["sql"]], ["Redis", ["redis"]], ["Git", ["git"]], ["Docker", ["docker"]], ["Kubernetes", ["kubernetes", "k8s"]], ["AWS", ["aws", "amazon web services"]], ["Azure", ["azure", "microsoft azure"]], ["Google Cloud", ["google cloud", "gcp"]], ["Linux", ["linux"]], ["CI/CD", ["ci cd", "continuous integration", "continuous deployment"]],
  ["Machine Learning", ["machine learning", "ml"]], ["Data Analysis", ["data analysis", "data analytics"]], ["Power BI", ["power bi"]], ["Tableau", ["tableau"]],
  ["CAD", ["cad", "computer aided design"]], ["SolidWorks", ["solidworks", "solid works"]], ["Fusion 360", ["fusion 360"]], ["AutoCAD", ["autocad", "auto cad"]], ["CAM", ["cam", "computer aided manufacturing"]], ["3D Printing", ["3d printing", "3 d printing", "additive manufacturing"]], ["MATLAB", ["matlab"]], ["PLC", ["plc", "programmable logic controller"]],
  ["Testing", ["testing", "unit testing", "integration testing"]], ["Agile", ["agile", "scrum"]], ["Problem Solving", ["problem solving", "problem-solving"]],
];

function normalizeText(text = "") {
  return ` ${String(text).toLowerCase().normalize("NFKD").replace(/[–—_\\/]/g, " ").replace(/-/g, " ").replace(/[^a-z0-9+#. ]/g, " ").replace(/\s+/g, " ").trim()} `;
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function phrasePattern(aliases) {
  const choices = aliases.map(normalizeText).map((alias) => escapeRegex(alias.trim())).sort((a, b) => b.length - a.length).join("|");
  return new RegExp(`(^|[^a-z0-9])(?:${choices})(?=$|[^a-z0-9])`, "gi");
}

function countSkill(text, aliases) {
  return [...normalizeText(text).matchAll(phrasePattern(aliases))].length;
}

function hasSkill(text, aliases) {
  return countSkill(text, aliases) > 0;
}

function weightForSkill(jobText, aliases) {
  const mentions = countSkill(jobText, aliases);
  const escapedAliases = aliases.map((alias) => escapeRegex(normalizeText(alias).trim())).join("|");
  const emphasized = new RegExp(`\\b(?:required|must have|mandatory|essential|strong|expert|proficient|preferred)\\b[^.]{0,80}(?:${escapedAliases})`, "i").test(normalizeText(jobText));
  return 1 + Math.min(Math.max(mentions - 1, 0), 2) + (emphasized ? 1 : 0);
}

export function extractKeywords(text = "") {
  return SKILLS.filter(([, aliases]) => hasSkill(text, aliases)).map(([label]) => label);
}

export function calculateMatch(resumeText = "", jobDescription = "") {
  const requirements = SKILLS.filter(([, aliases]) => hasSkill(jobDescription, aliases)).map(([label, aliases]) => ({ label, aliases, weight: weightForSkill(jobDescription, aliases) }));
  const matched = requirements.filter(({ aliases }) => hasSkill(resumeText, aliases));
  const missing = requirements.filter(({ aliases }) => !hasSkill(resumeText, aliases));
  const totalWeight = requirements.reduce((total, requirement) => total + requirement.weight, 0);
  const matchedWeight = matched.reduce((total, requirement) => total + requirement.weight, 0);

  return {
    score: totalWeight ? Math.round((matchedWeight / totalWeight) * 100) : 0,
    matchedKeywords: matched.map(({ label }) => label).slice(0, 30),
    missingKeywords: missing.map(({ label }) => label).slice(0, 25),
  };
}
