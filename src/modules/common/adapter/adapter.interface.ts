export interface Adapter<InternalType, ExternalType> {
  toExternal(internal: InternalType): ExternalType;
  toInternal(external: ExternalType): InternalType;
}
