import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';
import { ValidationMessageEnum } from './i18n/es.enum';

export const IS_CORREO_LISTA = 'correoLista';

const blackListEmails = [
  '10minutemail.com',
  'fremont.nodebalancer.linode.com',
  'yopmail.com',
  'cool.fr.nf',
  'jetable.fr.nf',
  'nospam.ze.tc',
  'nomail.xl.cx',
  'mega.zik.dj',
  'speed.1s.fr',
  'courriel.fr.nf',
  'moncourrier.fr.nf',
  'monemail.fr.nf',
  'monmail.fr.nf',
  'mailinator',
  'binkmail.com',
  'bobmail.info',
  'chammy.info',
  'devnullmail.com',
  'letthemeatspam.com',
  'mailinater.com',
  'mailinator.net',
  'mailinator2.com',
  'notmailinator.com',
  'reallymymail.com',
  'reconmail.com',
  'safetymail.info',
  'sendspamhere.com',
  'sogetthis.com',
  'spambooger.com',
  'spamherelots.com',
  'spamhereplease.com',
  'spamthisplease.com',
  'streetwisemail.com',
  'suremail.info',
  'thisisnotmyrealemail.com',
  'tradermail.info',
  'veryrealemail.com',
  'zippymail.info',
  'guerrillamail',
  'maildrop',
  'mailnesia',
];

export function correoLista(value: string): boolean {
  const nameEmail = value?.substring(0, value?.lastIndexOf('@'));
  const domainEmail = value?.substring(value?.lastIndexOf('@') + 1);
  const isValid =
    domainEmail && nameEmail
      ? !blackListEmails.some((domain) => domainEmail === domain)
      : false;

  return isValid;
}

export function CorreoLista(
  validationsOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: 'CORREO_LISTA',
      constraints: [],
      validator: {
        validate: (value): boolean => correoLista(value),
        defaultMessage: buildMessage(
          () => ValidationMessageEnum.CORREO_LISTA,
          validationsOptions,
        ),
      },
    },
    validationsOptions,
  );
}
