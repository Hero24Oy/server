import {
  SubscriptionService,
  Unsubscribe,
} from '../../subscription-manager/subscription-manager.types';
import {
  FirebaseSnapshot,
  FirebaseTable,
  FirebaseTableReference,
} from '../firebase.types';
import { subscribeOnFirebaseEvent } from '../firebase.utils';

export abstract class FirebaseMirrorCoreService<Entity>
  implements SubscriptionService
{
  static dataByTableName: Map<string, Map<string, unknown>> = new Map();

  protected readonly tableName: string;

  constructor(protected readonly reference: FirebaseTableReference<Entity>) {
    this.tableName = this.getTableName(reference);
    this.initializeTableData();
  }

  public async subscribe(): Promise<Unsubscribe> {
    // * Due to the way firebase child_added works, it emits child_added event for every single node in collection
    // * then triggers for every new one
    // * await this.loadTableData() ensures that all the children nodes are loaded so that we can continue with initializing the table
    const childAddedUnsubscribe = subscribeOnFirebaseEvent(
      this.reference,
      'child_added',
      this.entityAddedOrUpdatedHandler,
    );

    await this.loadTableData();

    const unsubscribes = [
      subscribeOnFirebaseEvent<FirebaseTable<Entity>, 'child_changed'>(
        this.reference,
        'child_changed',
        this.entityAddedOrUpdatedHandler,
      ),
      childAddedUnsubscribe,
      subscribeOnFirebaseEvent(
        this.reference,
        'child_removed',
        this.entityRemovedHandler,
      ),
    ];

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }

  protected getTableData(): Map<string, Entity> {
    const { dataByTableName } = FirebaseMirrorCoreService;
    const { key: tableName } = this.reference;

    return dataByTableName.get(tableName || '') as Map<string, Entity>;
  }

  entityAddedOrUpdatedHandler = (snapshot: FirebaseSnapshot<Entity>): void => {
    const { key } = snapshot;
    const candidate = snapshot.val();

    if (key && candidate) {
      this.getTableData().set(key, candidate);
    }
  };

  private entityRemovedHandler = (snapshot: FirebaseSnapshot<Entity>): void => {
    const { key } = snapshot;
    const candidate = snapshot.val();

    if (key && candidate) {
      this.getTableData().delete(key);
    }
  };

  private getTableName(reference: FirebaseTableReference<Entity>): string {
    const { key: tableName } = reference;

    if (!tableName) {
      throw new Error('Table name is not defined');
    }

    return tableName;
  }

  private initializeTableData(): void {
    const { dataByTableName } = FirebaseMirrorCoreService;

    if (!dataByTableName.has(this.tableName)) {
      dataByTableName.set(this.tableName, new Map());
    }
  }

  private async loadTableData(): Promise<void> {
    // * once('value') is triggered only after all child_added finished emitting
    // * https://firebase.google.com/docs/database/admin/retrieve-data?hl=en#section-event-guarantees
    await this.reference.once('value');
  }
}
