export function parseTestQuestions(rawText: string) {
  const questionBlocks = rawText.split(/Qs\s*\d+\./i).filter(Boolean);

  const parsedQuestions = questionBlocks.map((block, index) => {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const question = lines[0] || "";

    const optionA =
      lines.find((line) => line.toLowerCase().startsWith("a.")) || "";

    const optionB =
      lines.find((line) => line.toLowerCase().startsWith("b.")) || "";

    const optionC =
      lines.find((line) => line.toLowerCase().startsWith("c.")) || "";

    const optionD =
      lines.find((line) => line.toLowerCase().startsWith("d.")) || "";

    const answerLine =
      lines.find((line) => line.toLowerCase().startsWith("ans:")) || "";

    const correctOption = answerLine.replace(/ans:/i, "").trim().toLowerCase();

    return {
      question,

      option_a: optionA.replace(/^a\./i, ""),

      option_b: optionB.replace(/^b\./i, ""),

      option_c: optionC.replace(/^c\./i, ""),

      option_d: optionD.replace(/^d\./i, ""),

      correct_option: correctOption,

      question_order: index + 1,
    };
  });

  return parsedQuestions;
}
