export interface BrochureItem {
  id: string;
  text: string;
  completed: boolean;
  notes?: string;
}

export interface ContentBlock {
  id: string;
  title: string;
  items: BrochureItem[];
}

export interface BrochureSection {
  id: string;
  title: string;
  content: ContentBlock[];
}

export const brochureContent: BrochureSection[] = [
  {
    id: 'activity-restrictions',
    title: 'Activity Restrictions',
    content: [
      {
        id: 'immediate-post-op',
        title: 'Immediate Post-Operative Period (First 24-48 hours)',
        items: [
          {
            id: 'rest-in-bed',
            text: 'Rest in bed as much as possible',
            completed: false,
          },
          {
            id: 'avoid-sitting',
            text: 'Avoid sitting for long periods',
            completed: false,
          },
          {
            id: 'no-driving',
            text: 'Do not drive for at least 24 hours',
            completed: false,
          },
        ],
      },
      {
        id: 'first-week',
        title: 'First Week After Surgery',
        items: [
          {
            id: 'no-heavy-lifting',
            text: 'No heavy lifting (more than 10 pounds)',
            completed: false,
          },
          {
            id: 'no-strenuous-exercise',
            text: 'No strenuous exercise or activities',
            completed: false,
          },
          {
            id: 'walk-gently',
            text: 'Walk gently around the house',
            completed: false,
          },
          {
            id: 'avoid-bending',
            text: 'Avoid bending, twisting, or sudden movements',
            completed: false,
          },
        ],
      },
      {
        id: 'second-week',
        title: 'Second Week and Beyond',
        items: [
          {
            id: 'gradual-activity',
            text: 'Gradually increase activity as tolerated',
            completed: false,
          },
          {
            id: 'listen-to-body',
            text: 'Listen to your body - stop if you feel pain',
            completed: false,
          },
          {
            id: 'avoid-sex',
            text: 'Avoid sexual intercourse for 6 weeks',
            completed: false,
          },
          {
            id: 'no-tampons',
            text: 'No tampons for 6 weeks',
            completed: false,
          },
        ],
      },
    ],
  },
  {
    id: 'pain-management',
    title: 'Pain Management',
    content: [
      {
        id: 'medication',
        title: 'Medication',
        items: [
          {
            id: 'take-prescribed',
            text: 'Take prescribed pain medication as directed',
            completed: false,
          },
          {
            id: 'acetaminophen',
            text: 'Acetaminophen (Tylenol) for mild pain',
            completed: false,
          },
          {
            id: 'ibuprofen',
            text: 'Ibuprofen (Advil) for inflammation and pain',
            completed: false,
          },
          {
            id: 'avoid-aspirin',
            text: 'Avoid aspirin unless specifically prescribed',
            completed: false,
          },
        ],
      },
      {
        id: 'non-medication',
        title: 'Non-Medication Pain Relief',
        items: [
          {
            id: 'ice-packs',
            text: 'Apply ice packs to incision area for 20 minutes',
            completed: false,
          },
          {
            id: 'heat-packs',
            text: 'Use heat packs for muscle soreness',
            completed: false,
          },
          {
            id: 'rest',
            text: 'Get adequate rest and sleep',
            completed: false,
          },
          {
            id: 'comfortable-position',
            text: 'Find comfortable positions for sleeping',
            completed: false,
          },
        ],
      },
    ],
  },
  {
    id: 'warning-signs',
    title: 'Warning Signs/Symptoms',
    content: [
      {
        id: 'immediate-concerns',
        title: 'Contact Your Doctor Immediately If You Experience:',
        items: [
          {
            id: 'fever-over-101',
            text: 'Fever over 101°F (38.3°C)',
            completed: false,
          },
          {
            id: 'severe-pain',
            text: 'Severe pain not relieved by medication',
            completed: false,
          },
          {
            id: 'heavy-bleeding',
            text: 'Heavy vaginal bleeding (soaking a pad in 1 hour)',
            completed: false,
          },
          {
            id: 'foul-discharge',
            text: 'Foul-smelling vaginal discharge',
            completed: false,
          },
          {
            id: 'incision-problems',
            text: 'Redness, swelling, or drainage from incision',
            completed: false,
          },
          {
            id: 'chest-pain',
            text: 'Chest pain or difficulty breathing',
            completed: false,
          },
          {
            id: 'leg-pain',
            text: 'Pain, redness, or swelling in legs',
            completed: false,
          },
        ],
      },
    ],
  },
  {
    id: 'follow-up-schedule',
    title: 'Follow-up Schedule',
    content: [
      {
        id: 'post-op-visits',
        title: 'Post-Operative Visits',
        items: [
          {
            id: '2-week-visit',
            text: '2-week post-operative visit',
            completed: false,
          },
          {
            id: '6-week-visit',
            text: '6-week post-operative visit',
            completed: false,
          },
          {
            id: 'annual-checkup',
            text: 'Annual gynecological checkup',
            completed: false,
          },
        ],
      },
      {
        id: 'contact-info',
        title: 'Contact Information',
        items: [
          {
            id: 'emergency-number',
            text: 'Emergency contact number: [Your doctor\'s number]',
            completed: false,
          },
          {
            id: 'office-hours',
            text: 'Office hours: [Your doctor\'s office hours]',
            completed: false,
          },
        ],
      },
    ],
  },
  {
    id: 'healing-timeline',
    title: 'General Healing Timeline',
    content: [
      {
        id: 'week-1-2',
        title: 'Weeks 1-2: Initial Recovery',
        items: [
          {
            id: 'incision-healing',
            text: 'Incision healing begins',
            completed: false,
          },
          {
            id: 'pain-decreases',
            text: 'Pain gradually decreases',
            completed: false,
          },
          {
            id: 'energy-low',
            text: 'Energy levels may be low',
            completed: false,
          },
        ],
      },
      {
        id: 'week-3-4',
        title: 'Weeks 3-4: Gradual Improvement',
        items: [
          {
            id: 'more-energy',
            text: 'Energy levels improve',
            completed: false,
          },
          {
            id: 'less-pain',
            text: 'Significant pain reduction',
            completed: false,
          },
          {
            id: 'light-activities',
            text: 'Can resume light activities',
            completed: false,
          },
        ],
      },
      {
        id: 'week-5-6',
        title: 'Weeks 5-6: Near Full Recovery',
        items: [
          {
            id: 'normal-activities',
            text: 'Can resume most normal activities',
            completed: false,
          },
          {
            id: 'exercise-resume',
            text: 'Can resume exercise (with doctor approval)',
            completed: false,
          },
          {
            id: 'work-return',
            text: 'Can return to work (if approved by doctor)',
            completed: false,
          },
        ],
      },
    ],
  },
  {
    id: 'incision-care',
    title: 'Incision Care',
    content: [
      {
        id: 'daily-care',
        title: 'Daily Care',
        items: [
          {
            id: 'keep-clean',
            text: 'Keep incision clean and dry',
            completed: false,
          },
          {
            id: 'gentle-washing',
            text: 'Gently wash with mild soap and water',
            completed: false,
          },
          {
            id: 'pat-dry',
            text: 'Pat dry with clean towel',
            completed: false,
          },
          {
            id: 'no-scrubbing',
            text: 'Do not scrub or rub the incision',
            completed: false,
          },
        ],
      },
      {
        id: 'dressings',
        title: 'Dressings',
        items: [
          {
            id: 'change-dressings',
            text: 'Change dressings as instructed by your doctor',
            completed: false,
          },
          {
            id: 'watch-for-signs',
            text: 'Watch for signs of infection',
            completed: false,
          },
          {
            id: 'no-tight-clothing',
            text: 'Avoid tight clothing over incision',
            completed: false,
          },
        ],
      },
    ],
  },
  {
    id: 'diet-medications',
    title: 'Diet & Medications',
    content: [
      {
        id: 'diet-guidelines',
        title: 'Diet Guidelines',
        items: [
          {
            id: 'stay-hydrated',
            text: 'Stay well hydrated',
            completed: false,
          },
          {
            id: 'high-fiber',
            text: 'Eat high-fiber foods to prevent constipation',
            completed: false,
          },
          {
            id: 'small-meals',
            text: 'Eat small, frequent meals',
            completed: false,
          },
          {
            id: 'avoid-gas',
            text: 'Avoid foods that cause gas',
            completed: false,
          },
        ],
      },
      {
        id: 'medication-guidelines',
        title: 'Medication Guidelines',
        items: [
          {
            id: 'take-as-prescribed',
            text: 'Take all medications as prescribed',
            completed: false,
          },
          {
            id: 'finish-antibiotics',
            text: 'Finish all antibiotics if prescribed',
            completed: false,
          },
          {
            id: 'no-new-meds',
            text: 'Do not start new medications without doctor approval',
            completed: false,
          },
          {
            id: 'report-side-effects',
            text: 'Report any side effects to your doctor',
            completed: false,
          },
        ],
      },
    ],
  },
];
