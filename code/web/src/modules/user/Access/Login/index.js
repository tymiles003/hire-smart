// Imports
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import isEmpty from 'validator/lib/isEmpty'

// UI Import
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import IconCheck from '@material-ui/icons/Check'
import { withStyles } from '@material-ui/core/styles'
import styles from './styles'

// App Imports
import { nullToEmptyString } from '../../../../setup/helpers'
import { messageShow } from '../../../common/api/actions'
import { login } from '../../api/actions/mutation'

// Component
class Login extends PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: ''
    }
  }

  login = async event => {
    event.preventDefault()

    const { email, password } = this.state

    if(!isEmpty(email) && !isEmpty(password)) {
      const { login } = this.props

      login({ email, password })
    }
  }

  onType = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    const { classes, user: { isLoading } } = this.props
    const { email, password } = this.state

    return (
      <div className={classes.root}>
        <Typography
          variant={'subheading'}
          color={'inherit'}
          className={classes.heading}
        >
          Already have an account? Please login:
        </Typography>

        <form onSubmit={this.login}>
          {/* Input - email */}
          <Grid item xs={12}>
            <TextField
              name={'email'}
              type={'email'}
              value={nullToEmptyString(email)}
              onChange={this.onType}
              label={'Email'}
              placeholder={'Enter email'}
              required={true}
              margin={'normal'}
              autoComplete={'off'}
              fullWidth
              autoFocus
            />
          </Grid>

          {/* Input - password */}
          <Grid item xs={12}>
            <TextField
              name={'password'}
              type={'password'}
              value={nullToEmptyString(password)}
              onChange={this.onType}
              label={'Password'}
              placeholder={'Enter password'}
              required={true}
              margin={'normal'}
              autoComplete={'off'}
              fullWidth
            />
          </Grid>

          {/* Button -  Save */}
          <Grid item xs={12} className={classes.buttonsContainer}>
            <IconButton
              type={'submit'}
              aria-label={'Save'}
              color={'primary'}
              disabled={isLoading}
            >
              <IconCheck />
            </IconButton>
          </Grid>
        </form>
      </div>
    )
  }
}

// Component Properties
Login.propTypes = {
  classes: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  messageShow: PropTypes.func.isRequired,
}

// Component State
function loginState(state) {
  return {
    user: state.user
  }
}

export default connect(loginState, { login, messageShow })(withStyles(styles)(Login))
