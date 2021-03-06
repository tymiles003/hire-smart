// Component Styles
const styles = theme => ({
  root: {
    paddingTop: '10vh',
    paddingBottom: '10vh'
  },

  container: {
    maxWidth: 360,
    margin: '0 auto',
    padding: theme.spacing.unit * 2,
  },

  buttonsContainer: {
    textAlign: 'right',
    marginTop: theme.spacing.unit
  },

  radioContainer: {
    marginTop: theme.spacing.unit * 2
  },

  radio: {
    width: 30,
    marginLeft: 0
  },

  radioLabel: {
    marginLeft: -5
  }
})

export default styles
