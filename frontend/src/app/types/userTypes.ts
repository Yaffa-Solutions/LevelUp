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
  // skill_name: string;
  skill: { skill_name: string };
}

export interface User {
  first_name: string;
  last_name: string;
  job_title: string;
  profil_picture: string;
  about: string;
  levels: {
    // id: string;
    name: string;
  };
  experiences: Experience[];
  skillTalents: SkillTalent[];
}
