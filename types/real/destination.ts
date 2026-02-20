export interface RealDestinationType {
  id: string;
  name: string;
  image: string;
  division: string;
  summary: string;
  tags: string[];
  _count: {
    packages: number;
  };
}
