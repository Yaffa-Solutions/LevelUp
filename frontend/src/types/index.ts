export interface FeatureData {
  title: string;
  description: string;
  iconKey: 'evaluation' | 'roadmap' | 'matching' | 'community';
  color: string;
}

export interface RoleData {
  title: string;
  subtitle: string;
  description: string;
  iconKey: 'developer' | 'hunter';
  iconColor: string;
}