export interface AboutStat {
  percentage: string;
  description: string;
  citation: string;
}

export interface AboutProblemOrSolution {
  title: string;
  description: string;
}

export const aboutStats: AboutStat[] = [
  {
    percentage: '89%',
    description:
      'of citizens demand more say in infrastructure and urban planning projects',
    citation: 'TNS Emnid on behalf of the Bertelsmann Foundation (2012)',
  },
  {
    percentage: '<3%',
    description:
      "of citizens participate in Germany's largest city-wide participation project",
    citation: 'Press release of the "Stuttgart Bürgerhaushalt" project (2023)',
  },
  {
    percentage: '73%',
    description:
      'of urban project delays are due to a lack of societal and political acceptance',
    citation: 'Study by the Harvard Kennedy School (2014)',
  },
  {
    percentage: '19%',
    description:
      'of participants in civic engagement do not hold a higher education degree',
    citation:
      'Goethe University Frankfurt am Main on behalf of Mehr Demokratie e.V. (2019)',
  },
];

export const aboutProblems: AboutProblemOrSolution[] = [
  {
    title: 'Black Box',
    description:
      'Citizens submit ideas but never hear back. Lack of transparency leads to frustration.',
  },
  {
    title: 'Resource Drain',
    description:
      'Administrations drown in manual evaluation of unstructured emails and letters.',
  },
  {
    title: 'Guest Bubble',
    description:
      "Only the 'usual suspects' participate due to high barriers. Results are rarely representative.",
  },
  {
    title: 'Tool Jungle',
    description:
      'Isolated solutions and confusing apps cause citizens to drop out.',
  },
];

export const aboutSolutions: AboutProblemOrSolution[] = [
  {
    title: 'Transparent Loops',
    description:
      'Automated status updates and clear visualization of how input shapes the outcome.',
  },
  {
    title: 'AI-Assisted Workflows',
    description:
      'AI clusters similar ideas and summarizes feedback, saving hundreds of hours.',
  },
  {
    title: 'Intuitive by Design',
    description:
      'AI-powered tools that assists in ideation and explanation of proposals, paired with a modern interface.',
  },
  {
    title: 'Unified Platform',
    description:
      'One central hub for all projects. Single sign-on, maximum engagement.',
  },
];

export const aboutUsps = ['Open Source', 'Made in Germany'];
