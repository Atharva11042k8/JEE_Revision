
// Structure:
//   - name: Display name of subject
//   - icon: Emoji or string icon
//   - chapters: Array of chapters, each with display name and relative file path (e.g. 'physics/kinematics.json')
export const SUBJECT_CONFIG = [
  {
    name: 'Physics',
    icon: '⚛️',
    chapters: [
      { name: 'Kinematics', file: 'physics/kinematics.json' },
      { name: 'Vectors', file: 'physics/vectors.json' },
      // Add/remove chapters as you like!
    ]
  },
  {
    name: 'Chemistry',
    icon: '🧪',
    chapters: [
      { name: 'Atomic Structure', file: 'chemistry/atomic_structure.json' },
      // Add/remove chapters…
    ],
  },
  {
    name: 'Mathematics',
    icon: '📐',
    chapters: [
      { name: 'Trigonometry', file: 'mathematics/trigonometry.json' },
      // Add/remove chapters…
    ]
  },
  // Add more subjects if needed!
];
