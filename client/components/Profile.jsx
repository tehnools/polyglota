import React from 'react'
import { connect } from 'react-redux'
import { Label, Flag, Card, Rating } from 'semantic-ui-react'

const primary = '#b1f0ee'
const secondary = '#00ffd0'

const theme = {
  header: {
    padding: '10px 0px'
  },
  image: {
    boxShadow: '1px 2px 9px -2px rgba(0,0,0,0.58)'
  },
  card: {
    borderRadius: '10px',
    maxWidth: '536px',
    boxShadow: '2px 3px 14px -7px rgba(0,0,0,0.62)'
  },
  tag: {
    marginBottom: '0.5em'
  },
  span: {
    fontSize: '1.25em',
    marginRight: '1em'
  },
  icon: {
    color: secondary
  },
  mainHeader: {
    padding: '5px',
    background: primary,
    marginBottom: '0',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center'
  },
  controls: {
    display: 'flex',
    width: 'inherit',
    height: '35px',
    padding: '1em'
  },
  button: {
    position: 'absolute',
    backgroundColor: primary,
    boxShadow: '2px 3px 14px -7px rgba(0,0,0,0.62)'
  },
  editButton: {
    left: '25%'
  },
  deleteButton: {
    right: '25%'
  },
  description: {
    wordWrap: 'break-word',
    flex: 'inherit'
  }
}

class Profile extends React.Component {
  render () {
    const { user: { name, languages, description }, children } = this.props

    const mapLanguage = (languages, color) => {
      if (!color) color = 'grey'
      return languages.map((lang, index) => {
        return languages && index <= 10
          ? (
            <Label key={index} color={color} style={theme.tag} size="large">
              <Flag name={lang.country} />
              {lang.name}
            </Label>
          ) : null
      })
    }
    return (
      <>
        <Card fluid centered style={{ ...theme.card, ...this.props.style }}>
          <Card.Header
            as="h2"
            content={name}
            style={theme.mainHeader} />
          {/* <Image src={image} style={theme.image} /> */}
          <Card.Content>
            {languages && mapLanguage(languages, 'teal')}
          </Card.Content>
          <Card.Content content={description} style={theme.description} />
          <Card.Header style={theme.header}>
            <Rating icon="star" defaultRating={5} maxRating={5} size="large" style={theme.icon} disabled />
          </Card.Header>
          {children}
        </Card>
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    userId: state.user.id
  }
}

export default connect(mapStateToProps)(Profile)
