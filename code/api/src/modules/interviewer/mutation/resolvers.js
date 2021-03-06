// Imports
import isEmpty from 'validator/lib/isEmpty'

// App Imports
import params from '../../../setup/config/params'
import Activity from '../../activity/model'
import Interviewer from '../model'

// Create
export async function create(parentValue, { projectId, name, email, mobile }, { auth }) {
  if(auth.user && auth.user.id) {
    const interviewer = await Interviewer.create({
      organizationId: auth.user.organizationId,
      userId: auth.user.id,
      projectId,
      name,
      email,
      mobile
    })

    if(interviewer) {
      // Log activity
      await Activity.create({
        organizationId: auth.user.organizationId,
        userId: auth.user.id,
        projectId,
        interviewerId: interviewer._id,
        action: params.activity.types.create,
        message: `${ auth.user.name } added a new interviewer ${ name } (${ email }).`
      })
    }

    return interviewer
  }

  throw new Error('Please login to create interviewer.')
}

// Update
export async function update(parentValue, { id, projectId, name, email, mobile }, { auth }) {
  if(auth.user && auth.user.id && !isEmpty(id)) {
    return await Interviewer.updateOne(
      { _id: id },
      {
        $set: {
          projectId,
          name,
          email,
          mobile
        }
      }
    )
  }

  throw new Error('Please login to update interviewer.')
}

// Delete
export async function remove(parentValue, { id }, { auth }) {
  if(auth.user && auth.user.id) {
    return await Interviewer.remove({
      _id: _id,
      userId: auth.user.id
    })
  }

  throw new Error('Please login to delete interviewer.')
}
