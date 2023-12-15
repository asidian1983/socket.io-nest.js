import { EventStatus } from "./socket.io.model";

export interface ServiceInterface {
  status: EventStatus,
  data: {[k: string]: any}
}