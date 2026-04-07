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
    title: 'Treasury Bills: The Safest Bet for Students',
    slug: 'ghana-treasury-bills-guide',
    category: 'investment',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1000',
    intro: 'Looking for a low-risk way to grow your pocket money? Treasury Bills are the gold standard in Ghana.',
    content: 'Treasury Bills (T-Bills) are short-term debt instruments issued by the Government of Ghana. For students, they are perfect because they are backed by the government, meaning your principal is safe. You can start with as little as GHS 50 at most commercial banks or even through mobile money apps. They typically come in 91-day, 182-day, and 364-day tenors. The interest is usually higher than a regular savings account, making it a great place to park money you won\'t need for a few months.',
    tips: [
      'Start with a 91-day bill to see how it works before committing for longer.',
      'Reinvest your interest (roll-over) to benefit from compound interest.',
      'You can buy T-Bills directly from your phone using apps like Ecobank Mobile or GCB Mobile.',
      'Check the current BoG rates weekly to know the best time to buy.'
    ]
  },
  {
    id: '2',
    title: 'Mutual Funds: Let the Experts Grow Your Money',
    slug: 'ghana-mutual-funds-for-students',
    category: 'investment',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
    intro: 'Don\'t have time to track the stock market? Mutual funds like Databank E-Pack or IC Securities are built for you.',
    content: 'A Mutual Fund pools money from many investors to buy a diversified portfolio of stocks, bonds, or other securities. In Ghana, funds like Databank\'s MFund or E-Pack are very popular among students. They allow you to start with small monthly contributions (sometimes as low as GHS 20). Professional fund managers handle the complex decisions, while you benefit from the overall growth of the fund. It\'s an excellent way to build long-term wealth while focusing on your studies.',
    tips: [
      'Databank E-Pack is great for long-term goals (3+ years) like post-grad studies.',
      'MFund is better for shorter-term needs as it focuses on fixed-income securities.',
      'Set up a standing order from your bank account to automate your investments.',
      'Download the investment firm\'s app to track your portfolio daily.'
    ]
  },
  {
    id: '3',
    title: 'Investing in the Ghana Stock Exchange (GSE)',
    slug: 'starting-gse-as-a-student',
    category: 'investment',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1611974714024-462be042426d?auto=format&fit=crop&q=80&w=1000',
    intro: 'Own a piece of MTN, GCB, or Tullow Oil. Here is how to start trading stocks in Ghana.',
    content: 'Buying shares means you own a part of a company. When the company makes a profit, you can receive dividends, and if the company grows, your share value increases. Students can start by opening a Central Securities Depository (CSD) account through a licensed broker like IC Securities or Black Star Advisors. While stocks carry more risk than T-Bills, they offer the highest potential returns over many years. Focus on "Blue Chip" companies—large, stable firms with a history of paying dividends.',
    tips: [
      'MTN Ghana shares are often a popular starting point due to their low price per share.',
      'Use the "Agyapa" or similar retail trading apps to buy stocks easily.',
      'Don\'t panic when prices drop; investing in stocks is a marathon, not a sprint.',
      'Diversify: don\'t put all your money into just one company.'
    ]
  },
  {
    id: '4',
    title: 'Mobile Money (MoMo) Savings & Investments',
    slug: 'momo-savings-ghana',
    category: 'savings',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1000',
    intro: 'Your phone is more than just for calls; it\'s a powerful savings tool.',
    content: 'MTN MoMo, Vodafone Cash, and AirtelTigo Money all offer interest-bearing savings features. For example, MTN\'s "Y\'ello Save" or "MoMo Advance" (partnered with banks) allows you to earn interest on your balance. While the rates might be lower than T-Bills, the convenience is unmatched. It\'s perfect for "micro-savings"—rounding up your change or saving small amounts daily that you would otherwise spend on airtime or snacks.',
    tips: [
      'Enable "Auto-Save" features if available on your MoMo menu (*170# for MTN).',
      'Keep your MoMo PIN secret; your phone is now your bank.',
      'Use MoMo to buy T-Bills or contribute to Mutual Funds directly.',
      'Check your interest statements monthly to see your money growing.'
    ]
  },
  {
    id: '5',
    title: 'Side Hustles: Boosting Your Investment Capital',
    slug: 'student-side-hustles-ghana',
    category: 'income',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000',
    intro: 'Need more money to invest? Here are student-friendly ways to earn extra GHS in Ghana.',
    content: 'Sometimes the best investment is in your own ability to earn. Ghanaian students are finding creative ways to make money: from freelance graphic design and social media management to campus delivery services and private tutoring. The goal is to take the "extra" income from these hustles and move it straight into your T-Bills or Mutual Funds. This creates a powerful cycle of earning and investing that can set you up for life after graduation.',
    tips: [
      'Offer services on platforms like Fiverr or Upwork for dollar income.',
      'Start a small campus-based business like selling customized stationery or snacks.',
      'Monetize your skills: if you are good at a subject, tutor juniors for a fee.',
      'Always save at least 50% of your side hustle earnings.'
    ]
  }
];
