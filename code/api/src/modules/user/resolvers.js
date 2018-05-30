// Imports
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// App Imports
import serverConfig from '../../setup/config/server'
import { NODE_ENV } from '../../setup/config/env'
import params from '../../setup/config/params'
import DemoUser from '../demo-user/model'
import User from './model'
import Organization from '../organization/model'

// Create (Register)
export async function create(parentValue, { name, email, password }) {
  // Users exists with same email check
  const user = await User.findOne({ email })

  if (!user) {
    // User does not exists
    const passwordHashed = await bcrypt.hash(password, serverConfig.saltRounds)

    return await User.create({
      name,
      email,
      password: passwordHashed
    })
  } else {
    // User exists
    throw new Error(`The email ${ email } is already registered. Please try to login.`)
  }
}

// Login
export async function login(parentValue, { email, password }) {
  const user = await User.findOne({ email })

  if (!user) {
    // User does not exists
    throw new Error(`We do not have any user registered with ${ email } email address. Please signup.`)
  } else {
    const userDetails = user.get()

    // User exists
    const passwordMatch = await bcrypt.compare(password, userDetails.password)

    if (!passwordMatch) {
      // Incorrect password
      throw new Error(`Sorry, the password you entered is incorrect. Please try again.`)
    } else {
      const token = {
        id: userDetails._id,
        organizationId: userDetails.organizationId,
        name: userDetails.name,
        email: userDetails.email,
        role: userDetails.role
      }

      return {
        user: userDetails,
        token: jwt.sign(token, serverConfig.secret)
      }
    }
  }
}

// Create a demo user and login
export async function startNow(parentValue, {}, { auth }) {
  // Check if user is already logged in
  if(!auth.user) {
    throw new Error(`You are already logged in. Please go to your dashboard to continue.`)
  } else {
    try {
      let userDetails

      if(NODE_ENV === 'development') {
        // Use already created user instead of creating new every time
        userDetails = await User.findOne({email: 'user@hiresmart.app'})
      } else {
        // Create new Organization
        const organization = await Organization.create({
          name: 'Demo Organization'
        })

        // Create a new demo user
        const demoUser = await DemoUser.create({})

        // User does not exists
        const passwordHashed = await bcrypt.hash(demoUser._id + Math.random(), serverConfig.saltRounds)

        userDetails = await User.create({
          organizationId: organization._id,
          name: 'Demo User',
          email: `demo.user+${ demoUser._id }@${ params.site.domain }`,
          password: passwordHashed
        })
      }

      const token = {
        id: userDetails._id,
        organizationId: userDetails.organizationId,
        name: userDetails.name,
        email: userDetails.email,
        role: userDetails.role,
      }

      return {
        user: userDetails,
        token: jwt.sign(token, serverConfig.secret)
      }
    } catch(error) {
      throw new Error(`There was some error. Please try again.`)
    }
  }
}

// Get by ID
export async function getById(parentValue, { id }) {
  return await User.findOne({ _id: id })
}

// Get all
export async function getAll() {
  return await User.find()
}

// Get all
export async function getByOrganization(parentValue, { id }, { auth }) {
  if(auth.user && auth.user.id) {
    return await User.find({ organizationId: auth.user.organizationId })
  } else {
    throw new Error('Please login to view your organization.')
  }
}

// Create (Register)
export async function inviteToOrganization(parentValue, { name, email }, { auth }) {
  if(auth.user && auth.user.id) {
    // Users exists with same email check
    const user = await User.findOne({ email })

    if (!user) {
      // Create a new demo user
      const demoUser = await DemoUser.create({})

      // User does not exists
      const passwordHashed = await bcrypt.hash(demoUser._id + Math.random(), serverConfig.saltRounds)

      // @todo Send email

      return await User.create({
        organizationId: auth.user.organizationId,
        name,
        email,
        password: passwordHashed
      })
    } else {
      // User exists
      throw new Error(`The email ${ email } is already registered. Please ask the user to login.`)
    }
  } else {
    throw new Error('Please login to view invite team mate to your organization.')
  }
}

// Delete
export async function remove(parentValue, { id }) {
  return await User.remove({ _id: id })
}
