import React from 'react'
import PropTypes from 'prop-types'

const REQUEST_PER_CLICK = 3
const PAGE_PER_REQUEST = 50

export default class DirectChildren extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      directChildren: [],
      isLoading: true,
      canShowMore: true,
      click: 0,
    }

    const pathWithoutTrailingSlash = this.props.path.replace(/\/$/, '')
    this.checkDirectReg = new RegExp(`^${pathWithoutTrailingSlash}/[^/]+/?$`)

    this.onShowMore = this.onShowMore.bind(this)
  }

  componentDidMount() {
    ;(async () => {
      const { directChildren, canShowMore } = await this.getDirectChildrenRepeat(0)
      this.setState({ directChildren, isLoading: false, canShowMore })
    })()
  }

  onShowMore() {
    this.setState({ isLoading: true, click: this.state.click + 1 }, async () => {
      const { directChildren, canShowMore } = await this.getDirectChildrenRepeat(this.state.click)
      this.setState({
        directChildren: this.state.directChildren.concat(directChildren),
        isLoading: false,
        canShowMore,
      })
    })
  }

  async getDirectChildren(offset) {
    try {
      const res = await this.props.crowi.apiGet('/pages.list', {
        path: this.props.path,
        offset,
      })
      return res.pages.map(page => page.path).filter(path => this.checkDirectReg.test(path))
    } catch (e) {
      console.error(e)
      return []
    }
  }

  async getDirectChildrenRepeat(start, end = start + 1) {
    let directChildren = []
    let res
    let count = start * REQUEST_PER_CLICK
    do {
      res = await this.getDirectChildren(count * PAGE_PER_REQUEST)
      directChildren = directChildren.concat(res)
      count++
    } while (count < end * REQUEST_PER_CLICK && res.length === PAGE_PER_REQUEST)
    return { directChildren, canShowMore: res.length === PAGE_PER_REQUEST }
  }

  render() {
    return (
      <div id="direct-children" style={{ borderTop: 'solid 1px #ccc' }}>
        <p style={{ margin: '10px 0 5px', fontSize: '1.2em' }}>直下のページ</p>
        <ul style={{ maxHeight: '20em', overflowX: 'hidden', overflowY: 'scroll' }}>
          {this.state.directChildren.map(child => (
            <li key={child}>
              <a href={child}>{child}</a>
            </li>
          ))}
        </ul>
        {this.state.isLoading ? '読み込み中...' : this.state.canShowMore ? <button onClick={this.onShowMore}>もっと表示する</button> : ''}
      </div>
    )
  }
}

DirectChildren.propTypes = {
  path: PropTypes.string.isRequired,
  crowi: PropTypes.object.isRequired,
}