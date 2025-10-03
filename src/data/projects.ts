import { Project } from '../types/project';

export const projects: Project[] = [
  {
    id: 'sponge-city-park',
    title: 'Sponge City Park',
    description: 'Help us design a sustainable park that naturally manages stormwater and prevents flooding in our community.',
    category: 'Environment',
    status: 'Active',
    ideas: 142,
    deadline: '2025-11-15',
    image: '/images/sponge_city.jpg',
    color: 'from-emerald-500 to-teal-600',
    fullDescription: 'The Sponge City Park initiative aims to transform an underutilized urban space into a multifunctional green area that naturally manages stormwater runoff. This innovative approach combines sustainable design with community needs, creating a space that serves both environmental and recreational purposes. By incorporating permeable surfaces, native plantings, and rain gardens, the park will reduce flooding risks while providing residents with a beautiful, accessible green space for recreation and relaxation.',
    limitations: [
      'Reduce stormwater runoff by 40%',
      'Create 5 acres of green space',
      'Incorporate native plant species',
      'Design inclusive recreational areas',
      'Budget constraint: €2.5M maximum',
      'Must preserve existing mature trees',
      'Accessible pathways required',
      'Integration with existing drainage system',
      'Community engagement workshops needed'
    ]
  }
];
