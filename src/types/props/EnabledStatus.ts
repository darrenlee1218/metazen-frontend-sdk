enum EnabledStatus {
  ENABLED = 0,
  DISABLED = 1,
}

export const ACCOUNT_STATUS = {
  ENABLED: {
    value: 0,
    label: 'Enabled',
  },
  DISABLED: {
    value: 1,
    label: 'Disabled',
  },
} as const;

export default EnabledStatus;
