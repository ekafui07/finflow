import { Category } from '../types';

export interface Article {
  id: string;
  title: string;
  slug: string;
  intro: string;
  content: string;
  tips: string[];
  category: Category;
  readTime: string;
  image: string;
}

export const ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Budgeting on a Student Allowance',
    slug: 'student-budgeting-basics',
    category: 'others',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1000',
    intro: 'Managing your money when you have a fixed allowance can be tricky. Here is how to make every GHS count.',
    content: 'University life is often the first time many students have to manage their own finances. Whether your money comes from parents, a scholarship, or a part-time job, having a plan is essential. The key is to distinguish between "needs" (rent, basic groceries, books) and "wants" (eating out, new clothes, entertainment). By tracking your spending for just one month, you will be surprised at where your money actually goes.',
    tips: [
      'Use the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.',
      'Always pay your fixed costs (rent, utilities) as soon as you receive your allowance.',
      'Cook in bulk with friends to save on grocery costs.',
      'Look for student discounts everywhere—they add up significantly over a year.'
    ]
  },
  {
    id: '2',
    title: 'The Subscription Trap',
    slug: 'avoiding-subscription-trap',
    category: 'subscriptions',
    readTime: '3 min',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1000',
    intro: 'Netflix, Spotify, Canva, Gym... those small monthly payments can quietly drain your bank account.',
    content: 'Subscriptions are designed to be "set and forget," which is exactly why they are dangerous for a student budget. A GHS 15 monthly fee might seem small, but when you have five of them, you are spending GHS 900 a year on services you might not even use daily. Auditing your subscriptions every semester is a high-impact way to save money without much effort.',
    tips: [
      'Check your bank statement for recurring charges you forgot about.',
      'Share family plans with roommates or family members to split costs.',
      'Use "Free Tiers" whenever possible; you often don\'t need the premium features.',
      'Cancel immediately after a free trial if you don\'t plan to keep the service.'
    ]
  },
  {
    id: '3',
    title: 'Building an Emergency Fund',
    slug: 'emergency-fund-for-students',
    category: 'savings',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=1000',
    intro: 'Unexpected laptop repair? Last-minute trip home? An emergency fund is your financial safety net.',
    content: 'An emergency fund is money set aside specifically for unexpected expenses. For a student, this doesn\'t need to be thousands of cedis. Starting with a goal of GHS 500 can cover most minor crises. Having this cushion means you won\'t have to borrow money or skip meals when something goes wrong. It provides peace of mind that allows you to focus on your studies.',
    tips: [
      'Start small: even GHS 10 a week is progress.',
      'Keep this money in a separate account so you aren\'t tempted to spend it.',
      'Only use it for true emergencies—a sale on sneakers is not an emergency!',
      'Replenish the fund as soon as possible after you use it.'
    ]
  },
  {
    id: '4',
    title: 'Managing Part-Time Income',
    slug: 'part-time-job-money',
    category: 'income',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2959210?auto=format&fit=crop&q=80&w=1000',
    intro: 'Working while studying is hard. Make sure your hard-earned money works as hard as you do.',
    content: 'If you are balancing a part-time job with lectures, you are already ahead in terms of work ethic. However, it is easy to treat that extra income as "bonus money" and spend it all on lifestyle upgrades. Instead, use your job income to accelerate your financial goals. Whether that is paying off a small loan, saving for a post-grad trip, or investing in your professional development.',
    tips: [
      'Automate your savings: have a portion of your paycheck go directly to a savings goal.',
      'Don\'t let your spending rise just because your income did (lifestyle creep).',
      'Keep track of your work hours to ensure you are being paid correctly.',
      'Set aside a small "fun budget" from your earnings so you don\'t feel deprived.'
    ]
  },
  {
    id: '5',
    title: 'Saving vs. Spending: The Mindset',
    slug: 'saving-vs-spending-mindset',
    category: 'savings',
    readTime: '3 min',
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=1000',
    intro: 'Financial freedom isn\'t about how much you make, but how much you keep.',
    content: 'The "YOLO" (You Only Live Once) mindset can be devastating to a student\'s financial health. While it is important to enjoy your university years, true enjoyment comes from financial security. Learning to delay gratification is a superpower. Every time you choose to save instead of buying something impulsive, you are buying your future self more options and less stress.',
    tips: [
      'Wait 24 hours before making any non-essential purchase over GHS 50.',
      'Calculate the cost of an item in "hours worked" to see if it is truly worth it.',
      'Focus on experiences over things—memories last longer than gadgets.',
      'Celebrate small savings milestones to keep yourself motivated.'
    ]
  }
];
