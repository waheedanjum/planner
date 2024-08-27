import ky from 'ky';

const dev = true;
const prefixUrl = dev
	? 'http://10.0.2.2:8000/'
	: `${process.env.API_URL ? process.env.API_URL : ''}/`;

export const instance = ky.extend({
	prefixUrl,
	headers: {
		Accept: 'application/json',
	},
});
