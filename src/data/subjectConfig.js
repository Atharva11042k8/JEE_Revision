
/**
 * You can easily edit/add subjects and chapters here.
 * Structure:
 *  - name: Display name of subject
 *  - icon: Emoji or string icon
 *  - chapters: Array of chapters, each with display name and relative file path in /data/
 */
export const SUBJECT_CONFIG = [
  {
    name: 'Physics',
    icon: '⚛️',
    chapters: [
      { name: 'Kinematics', file: '/public/formulas/physics/kinematics.json' },
      { name: 'Vectors', file: '//public/formulas/physics/kinematics.json' },
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
