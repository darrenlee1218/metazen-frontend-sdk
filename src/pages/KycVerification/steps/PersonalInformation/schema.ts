import * as yup from 'yup';
import moment from 'moment';

import { fieldErrorMessages } from '@lib/react-hook-form/field-error-messages';

import { FieldNames } from './field-names';

export const schema = yup.object().shape({
  [FieldNames.FirstName]: yup.string().nullable().required(fieldErrorMessages.fieldIsRequired),
  [FieldNames.MiddleName]: yup.string().nullable().optional(),
  [FieldNames.LastName]: yup.string().nullable().required(fieldErrorMessages.fieldIsRequired),
  [FieldNames.Dob]: yup
    .string()
    .nullable()
    .test('Above 18', fieldErrorMessages.ageValidation, (fieldValue) => {
      const date18YearsAgo = moment().subtract(18, 'years');
      return moment(fieldValue).isSameOrBefore(date18YearsAgo);
    })
    .required(fieldErrorMessages.fieldIsRequired),
  [FieldNames.Nationality]: yup.string().nullable().required(fieldErrorMessages.fieldIsRequired),

  /**
  [FieldNames.Phone]: yup
    .string()
    .nullable()
    .test('Conditional Phone Number', fieldErrorMessages.fieldIsRequired, (fieldValue, context) => {
      const currentCountryCode = context.parent[FieldNames.Nationality] as string;
      if (['BHS', 'KOR', 'SGP'].includes(currentCountryCode)) {
        return Boolean(fieldValue);
      }

      return true;
    })
    .test('Valid Phone Number', fieldErrorMessages.invalidPhoneNumber, (fieldValue, context) => {
      const currentCountryCode = context.parent[FieldNames.Nationality] as string;
      if (['BHS', 'KOR', 'SGP'].includes(currentCountryCode)) {
        return intlPhoneNumberRegex.test(fieldValue ?? '');
      }

      return true;
    }),

  [FieldNames.PlaceOfBirth]: yup
    .string()
    .nullable()
    .test('Conditional Place of Birth', fieldErrorMessages.fieldIsRequired, (fieldValue, context) => {
      const currentCountryCode = context.parent[FieldNames.Nationality] as string;
      if (['ARE', 'BHS'].includes(currentCountryCode)) {
        return Boolean(fieldValue);
      }

      return true;
    }),

  [FieldNames.Occupation]: yup
    .string()
    .nullable()
    .test('Conditional Occupation', fieldErrorMessages.fieldIsRequired, (fieldValue, context) => {
      const currentCountryCode = context.parent[FieldNames.Nationality] as string;
      if (['JPN'].includes(currentCountryCode)) {
        return Boolean(fieldValue);
      }

      return true;
    }),
  */

  [FieldNames.Agreement]: yup.bool().oneOf([true], fieldErrorMessages.fieldMustBeChecked),
});
