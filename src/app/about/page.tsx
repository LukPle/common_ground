import { AboutComparison } from '@/components/about/about_comparison';
import { AboutMission } from '@/components/about/about_mission';
import { AboutStatistics } from '@/components/about/about_statistics';
import { AboutTeam } from '@/components/about/about_team';
import { PageLayout } from '@/components/core/page_layout';
import {
  aboutProblems,
  aboutSolutions,
  aboutStats,
} from '@/data/about';
import { teamMembers } from '@/data/team_members';
import {
  fetchCompletedProjectsCount,
  fetchTotalIdeaCount,
} from '@/lib/supabase/queries.server';

export default async function About() {
  const [totalIdeas, completedProjects] = await Promise.all([
    fetchTotalIdeaCount(),
    fetchCompletedProjectsCount(),
  ]);

  return (
    <PageLayout>
      <AboutMission
        totalIdeas={totalIdeas}
        completedProjects={completedProjects}
      />
      <AboutStatistics stats={aboutStats} />
      <AboutComparison problems={aboutProblems} solutions={aboutSolutions} />
      <AboutTeam teamMembers={teamMembers} />
    </PageLayout>
  );
}
