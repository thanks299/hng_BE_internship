import axios from 'axios';
import { GENDERIZE_URL, UPSTREAM_TIMEOUT_MS } from '../config.js';

/**
 * @typedef {Object} GenderizeResult
 * @property {string}      name
 * @property {string|null} gender
 * @property {number|null} probability
 * @property {number}      count
 */

/**
 * Fetches gender prediction from the Genderize API.
 * @param {string} name
 * @returns {Promise<GenderizeResult>}
 * @throws Will throw with a `kind` property: 'upstream' | 'timeout' | 'network'
 */
export async function fetchGender(name) {
  try {
    const { data } = await axios.get(GENDERIZE_URL, {
      params: { name },
      timeout: UPSTREAM_TIMEOUT_MS,
    });
    return data;
  } catch (err) {
    if (err.response) {
      const upstreamErr = new Error(
        `Upstream error from Genderize API: ${err.response.status} ${err.response.statusText}`
      );
      upstreamErr.kind = 'upstream';
      throw upstreamErr;
    }
    if (err.code === 'ECONNABORTED') {
      const timeoutErr = new Error('Request to Genderize API timed out.');
      timeoutErr.kind = 'timeout';
      throw timeoutErr;
    }
    const networkErr = new Error('Failed to reach the Genderize API.');
    networkErr.kind = 'network';
    throw networkErr;
  }
}
