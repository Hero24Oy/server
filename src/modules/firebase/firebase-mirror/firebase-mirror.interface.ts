import { FirebaseMirrorCoreService } from './firebase-mirror-core.interface';

export abstract class FirebaseMirrorService<
  Entity,
> extends FirebaseMirrorCoreService<Entity> {
  getByKey(key: string): Entity | undefined {
    return this.getTableData().get(key);
  }

  getAll(): Array<[string, Entity]> {
    return Array.from(this.getTableData());
  }
}
