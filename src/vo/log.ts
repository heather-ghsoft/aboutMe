export class Log {
  constructor(
    public _id: string,
    public type:string,
    public uid: string,
    public createdAt: number,
    public createdBy: string,
    public content: string
  ){}
}
