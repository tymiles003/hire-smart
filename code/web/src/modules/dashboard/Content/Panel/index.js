// Imports
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// UI Imports
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import IconAdd from '@material-ui/icons/Add'
import IconCached from '@material-ui/icons/Cached'
import Fade from '@material-ui/core/Fade'
import { withStyles } from '@material-ui/core/styles'
import styles from './styles'

// App Imports
import { messageShow } from '../../../common/api/actions'
import { getListByClient } from '../../../panel/api/actions'
import CreateOrEdit from '../../../panel/Manage/CreateOrEdit'
import Loading from '../../../common/Loading'
import EmptyMessage from '../../../common/EmptyMessage'

// Component
class Panel extends PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      panels: [],
      drawerAdd: false
    }
  }

  componentDidMount() {
    this.refresh()
  }

  refresh = async (isLoading = true) => {
    this.isLoadingToggle(isLoading)

    const { client, getListByClient, messageShow } = this.props

    try {
      // Get panel list by clientId
      const response = await getListByClient({ clientId: client.item._id })

      if (response.data.errors && response.data.errors.length > 0) {
        messageShow(response.data.errors[0].message)
      } else {
        this.setState({
          panels: response.data.data.panelsByClient
        })
      }
    } catch(error) {
      messageShow('There was some error. Please try again.')
    } finally {
      this.isLoadingToggle(false)
    }
  }

  isLoadingToggle = isLoading => {
    this.setState({
      isLoading
    })
  }

  toggleDrawer = (open) => () => {
    this.setState({
      drawerAdd: open
    })
  }

  render() {
    const { classes, client } = this.props
    const { isLoading, panels, drawerAdd } = this.state

    return (
      <div className={classes.root}>
        {/* Actions */}
        <div className={classes.actions}>
          <Button onClick={this.toggleDrawer(true)}>
            <IconAdd className={classes.actionIcon} />
            Add
          </Button>

          <Button onClick={this.refresh}>
            <IconCached className={classes.actionIcon} />
            Refresh
          </Button>
        </div>

        <Divider className={classes.divider} />

        {/* Panel list */}
        {
          isLoading
            ? <Loading />
            : <Fade in={true}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Mobile</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {
                      panels && panels.length > 0
                        ? panels.map(panel => (
                          <TableRow key={panel._id}>
                            <TableCell>{ panel.name }</TableCell>
                            <TableCell>{ panel.email }</TableCell>
                            <TableCell>{ panel.mobile }</TableCell>
                          </TableRow>
                        ))
                        : <TableRow>
                          <TableCell colSpan={4}>
                            <EmptyMessage message={'You have not added any panel yet.'} />
                          </TableCell>
                        </TableRow>
                    }
                  </TableBody>
                </Table>
              </Fade>
        }

        {/* Candidate create or edit */}
        <Drawer anchor={'right'} open={drawerAdd} onClose={this.toggleDrawer(false)}>
          <div className={classes.drawer}>
            <CreateOrEdit
              elevation={0}
              clientId={client.item._id}
              clientShowLoading={false}
            />
          </div>
        </Drawer>
      </div>
    )
  }
}

// Component Properties
Panel.propTypes = {
  classes: PropTypes.object.isRequired,
  client: PropTypes.object.isRequired,
  getListByClient: PropTypes.func.isRequired,
  messageShow: PropTypes.func.isRequired
}

// Component State
function panelState(state) {
  return {
    client: state.client
  }
}

export default connect(panelState, { getListByClient, messageShow })(withStyles(styles)(Panel))