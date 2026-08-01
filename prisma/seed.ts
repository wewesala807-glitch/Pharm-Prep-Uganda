import { PrismaClient, Difficulty } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SUBJECTS = [
  { name: "Pharmacology", color: "#1A56DB", icon: "💊" },
  { name: "Pharmaceutical Chemistry", color: "#7C3AED", icon: "🧪" },
  { name: "Pharmacognosy", color: "#16A34A", icon: "🌿" },
  { name: "Pharmacy Practice", color: "#F59E0B", icon: "🏥" },
  { name: "Pharmaceutics", color: "#EC4899", icon: "🧫" },
  { name: "Pharmaceutical Microbiology", color: "#DC2626", icon: "🦠" },
  { name: "Clinical Pharmacy", color: "#06B6D4", icon: "🩺" },
  { name: "Pharmacokinetics", color: "#F97316", icon: "📈" },
  { name: "Pharmaceutical Jurisprudence", color: "#6366F1", icon: "⚖️" },
  { name: "Biochemistry", color: "#14B8A6", icon: "🧬" },
  { name: "Anatomy and Physiology", color: "#EF4444", icon: "❤️" },
  { name: "NDA Regulations Uganda", color: "#16A34A", icon: "🇺🇬" },
];

const DIFFICULTIES: Difficulty[] = ["EASY", "MEDIUM", "HARD"];
const PLACEHOLDER_YOUTUBE_IDS = ["dQw4w9WgXcQ", "M7lc1UVf-VE", "9bZkp7q19f0"];

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("Seeding admin + sample students...");

  const adminPasswordHash = await bcrypt.hash("Admin@1234", 10);
  await prisma.user.upsert({
    where: { email: "admin@pharmaprep.ug" },
    update: {},
    create: {
      name: "PharmaPrep Admin",
      email: "admin@pharmaprep.ug",
      hashedPassword: adminPasswordHash,
      role: "ADMIN",
      plan: "PREMIUM",
    },
  });

  const studentPasswordHash = await bcrypt.hash("Student@1234", 10);
  const sampleStudents = [
    { name: "Namukasa Sarah", email: "sarah@example.ug" },
    { name: "Okello Brian", email: "brian@example.ug" },
    { name: "Nabirye Grace", email: "grace@example.ug" },
  ];
  for (const s of sampleStudents) {
    await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        name: s.name,
        email: s.email,
        hashedPassword: studentPasswordHash,
        role: "STUDENT",
        plan: "FREE",
      },
    });
  }

  console.log("Seeding subjects, topics, notes, videos, questions...");

  for (let sIndex = 0; sIndex < SUBJECTS.length; sIndex++) {
    const subjectData = SUBJECTS[sIndex];
    const subject = await prisma.subject.upsert({
      where: { slug: slugify(subjectData.name) },
      update: {},
      create: {
        name: subjectData.name,
        slug: slugify(subjectData.name),
        icon: subjectData.icon,
        color: subjectData.color,
        description: `Core concepts and past-exam-aligned practice for ${subjectData.name}, mapped to the Uganda pharmacy pre-licensure and post-internship syllabus.`,
        order: sIndex,
      },
    });

    for (let tIndex = 1; tIndex <= 3; tIndex++) {
      const topicTitle = `${subjectData.name} - Topic ${tIndex}`;
      const topicSlug = slugify(`topic-${tIndex}`);
      const isPremiumTopic = tIndex === 3; // last topic per subject gated

      const topic = await prisma.topic.upsert({
        where: { subjectId_slug: { subjectId: subject.id, slug: topicSlug } },
        update: {},
        create: {
          subjectId: subject.id,
          title: topicTitle,
          slug: topicSlug,
          description: `Placeholder overview for ${topicTitle}. Replace with real syllabus content in the admin note editor.`,
          isPremium: isPremiumTopic,
          order: tIndex,
        },
      });

      // 2 notes: 1 free, 1 premium
      for (let n = 0; n < 2; n++) {
        await prisma.note.create({
          data: {
            topicId: topic.id,
            title: `${topicTitle} - Study Note ${n + 1}`,
            content: `<h2>${topicTitle}</h2><p>This is placeholder note content for ${topicTitle}. Replace via the admin TipTap editor with real lecture notes, diagrams, and past-paper-aligned summaries.</p>`,
            isPremium: n === 1,
          },
        });
      }

      // 3 videos
      for (let v = 0; v < 3; v++) {
        await prisma.video.create({
          data: {
            topicId: topic.id,
            title: `${topicTitle} - Video Lesson ${v + 1}`,
            youtubeId: PLACEHOLDER_YOUTUBE_IDS[v % PLACEHOLDER_YOUTUBE_IDS.length],
            description: `Placeholder video walkthrough for ${topicTitle}.`,
            duration: 300 + v * 120,
            isPremium: false, // videos always free per spec
            order: v,
          },
        });
      }

      // 10 questions: 5 free, 5 premium
      for (let q = 0; q < 10; q++) {
        const correctIndex = q % 4;
        await prisma.question.create({
          data: {
            topicId: topic.id,
            text: `Sample question ${q + 1} for ${topicTitle}. Which of the following is correct?`,
            explanation: `Explanation placeholder for question ${q + 1} of ${topicTitle}. Replace with detailed rationale in the admin question editor.`,
            isPremium: q >= 5,
            difficulty: DIFFICULTIES[q % 3],
            type: "MCQ",
            examYear: 2018 + (q % 6),
            options: {
              create: Array.from({ length: 4 }).map((_, optIdx) => ({
                text: `Option ${String.fromCharCode(65 + optIdx)} for question ${q + 1}`,
                isCorrect: optIdx === correctIndex,
                order: optIdx,
              })),
            },
          },
        });
      }
    }
  }

  console.log("Seed complete ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
