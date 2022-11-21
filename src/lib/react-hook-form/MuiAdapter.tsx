import React, { ComponentProps, JSXElementConstructor } from 'react';
import { Controller, ControllerProps, FieldValues } from 'react-hook-form';

import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';

interface Props<ComponentT extends JSXElementConstructor<any>, TFieldValues extends FieldValues = FieldValues>
  extends Omit<ControllerProps<TFieldValues>, 'render'> {
  getProps: (params: Parameters<ControllerProps<TFieldValues>['render']>[0]) => ComponentProps<ComponentT>;
}

function withControllerAdapter<ComponentT extends JSXElementConstructor<any>>(Component: ComponentT) {
  return function MuiControllerAdapter<TFieldValues extends FieldValues = FieldValues>({
    control,
    name,
    getProps,
  }: Props<ComponentT, TFieldValues>) {
    return <Controller name={name} control={control} render={(params) => <Component {...getProps(params)} />} />;
  };
}

export const MuiAdapter = {
  TextField: withControllerAdapter(TextField),
  Checkbox: withControllerAdapter(Checkbox),
};
