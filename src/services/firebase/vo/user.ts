export class User {
  constructor(
    public displayName:string,
    public phoneNumber:string,
    public isPublic: boolean = false,
    public avatar?:string,
    public tags?:string[],
    public firstName?:string,
    public lastName?:string,
    public _id?:string,
    public friends?:User[],
    public about?:string
    ){}
}

