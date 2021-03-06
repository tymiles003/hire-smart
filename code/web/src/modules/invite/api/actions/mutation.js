// Imports
import axios from 'axios'

// App Imports
import { API_URL } from '../../../../setup/config/env'
import { queryBuilder } from '../../../../setup/helpers'

// Invite user to organization
export function inviteToOrganization(invite) {
  return dispatch => {
    return axios.post(API_URL, queryBuilder({
      type: 'mutation',
      operation: 'inviteToOrganization',
      data: invite,
      fields: ['_id']
    }))
  }
}
