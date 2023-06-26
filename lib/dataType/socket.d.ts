export type Callback = (data: any) => void;
export interface Subscription {
    id: string;
    callback: Callback;
    topic: string;
    privateChannel: boolean;
    strict?: boolean;
}
