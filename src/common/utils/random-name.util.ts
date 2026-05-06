import { uniqueNamesGenerator, adjectives, animals, colors } from 'unique-names-generator';

export function generateRandomAccountName(): string {
  // Genera algo como "EnergeticBlueToaster" o "BraveLion"
  // unique-names-generator trae miles de palabras en sus diccionarios
  const baseName = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    style: 'capital',
    separator: ''
  });

  const num = Math.floor(Math.random() * 9000) + 1000; // 1000 a 9999

  return `${baseName}${num}`;
}
