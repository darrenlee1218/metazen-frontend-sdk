import React from 'react';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { MenuProps } from '@mui/material/Menu';
import FormControl from '@mui/material/FormControl';
import { CustomTheme, useTheme } from '@mui/material/styles';
import KeyboardArrowdownIcon from '@mui/icons-material/KeyboardArrowDown';

interface DropdownItem {
  text: string;
  value: string;
}

interface DropdownProps {
  value?: string;
  list: DropdownItem[];
  optionAll?: DropdownItem;
  menuProps?: Partial<MenuProps>;
  onChange: (value: string) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({ list, optionAll, onChange, value, menuProps = {} }) => {
  const theme = useTheme() as CustomTheme;
  const listMergeOptionAll = optionAll ? [optionAll, ...list] : list;

  return (
    <FormControl sx={{ minWidth: '52px' }} size="small">
      <Select
        displayEmpty
        value={value}
        IconComponent={KeyboardArrowdownIcon}
        sx={{
          borderRadius: 3,
          height: 24,
          fontSize: 12,
          '.MuiSelect-icon': { fill: theme.palette.text.secondary, fontSize: 16 },
          '&.Mui-focused fieldset': {
            borderColor: `${theme.palette.primary.main} !important`,
          },
        }}
        MenuProps={{ ...menuProps }}
        onChange={(event) => onChange(event.target.value)}
      >
        {listMergeOptionAll.map(({ value: v, text }) => (
          <MenuItem key={v} value={v}>
            {text}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
