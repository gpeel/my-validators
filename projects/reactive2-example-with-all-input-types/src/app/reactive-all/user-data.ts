export interface UserData {
  id: number;
  name: string | undefined;
  emailOffers: boolean;
  interfaceStyle: InterfaceStyleEnum | undefined;
  subscriptionType: SubscriptionOptions | undefined;
  subscriptionTypeComboCva: SubscriptionOptions | undefined;
  notes: string | undefined;
  uneditedField: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention

export enum InterfaceStyleEnum {
  Medium = 'Medium',
  Light = 'Light',
  Dark = 'Dark'
}

export type SubscriptionOptions = 'Monthly' | 'Annual' | 'Lifetime';
