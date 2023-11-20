export interface IQueryOptions<T = void> {
  enabled?: boolean;
  onSuccess?: Function;
  initialData?: T;
  additionalQuerykey?: Array<string | number>;
}

export interface IMutationOptions {
  onSuccess?: Function;
}
