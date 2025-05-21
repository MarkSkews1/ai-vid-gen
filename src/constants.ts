// constants.ts
export type StoryOption = {
  type: 'preset' | 'custom';
  label: string;
  image?: string;
};
export type StyleOption = {
  name: string;
  image: string;
};
export const storyOptions: StoryOption[] = [
  { type: 'preset', label: 'Adventure Story', image: '/images/adventure.jpg' },
  { type: 'preset', label: 'Funny Story', image: '/images/funny.jpg' },
  { type: 'preset', label: 'Scary Story', image: '/images/scary.jpg' },
  {
    type: 'preset',
    label: 'Inspirational Story',
    image: '/images/inspirational.jpg',
  },
  { type: 'preset', label: 'Romantic Story', image: '/images/romantic.jpg' },
  { type: 'preset', label: 'Sci-Fi Story', image: '/images/scifi.jpg' },
  { type: 'preset', label: 'Thriller Story', image: '/images/thriller.jpg' },
  { type: 'custom', label: 'Enter custom prompt', image: '/images/custom.jpg' },
];
export const styleOptions: StyleOption[] = [
  { name: 'Artistic', image: '/images/artistic.jpg' },
  { name: 'Realistic', image: '/images/realistic.jpg' },
  { name: 'Fantasy', image: '/images/fantasy.jpg' },
  { name: 'Dark', image: '/images/dark.jpg' },
  { name: 'Water color', image: '/images/watercolor.jpg' },
  { name: 'GTA', image: '/images/GTA.jpg' },
  { name: 'comic', image: '/images/comic.jpg' },
  { name: 'Paint', image: '/images/paint.jpg' },
];
