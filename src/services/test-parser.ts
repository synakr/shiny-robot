export function parseTestText(text: string) {
  const questionBlocks = text.split(/(?=Qs\s*\d+\.)/gi).filter((q) => q.trim());

  const parsedQuestions = questionBlocks.map((block, index) => {
    // QUESTION
    const questionMatch = block.match(
      /Qs\s*\d+\.\s*([\s\S]*?)(?=\n(?:Image:|a\.))/i,
    );

    const question = questionMatch?.[1]?.trim() || "";

    // IMAGE
    const imageMatch = block.match(/Image:\s*(.+)/i);

    const questionImageUrl = imageMatch?.[1]?.trim() || null;

    // OPTIONS
    const optionA = parseOption(block, "a");

    const optionB = parseOption(block, "b");

    const optionC = parseOption(block, "c");

    const optionD = parseOption(block, "d");

    // ANSWER
    const answerMatch = block.match(/Ans:\s*([a-d])/i);

    const correctOption = answerMatch?.[1]?.toLowerCase() || "";

    return {
      question,

      question_order: index + 1,

      option_a: optionA?.text || "",

      option_b: optionB?.text || "",

      option_c: optionC?.text || "",

      option_d: optionD?.text || "",

      option_a_explanation: optionA?.explanation || null,

      option_b_explanation: optionB?.explanation || null,

      option_c_explanation: optionC?.explanation || null,

      option_d_explanation: optionD?.explanation || null,

      question_image_url: questionImageUrl,

      correct_option: correctOption,
    };
  });

  return parsedQuestions;
}

function parseOption(block: string, optionKey: string) {
  const regex = new RegExp(
    `^${optionKey}\\.\\s*(.*?)\\s*(?:\\[(.*?)\\])?$`,
    "im",
  );

  const match = block.match(regex);

  if (!match) return null;

  return {
    text: match[1]?.trim() || "",

    explanation: match[2]?.trim() || null,
  };
}
