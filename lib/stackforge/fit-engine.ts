export function getFitStatus(
  gpuVram: number,
  modelVram: number
) {
  if (gpuVram >= modelVram) {
    return "fit";
  }

  if (gpuVram >= modelVram * 0.5) {
    return "offload";
  }

  return "no-fit";
}