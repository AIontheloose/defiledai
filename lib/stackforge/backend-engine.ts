export function recommendBackend(
  gpuName: string,
  gpuTier: string
) {
  const name = gpuName.toLowerCase();

  if (
    name.includes("3090") ||
    name.includes("4090") ||
    name.includes("5090")
  ) {
    return "ExLlamaV2";
  }

  if (
    name.includes("a100") ||
    name.includes("h100")
  ) {
    return "TensorRT-LLM";
  }

  if (
    name.includes("m4") ||
    name.includes("apple")
  ) {
    return "llama.cpp";
  }

  if (gpuTier === "entry") {
    return "llama.cpp";
  }

  return "ExLlamaV2";
}