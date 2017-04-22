import React from 'react'
import _ from 'lodash'
import {Engine, World, Bodies, Render,Events,Body} from 'matter-js'

class App extends React.Component {
  state = {
    bodies: [],
    rejected: false,
  }

  componentDidMount() {
    this.startGame()
  }

  startGame() {
    this.engine = Engine.create()
    this.engine.world.gravity.y = 0

    // const ground = Bodies.rectangle(400, 610, 810, 10, { isStatic: true })
    // World.add(this.engine.world, [ground])

    Events.on(this.engine, 'afterUpdate', ({source: {world}}) => {
      const bodies = world.bodies.filter(body => body.label === 'Circle Body')

      bodies.forEach(body => {
        const prevScale = this.scales.get(body)
        if (prevScale > 8) {
          this.rejectGame()
          return
        }

        const nextScale = prevScale + .01
        this.scales.set(body, nextScale)
        Body.scale(body, 1 / prevScale, 1 / prevScale)
        Body.scale(body, nextScale, nextScale)
      })

      this.setState({bodies})
    })

    Engine.run(this.engine)

    this.scales = new WeakMap()

    const loop = () => {
      this.timerId = setTimeout(loop, _.random(500, 8000))

      const circle = Bodies.circle(_.random(500), _.random(600), 10)
      this.scales.set(circle, 1)
      World.addBody(this.engine.world, circle)
    }
    this.timerId = setTimeout(loop)
  }

  rejectGame() {
    clearTimeout(this.timerId)
    this.setState({rejected: true})
  }

  handleClick = body => {
    World.remove(this.engine.world, [body])
  }

  render() {
    const {bodies, rejected} = this.state

    return <div className="App">
      <svg className="App_game" width={500} height={600}>
        {this.state.bodies.map((body) =>
          <circle
            key={body.id}
            cx={body.position.x}
            cy={body.position.y}
            r={body.circleRadius}
            stroke="white"
            fill="gray"
            onClick={() => this.handleClick(body)} />
        )}
      </svg>
      <div className="App_alert" hidden={!rejected}>rejected !</div>
    </div>
  }
}

export default App
