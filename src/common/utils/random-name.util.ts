import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

const funnyObjects = [
  'Toaster', 'Spoon', 'Carrot', 'Muffin', 'Potato', 'Lamp', 'Cactus', 
  'Pancake', 'Teapot', 'Sofa', 'Waffle', 'Noodle', 'Sock', 'Broom', 
  'Fridge', 'Taco', 'Bucket', 'Brick', 'Mushroom', 'Donut', 'Helmet',
  'Pillow', 'Blender', 'Microwave', 'Chair', 'Pizza', 'Burrito', 'Bicycle'
];

// Unimos los animales con nuestra lista de objetos random
const animalsAndObjects = [...animals, ...funnyObjects];

export function generateRandomAccountName(): string {
  const baseName = uniqueNamesGenerator({
    dictionaries: [adjectives, animalsAndObjects],
    style: 'capital',
    separator: ''
  });

  const num = Math.floor(Math.random() * 9000) + 1000; // 1000 a 9999

  return `@${baseName}${num}`;
}
