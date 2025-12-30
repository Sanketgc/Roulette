import { WebSocket }  from "ws"
import { OutgoingMessage } from "./types";
import { User } from "./User";

let ID=1;

export class UserManager {
    private _users: User[]=[];
    private static _instance: UserManager;

    private constructor() {
        
    }

    public static getInstance(){
        if(!this._instance){
            this._instance = new UserManager();
    }
        return this._instance;
}

    addUser(ws: WebSocket, name: string) {
        let id = ID;
        this._users.push(new User(
       id,
       name,
       ws,
    ));

    ws.on("close", () => this.removeUser(id))
    ID++;

    }

    removeUser(id:number){
        this._users = this._users.filter(x => x.id !==id);
    }

    broadcast(message: OutgoingMessage, userID?: number){
        this._users.forEach(({id, ws}) => {
            if( userID !== id){
                ws.send(JSON.stringify(message));
            }
        })
    }


}