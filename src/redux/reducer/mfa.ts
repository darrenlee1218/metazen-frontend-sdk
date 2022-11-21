import { createSlice } from '@reduxjs/toolkit';

export interface MfaState {
  verified: boolean;
  openModal: boolean;
}

const initialState: MfaState = {
  verified: false,
  openModal: false,
};

export const mfaSlice = createSlice({
  name: 'mfa',
  initialState,
  reducers: {
    openMfaModal(state) {
      state.openModal = true;
    },
    closeMfaModal(state) {
      state.openModal = false;
    },
    setMfaVerified(state) {
      state.verified = true;
    },
    resetMfaState(state) {
      state = initialState;
    },
  },
});

export const { openMfaModal, closeMfaModal, setMfaVerified, resetMfaState } = mfaSlice.actions;
