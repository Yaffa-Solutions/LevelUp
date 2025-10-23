export interface Experience {
  id: string;
  position: string;
  company_name: string;
  start_date: string;
  end_date?: string;
  description: string;
  employment_type: string;
}

export interface SkillTalent {
  id: string;
  skill: { skill_name: string };
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  job_title: string;
  profil_picture: string;
  about: string;
  levels: {
    name: string;
  };
  experiences: Experience[];
  skillTalents: SkillTalent[];
  role: 'TALENT' | 'HUNTER' | 'BOTH';
  company_name?: string;
  company_description?: string;
}
