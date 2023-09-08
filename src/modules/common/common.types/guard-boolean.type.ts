import { Observable } from 'rxjs';

export type GuardBoolean = boolean | Promise<boolean> | Observable<boolean>;
