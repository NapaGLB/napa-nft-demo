export interface ISpace {
  id?: number;
  name?: string;
  type?: string;
  price?: number;
  bid?: number;
  owner?: string;
  img?: any;
  status?: number;
}
export interface ISpaceProps {
  data?: ISpace | undefined;
}
