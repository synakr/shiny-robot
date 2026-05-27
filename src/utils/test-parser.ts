export function parseTestText(text: string) {
  const blocks = text.split(/(?=Qs\s*\d+\.)/gi).filter((q) => q.trim());

  return blocks.map((block, index) => {
    const questionMatch = block.match(
      /Qs\s*\d+\.\s*([\s\S]*?)(?=\n(?:Image:|a\.))/i,
    );

    const imageMatch = block.match(/Image:\s*(.+)/i);

    const answerMatch = block.match(/Ans:\s*([a-d])/i);

    return {
      question: questionMatch?.[1]?.trim() || "",

      question_order: index + 1,

      question_image_url: imageMatch?.[1]?.trim() || null,

      option_a: parseOption(block, "a")?.text || "",

      option_b: parseOption(block, "b")?.text || "",

      option_c: parseOption(block, "c")?.text || "",

      option_d: parseOption(block, "d")?.text || "",

      option_a_explanation: parseOption(block, "a")?.explanation || null,

      option_b_explanation: parseOption(block, "b")?.explanation || null,

      option_c_explanation: parseOption(block, "c")?.explanation || null,

      option_d_explanation: parseOption(block, "d")?.explanation || null,

      correct_option: answerMatch?.[1]?.toLowerCase() || "",
    };
  });
}

function parseOption(block: string, key: string) {
  const regex = new RegExp(`^${key}\\.\\s*(.*?)\\s*(?:\\[(.*?)\\])?$`, "im");

  const match = block.match(regex);

  if (!match) return null;

  return {
    text: match[1]?.trim() || "",

    explanation: match[2]?.trim() || null,
  };
}
