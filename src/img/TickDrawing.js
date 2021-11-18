import React from 'react'
import Svg, { G, Circle, Path } from 'react-native-svg'

const TickDrawing = props => (
    <Svg width={52} height={52} {...props}>
        <G fillRule="nonzero" fill="none">
            <Circle fill={props.color ? props.color : '#3ACC6C'} cx={26} cy={26} r={26} />
            <Path
                fill="#FFF"
                d="M15.125 22.603l9.902 9.111L39.053 11 44 15.143 25.027 40 11 24.262z"
            />
        </G>
    </Svg>
)

export default TickDrawing
