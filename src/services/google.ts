import { OAuth2Client } from 'google-auth-library';
import config from '../configs//config';

const { clientId, clientSecret, redirectUrl } = config.google;

const client = new OAuth2Client(clientId, clientSecret, redirectUrl);
const ENDPOINT = {
  GET_INFO: 'https://www.googleapis.com/oauth2/v1/userinfo',
  GET_PROFILE: 'https://people.googleapis.com/v1/people/me',
};

export const loginPage = (): string => {
  return client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      // 'https://www.googleapis.com/auth/user.phonenumbers.read',
      // 'https://www.googleapis.com/auth/user.addresses.read',
    ],
    redirect_uri: redirectUrl,
  });
};

export const callBack = async (code: string): Promise<any> => {
  const { tokens } = await client.getToken(code);
  client.setCredentials(tokens);
  const { data: info } = await client.request({
    url: ENDPOINT.GET_INFO,
  });
  // const { data: profile } = await client.request({
  //   url: ENDPOINT.GET_PROFILE,
  //   params: {
  //     personFields: 'names,emailAddresses,genders,locales,photos,addresses,phoneNumbers',
  //   },
  // });

  const { id: googleId, email, name } = info as Record<any, string>;

  return {
    id: googleId,
    email,
    name,
    // phoneNumber,
  };
};
